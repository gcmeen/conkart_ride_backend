const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const config = require('./config/config');
const appConfig = require('./lib/app.config');
const indexRoutes = require('./routes')
const db = require("./lib/db.connection");
(async () => { await db.connectDb() })();

//initialize cron job
const CronJob = require('./cron_jobs/index')
const app = express();

// app.use(cors());
/* for Angular Client (withCredentials) */
app.use(
  cors({
    credentials: true,
    origin: config.corsAllowOrigins,
  })
);

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "conkart-session",
    keys: [config.cookieSessionSecret], // should use as secret environment variable
    // httpOnly: true
  })
);

// handle api params and details
app.use(appConfig.trimParams);

// V1  api Routes
app.use('/api/v1',indexRoutes);

// handle api errors 
app.use(appConfig.handleError);

// set port, listen for requests
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
