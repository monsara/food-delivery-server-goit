const fs = require("fs");
const path = require("path");

const saveUser = user => {
  const userName = user.username;
  const filePath = path.join(
    __dirname,
    "../../",
    "db/users",
    `${userName}.json`
  );

  fs.writeFile(filePath, JSON.stringify(user), err => {
    if (err) throw err;
  });
};

const signUpRoute = (request, response) => {
  if (request.method === "POST") {
    let body = "";

    request.on("data", data => {
      body += data;

      console.log("Incoming data!!!!");
    });

    request.on("end", () => {
      const user = JSON.parse(body);
      saveUser(user);

      const responseSuccess = JSON.stringify({
        status: "success",
        user: user
      });
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(responseSuccess);
    });
  }
};

module.exports = signUpRoute;
