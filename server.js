require("dotenv").config(); //Load enviroment variables

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const querystring = require("querystring");
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Strava Auth Callback Route
app.get("/auth/strava/", (req, res) => {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const redirectUri = "http://localhost:5000/auth/strava/callback";
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=activity:read,profile:read_all`;
  res.redirect(authUrl);
});

//ROute to fetch all runs
app.get("/api/runs", async (req, res) => {
  const accessToken = req.headers.authorization;
  const page = parseInt(req.query.page) || 1; //Get the page number from query
  const limit = 5; // number limit of runs per page

  if (!accessToken) {
    return res.status(401).send("Access token is required");
  }

  try {
    //Fetch all activities from strava api
    const response = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 100, page: 1 },
      }
    );

    //FIlter out only the runs
    const runs = response.data.filter((activity) => activity.type === "Run");

    //Calculate total kilometers run in the last week
    const totalKilometersLastWeek = runs.reduce((total, run) => {
      const runDate = new Date(run.start_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      if (runDate >= weekAgo) {
        return total + run.distance / 1000; //conversion of meters to km
      }
      return total;
    }, 0);

    //Calculate total kilometers run in the current week
    const totalKilometersCurrentWeek = runs.reduce((total, run) => {
      const runDate = new Date(run.start_date);
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday as the start of the week
      if (runDate >= startOfWeek) {
        return total + run.distance / 1000; // Conversion of meters to km
      }
      return total;
    }, 0);

    //Paginate the results
    const paginatedRuns = runs.slice((page - 1) * limit, page * limit);

    //Send back to server
    res.json({
      runs: paginatedRuns,
      total: runs.length,
      totalKilometersLastWeek,
      totalKilometersCurrentWeek,
    });
  } catch (error) {
    console.error("Error fetching runs:", error);
    res.status(500).send("Error fetching runs");
  }
});

//Callback route to handle auth
app.get("/auth/strava/callback", async (req, res) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send("Authorization code missing");
  }

  try {
    //Exchange authorization code for access token
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

    //Fetch last run and gear data
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
});

//Function to fetch the last run data using Strava API
async function getLastRun(accessToken) {
  try {
    //Fetch athlete activities(last run data)
    const activitiesResponse = await axios.get(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { per_page: 10 }, // Fetch most recent activity
      }
    );

    //Find the first activity that is categotized as a "RUN"

    const lastRun = activitiesResponse.data.find(
      (activity) => activity.type === "Run"
    );
    if (!lastRun) {
      return { message: "No run found in the recent activities" };
    }

    //Format data we want to send back
    return {
      id: lastRun.id,
      name: lastRun.name,
      distance: (lastRun.distance / 1000).toFixed(2), //Convert meters to kilometers
      moving_time: (lastRun.moving_time / 60).toFixed(0) + "minutes", //Convert second to minutes
      date: new Date(lastRun.start_date).toLocaleDateString(),
      summary_polyline: lastRun.map.summary_polyline,
    };
  } catch (error) {
    console.error("Error fetching last run data:", error);
    throw error;
  }
}

//Function to fetch athlete profile and get gear ID
async function getAthleteProfile(accessToken) {
  try {
    const response = await axios.get("https://www.strava.com/api/v3/athlete", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    console.log("Athlete profile response:", response.data); //debug

    //Assume the primary running shoes are the default gear
    const primaryShoeId =
      response.data.shoes && response.data.shoes.length > 0
        ? response.data.shoes[0].id
        : null;
    return primaryShoeId;
  } catch (error) {
    console.error("Error fetching athlete profile:", error);
    throw error;
  }
}

//Function to fetch gear details using gear ID
async function getGearDetails(accessToken, gearId) {
  try {
    const response = await axios.get(
      `https://www.strava.com/api/v3/gear/${gearId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return {
      name: response.data.name,
      totalMileage: (response.data.distance / 1000).toFixed(2) + "km", //conversion to km
    };
  } catch (error) {
    console.error("Error fetching gear details:", error);
    throw error;
  }
}

//FUnction to get both last run and gear data
async function getLastRunAndGear(accessToken) {
  try {
    //Fetch athlete`s primary running shoe gear ID
    const gearId = await getAthleteProfile(accessToken);

    //Fetch last run data
    const lastRun = await getLastRun(accessToken);

    let gearDetails = null;
    if (gearId) {
      //Fetch gear details if gear ID is available
      gearDetails = await getGearDetails(accessToken, gearId);
    }

    return {
      lastRun,
      gear: gearDetails || { message: "No gear found or no shoes set" },
    };
  } catch (error) {
    console.error("Error fetching last run and gear data:", error);
    throw error;
  }
}

//Start express server
app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
