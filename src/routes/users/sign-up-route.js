const fs = require("fs");
const path = require("path");

const saveUser = user => {
  const filePath = path.join(
    __dirname,
    "../../",
    "db/users",
    `${user.username}.json`
  );

  fs.writeFile(filePath, JSON.stringify(user), error => {
    if (error) throw error;
  });
};

const signUpRoute = (request, response) => {
  if (request.method === "POST") {
    let data = "";

    request.on("data", chunk => {
      data += chunk;
    });

    request.on("end", () => {
      const user = JSON.parse(data);
      saveUser(user);

      const responseSuccess = JSON.stringify({
        status: "success",
        user: user
      });
      response.writeHead(201, { "Content-Type": "application/json" });
      response.end(responseSuccess);
    });
  }
};

module.exports = signUpRoute;
