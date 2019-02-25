const https = require("https");
const url = require("url");
const fs = require("fs");
const morgan = require("morgan");
const router = require("./routes/router");
const getRouteHandler = require("./helpers/get-route-handler");
const path = require("path");
const logger = morgan("combined");
const hostname = "127.0.0.1";

const https_options = {
  key: fs.readFileSync(path.join(__dirname, "./ssl/server.key")),
  cert: fs.readFileSync(path.join(__dirname, "./ssl/server.crt"))
};

const startServer = port => {
  const server = https.createServer(https_options, (request, response) => {
    const parsedUrl = url.parse(request.url);

    const func = getRouteHandler(router, parsedUrl.pathname) || router.default;
    logger(request, response, () => func(request, response));
  });

  server.listen(port);
  console.log(`Server running at https://${hostname}:${port}/`);
};

module.exports = startServer;
