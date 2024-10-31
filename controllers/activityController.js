const { fetchRunsData } = require("../services/activityService");
const { calculateTotalKilometers } = require("../utils/dateUtils");

/**
 * Controller to fetch and return paginated runs, and calculate total kilometers for the last and current weeks.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const fetchRuns = async (req, res) => {
  const accessToken = req.headers.authorization;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;

  if (!accessToken) {
    return res.status(401).json({ message: "Access token is required" });
  }

  try {
    const runs = await fetchRunsData(accessToken);
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
    res.status(500).json({ message: "Failed to fetch runs from Strava API" });
  }
};

module.exports = { fetchRuns };
