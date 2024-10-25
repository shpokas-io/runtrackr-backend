const axios = require("axios");

const fetchRuns = async (req, res) => {
  const accessToken = req.headers.authorization;
  const page = parseInt(req.query.page) || 1; // Get the page number from query
  const limit = 5; // number limit of runs per page

  if (!accessToken) {
    return res.status(401).send("Access token is required");
  }

  try {
    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 100, page: 1 },
      }
    );

    const runs = response.data.filter((activity) => activity.type === "Run");

    const totalKilometersLastWeek = calculateTotalKilometers(runs, 7);
    const totalKilometersCurrentWeek = calculateTotalKilometers(runs, 0);

    const paginatedRuns = runs.slice((page - 1) * limit, page * limit);

    res.json({
      runs: paginatedRuns,
      total: runs.length,
      totalKilometersLastWeek,
      totalKilometersCurrentWeek,
    });
  } catch (error) {
    console.error("Error fetching runs:", error);
    res.status(500).send("Error fetching runs");
  }
};

// Function to calculate total kilometers for a given week
const calculateTotalKilometers = (runs, daysAgo) => {
  const comparisonDate = new Date();

  // If daysAgo is 0, we set the start of the week (Monday)
  if (daysAgo === 0) {
    const dayOfWeek = comparisonDate.getDay();
    const firstDayOfWeek = new Date(comparisonDate);
    firstDayOfWeek.setDate(
      comparisonDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    );
    comparisonDate.setHours(0, 0, 0, 0); // Set to start of the day
    return runs.reduce((total, run) => {
      const runDate = new Date(run.start_date);
      if (runDate >= firstDayOfWeek) {
        return total + run.distance / 1000; // conversion of meters to km
      }
      return total;
    }, 0);
  } else {
    // For last week
    comparisonDate.setDate(comparisonDate.getDate() - daysAgo);
    return runs.reduce((total, run) => {
      const runDate = new Date(run.start_date);
      if (runDate >= comparisonDate) {
        return total + run.distance / 1000; // conversion of meters to km
      }
      return total;
    }, 0);
  }
};

module.exports = {
  fetchRuns,
};
