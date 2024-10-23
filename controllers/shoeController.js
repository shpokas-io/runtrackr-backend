const getShoeStats = (req, res) => {
  const shoeStats = {
    //Sample response, later change to actuall API DATA
    name: "Vaporfly",
    totalMileage: 373,
    maxMileage: 500,
  };
  req.json(shoeStats);
};

module.exports = { getShoeStats };
