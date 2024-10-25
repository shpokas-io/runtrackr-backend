require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");
const routes = require("./routes"); // Import routes
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Use routes
app.use("/auth/strava", routes.stravaAuth);
app.use("/api", routes.api);

// Start express server
app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
