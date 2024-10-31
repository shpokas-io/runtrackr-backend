const {
  generateAuthUrl,
  exchangeAuthorizationCode,
  getLastRunAndGear,
} = require("../services/stravaService");

/**
 * Redirects to the Strava OAuth authorization URL.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */

const getAuthUrl = (req, res) => {
  const authUrl = generateAuthUrl();
  res.redirect(authUrl);
};

/**
 * Handles the Strava OAuth callback, exchanges authorization code for access token,
 * and redirects to the frontend with user data.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleAuthCallback = async (req, res) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).json({ message: "Authorization code missing" });
  }

  try {
    const accessToken = await exchangeAuthorizationCode(authorizationCode);
    const data = await getLastRunAndGear(accessToken);

    const redirectUri = `${process.env.FRONTEND_URL}/?data=${encodeURIComponent(
      JSON.stringify({ accessToken, lastRun: data.lastRun, gear: data.gear })
    )}`;
    res.redirect(redirectUri);
  } catch (error) {
    console.error("Error during token exchange:", error);
    res.status(500).json({ message: "Error during token exchange" });
  }
};

module.exports = {
  getAuthUrl,
  handleAuthCallback,
};
