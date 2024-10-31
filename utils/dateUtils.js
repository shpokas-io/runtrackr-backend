/**
 * Calculate total kilometers of runs within the specified timeframe.
 * @param {Array} runs - List of run activities
 * @param {number} daysAgo - Days ago to start calculation (0 for current week)
 * @returns {number} - Total kilometers
 */

const calculateTotalKilometers = (runs, daysAgo) => {
  const now = new Date();

  // Define week boundaries based on daysAgo
  const startOfCurrentWeek = calculateComparisonDate(now, 0); // Start of this week (Monday)
  const startOfLastWeek = calculateComparisonDate(now, 7); // Start of last week (previous Monday)
  const endOfLastWeek = new Date(startOfCurrentWeek);

  const totalDistance = runs.reduce((total, run) => {
    const runDate = new Date(run.start_date);

    // Only add runs within the specified week
    if (daysAgo === 7) {
      // For last week: check if the run is between startOfLastWeek and endOfLastWeek
      if (runDate >= startOfLastWeek && runDate < endOfLastWeek) {
        return total + run.distance / 1000;
      }
    } else if (daysAgo === 0) {
      // For current week: check if the run is on or after the start of this week
      if (runDate >= startOfCurrentWeek) {
        return total + run.distance / 1000;
      }
    }

    return total;
  }, 0);

  return Math.round(totalDistance * 100) / 100;
};

/**
 * Calculate the start date of the week (Monday) based on the current date and offset.
 * @param {Date} currentDate - The date from which to calculate
 * @param {number} daysAgo - 0 for current week, 7 for previous week
 * @returns {Date} - Date representing the start of the week
 */
const calculateComparisonDate = (currentDate, daysAgo) => {
  const comparisonDate = new Date(currentDate);
  const dayOfWeek = comparisonDate.getDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const offsetDays = daysAgo + daysFromMonday;

  // Set the date to the correct Monday, then adjust to the start of that day
  comparisonDate.setDate(comparisonDate.getDate() - offsetDays);
  comparisonDate.setHours(0, 0, 0, 0);
  return comparisonDate;
};

module.exports = { calculateTotalKilometers };
