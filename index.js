const express = require("express");
const winston = require("winston");
const app = express();

const connectionString = "mongodb://localhost:27017/demo";

require("./startup/log")(connectionString);
require("./startup/route")(app);
require("./startup/db")(connectionString);
require("./startup/config")();

// throw new Error("==uncaught error==");
// const p = Promise.reject(new Error("==promise error=="));
// p.then((res) => console.log(res));

const port = process.env.PORT || 4000; //set PORT=4000

app.listen(port, () => {
  winston.info(`server listening to http://localhost:${port}`);
});
