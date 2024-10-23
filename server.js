require("dotenv").config(); //Load enviroment variables

const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Strava Auth Callback Route
app.get("/auth/strava/", (req, res) => {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = "http://localhost:5000/auth/strava/callback";
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read`;
  res.redirect(authUrl);
});

//Callback route to handle auth
app.get("/auth/strava/callback", async (req, res) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    //exchange authorization code for access token
    const response = await axios.post(
      "https://www.strava.com/oauth/token",
      querystring.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: authorizationCode,
        grant_type: "authorization_code",
      })
    );

    const accessToken = response.data.access_token;

    //Save accessTOken and fetch last run data
    const lastRun = await getLastRun(accessToken);
    res.json(lastRun);
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.status(500).send("Error during token exchange");
  }
});

//FUnction to fetch the last run data using Strava API
async function getLastRun(accessToken) {
  try {
    //Fetch athlete activities(last run data)
    const activitiesResponse = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 1 }, // Fetch most recent activity
      }
    );

    const lastRun = activitiesResponse.data[0]; // Get the first recent activity

    //Format data we want to send back
    return {
      name: lastRun.name,
      distance: (lastRun.distance / 1000).toFixed(2), //Convert meters to kilometers
      moving_time: (lastRun.moving_time / 60).toFixed(0) + "minutes", //Convert second to minutes
      date: new Date(lastRun.start_date).toLocaleDateString(),
      map_picture: lastRun.map?.summary_polyline || "No map available",
    };
  } catch (error) {
    console.error("Error fetching last run data:", error);
    throw error;
  }
}

//Start express server
app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
