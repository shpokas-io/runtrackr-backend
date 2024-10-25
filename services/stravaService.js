const axios = require("axios");
const querystring = require("querystring");

async function getLastRun(accessToken) {
  try {
    const activitiesResponse = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 10 },
      }
    );

    const lastRun = activitiesResponse.data.find(
      (activity) => activity.type === "Run"
    );
    if (!lastRun) {
      return { message: "No run found in the recent activities" };
    }

    return {
      id: lastRun.id,
      name: lastRun.name,
      distance: (lastRun.distance / 1000).toFixed(2),
      moving_time: (lastRun.moving_time / 60).toFixed(0) + " minutes",
      date: new Date(lastRun.start_date).toLocaleDateString(),
      summary_polyline: lastRun.map.summary_polyline,
    };
  } catch (error) {
    console.error("Error fetching last run data:", error);
    throw error;
  }
}

async function getAthleteProfile(accessToken) {
  try {
    const response = await axios.get("https://www.strava.com/api/v3/athlete", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const primaryShoeId =
      response.data.shoes && response.data.shoes.length > 0
        ? response.data.shoes[0].id
        : null;
    return primaryShoeId;
  } catch (error) {
    console.error("Error fetching athlete profile:", error);
    throw error;
  }
}

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
      totalMileage: (response.data.distance / 1000).toFixed(2) + " km",
    };
  } catch (error) {
    console.error("Error fetching gear details:", error);
    throw error;
  }
}

async function getLastRunAndGear(accessToken) {
  try {
    const gearId = await getAthleteProfile(accessToken);
    const lastRun = await getLastRun(accessToken);

    let gearDetails = null;
    if (gearId) {
      gearDetails = await getGearDetails(accessToken, gearId);
    }

    return {
      lastRun,
      gear: gearDetails || { message: "No gear found or no shoes set" },
    };
  } catch (error) {
    console.error("Error fetching last run and gear data:", error);
    throw error;
  }
}

module.exports = {
  getLastRunAndGear,
};
