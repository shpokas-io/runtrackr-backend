/**
 * Calculate the total kilometers run within the specified timeframe.
 * @param {Array} runs - List of run activities
 * @param {number} daysAgo - Days ago to start calculation (0 for current week, 7 for last week)
 * @returns {number} - Total kilometers
 */
const calculateTotalKilometers = (runs, daysAgo) => {
  const now = new Date();
  const startOfWeek = getStartOfWeek(now, daysAgo);
  const endOfWeek = daysAgo === 7 ? getStartOfWeek(now, 0) : now;

  const totalDistance = runs.reduce((total, run) => {
    const runDate = new Date(run.start_date);
    if (runDate >= startOfWeek && runDate < endOfWeek) {
      return total + run.distance / 1000;
    }
    return total;
  }, 0);

  return Math.round(totalDistance * 100) / 100;
};

/**
 * Get the start date of the week based on the given offset.
 * @param {Date} currentDate - The date from which to calculate
 * @param {number} daysAgo - 0 for current week, 7 for previous week
 * @returns {Date} - Start date of the specified week
 */
const getStartOfWeek = (currentDate, daysAgo) => {
  const date = new Date(currentDate);
  const dayOfWeek = date.getDay() || 7;
  date.setDate(date.getDate() - dayOfWeek + 1 - daysAgo);
  date.setHours(0, 0, 0, 0);
  return date;
};

module.exports = { calculateTotalKilometers };
