require("dotenv").config(); //Load enviroment variables

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//Defining structure
app.use("/api/shoes", require("./routes/shoeRoutes"));
app.use("/api/runs", require("./routes/runRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
