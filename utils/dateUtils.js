/**
 * Calculate total kilometers of runs within the specified timeframe.
 * @param {Array} runs - List of run activities
 * @param {number} daysAgo - Days ago to start calculation (0 for current week)
 * @returns {number} - Total kilometers
 */

const calculateTotalKilometers = (runs, daysAgo) => {
  const now = new Date();
  const comparisonDate = calculateComparisonDate(now, daysAgo);

  const totalDistance = runs.reduce((total, run) => {
    const runDate = new Date(run.start_date);
    if (runDate >= comparisonDate && (daysAgo === 0 || runDate < now)) {
      return total + run.distance / 1000;
    }
    return total;
  }, 0);

  return Math.round(totalDistance * 100) / 100;
};

/**
 * Calculate the comparison date based on the specified timeframe.
 * @param {Date} currentDate - Current date
 * @param {number} daysAgo - Days ago to calculate from
 * @returns {Date} - Comparison date
 */
const calculateComparisonDate = (currentDate, daysAgo) => {
  const comparisonDate = new Date(currentDate);
  if (daysAgo === 0) {
    const dayOfWeek = comparisonDate.getDay();
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    comparisonDate.setDate(comparisonDate.getDate() - daysFromMonday);
  } else {
    comparisonDate.setDate(
      comparisonDate.getDate() - (7 + (comparisonDate.getDay() - 1))
    );
  }
  comparisonDate.setHours(0, 0, 0, 0);
  return comparisonDate;
};

module.exports = { calculateTotalKilometers };
