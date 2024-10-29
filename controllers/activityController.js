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

    console.log("Total Kilometers Last Week:", totalKilometersLastWeek);
    console.log("Total Kilometers Current Week:", totalKilometersCurrentWeek);

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
  const now = new Date();

  // Set the start of the week to Monday for the current week calculation (daysAgo = 0)
  const comparisonDate = new Date(now);
  if (daysAgo === 0) {
    const dayOfWeek = comparisonDate.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    comparisonDate.setDate(comparisonDate.getDate() - daysFromMonday);
  } else {
    // For last week, start on the Monday of last week
    comparisonDate.setDate(
      comparisonDate.getDate() - (7 + (comparisonDate.getDay() - 1))
    );
  }

  comparisonDate.setHours(0, 0, 0, 0); // Set time to start of the day

  const totalDistance = runs.reduce((total, run) => {
    const runDate = new Date(run.start_date);
    if (runDate >= comparisonDate && (daysAgo === 0 || runDate < now)) {
      return total + run.distance / 1000; // Convert meters to kilometers
    }
    return total;
  }, 0);

  // Return the total distance rounded to two decimal places
  return Math.round(totalDistance * 100) / 100;
};

module.exports = {
  fetchRuns,
};
