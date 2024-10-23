require("dotenv").config(); //Load enviroment variables

const axios = require("axios");
const querystring = require("querystring");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

// Strava Auth Callback Route
app.get("/auth/strava/callback", async (req, res) => {
  const authorizationCode = req.query.code;

  try {
    //Exchange the authorization code for an access token
    const response = await axios.post(
      "https://www.strava.com/oauth/token",
      querystring.stringify({
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: authorizationCode,
        grant_type: "authorization_code",
      })
    );
    //Log the access token to the console
    console.log("Access Token:", accessToken);

    //send a response back to the client
    res.send("Authorization successful! You now have an access token");
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).send("Error during token exchange");
  }
});

//Run the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
