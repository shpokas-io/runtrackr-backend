const axios = require("axios");
const querystring = require("querystring");

/**
 * Generates the Strava OAuth authorization URL.
 * @returns {string} - The authorization URL for Strava OAuth
 */
function generateAuthUrl() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = process.env.STRAVA_REDIRECT_URI;
  return `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read,profile:read_all`;
}

/**
 * Exchanges an authorization code for an access token.
 * @param {string} authorizationCode - The authorization code from Strava
 * @returns {string} - The access token
 * @throws Will throw an error if the token exchange fails
 */
async function exchangeAuthorizationCode(authorizationCode) {
  try {
    const response = await axios.post(
      "https://www.strava.com/oauth/token",
      querystring.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: authorizationCode,
        grant_type: "authorization_code",
      })
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error during token exchange:", error);
    throw new Error("Failed to exchange authorization code for access token");
  }
}

/**
 * Fetches the athlete's recent activities and returns the last run.
 * @param {string} accessToken - Strava access token
 * @returns {Object} - Data for the last run
 * @throws Will throw an error if fetching the last run fails
 */
async function getLastRun(accessToken) {
  try {
    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 10 },
      }
    );

    const lastRun = response.data.find((activity) => activity.type === "Run");

    if (!lastRun) {
      return { message: "No run found in recent activities" };
    }

    return {
      id: lastRun.id,
      name: lastRun.name,
      distance: (lastRun.distance / 1000).toFixed(2),
      moving_time: `${(lastRun.moving_time / 60).toFixed(0)} minutes`,
      date: new Date(lastRun.start_date).toLocaleDateString(),
      summary_polyline: lastRun.map.summary_polyline,
    };
  } catch (error) {
    console.error("Error fetching last run data:", error);
    throw new Error("Failed to fetch last run data from Strava");
  }
}

/**
 * Fetches the athlete's profile to retrieve the primary shoe ID.
 * @param {string} accessToken - Strava access token
 * @returns {string|null} - The ID of the primary shoe, or null if none found
 * @throws Will throw an error if fetching the athlete profile fails
 */
async function getAthleteProfile(accessToken) {
  try {
    const response = await axios.get("https://www.strava.com/api/v3/athlete", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data.shoes?.[0]?.id || null;
  } catch (error) {
    console.error("Error fetching athlete profile:", error);
    throw new Error("Failed to fetch athlete profile from Strava");
  }
}

/**
 * Fetches the details for a specific piece of gear (e.g., primary shoes).
 * @param {string} accessToken - Strava access token
 * @param {string} gearId - ID of the gear to retrieve
 * @returns {Object} - Gear details including name and total mileage
 * @throws Will throw an error if fetching the gear details fails
 */
async function getGearDetails(accessToken, gearId) {
  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/gear/${gearId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return {
      name: response.data.name,
      totalMileage: `${(response.data.distance / 1000).toFixed(2)} km`,
    };
  } catch (error) {
    console.error("Error fetching gear details:", error);
    throw new Error("Failed to fetch gear details from Strava");
  }
}

/**
 * Retrieves both the last run and gear details for an athlete.
 * @param {string} accessToken - Strava access token
 * @returns {Object} - Contains last run details and gear information
 * @throws Will throw an error if fetching either the last run or gear fails
 */
async function getLastRunAndGear(accessToken) {
  try {
    const lastRun = await getLastRun(accessToken);
    const gearId = await getAthleteProfile(accessToken);

    const gearDetails = gearId
      ? await getGearDetails(accessToken, gearId)
      : null;

    return {
      lastRun,
      gear: gearDetails || { message: "No gear found or no shoes set" },
    };
  } catch (error) {
    console.error("Error fetching last run and gear data:", error);
    throw new Error("Failed to fetch last run and gear details from Strava");
  }
}

module.exports = {
  generateAuthUrl,
  exchangeAuthorizationCode,
  getLastRunAndGear,
};
