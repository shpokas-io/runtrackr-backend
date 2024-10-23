const getLastRun = (req, res) => {
  const lastRun = {
    date: "2024-10-20",
    distance: 10, //Km
    duration: "50 minutes",
  };
  req.json(lastRun);
};

module.exports = { getLastRun };
