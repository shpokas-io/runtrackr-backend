const axios = require("axios");

/**
 * Fetch activities from Strava API and filter for "Run" activities
 * @param {string} accessToken - User's access token
 * @returns {Array} - Array of running activities
 */

const fetchRunsData = async (accessToken) => {
  const response = await axios.get(
    "https://www.strava.com/api/v3/athlete/activities",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { per_page: 100, page: 1 },
    }
  );
  return response.data.filter((activity) => activity.type === "Run");
};

module.exports = { fetchRunsData };
