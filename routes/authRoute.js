//Redirect user to Strava authorization page
application.get("/auth/strava", (req, res) => {
  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${process.env.STRAVA_CLIENT_ID}&redirect_uri=${process.env.STRAVA_REDIRECT_URI}&response_type=code&scope=read,activity:read`;
  res.redirect(stravaAuthUrl);
});
