const axios = require("axios");
const querystring = require("querystring");
const { getLastRunAndGear } = require("../services/stravaService");

const getAuthUrl = (req, res) => {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = "http://localhost:5000/auth/strava/callback";
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read,profile:read_all`;
  res.redirect(authUrl);
};

const handleAuthCallback = async (req, res) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send("Authorization code missing");
  }

  try {
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

    // Fetch last run and gear data
    const data = await getLastRunAndGear(accessToken);

    // Redirect to the frontend with user data
    const redirectUri = `http://localhost:5173/?data=${encodeURIComponent(
      JSON.stringify({ accessToken, lastRun: data.lastRun, gear: data.gear })
    )}`;
    res.redirect(redirectUri);
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.status(500).send("Error during token exchange");
  }
};

module.exports = {
  getAuthUrl,
  handleAuthCallback,
};
