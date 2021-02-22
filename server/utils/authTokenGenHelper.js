var http = require("http");
const jwt = require("jsonwebtoken");

const makeAuthTokenReq = (req, res, next) => {
  //The url we want is `www.nodejitsu.com:1337/`
  var options = {
    host: "localhost",
    path: "/api/auth/new-auth-token",
    //since we are listening on a custom port, we need to specify it by hand
    port: "5000",
    //This is what changes the request to a POST request
    method: "GET",
    headers: {
      "refresh-token": req.header("refresh-token"),
    },
  };
  var str = "";

  callback = function (response) {
    console.log("you called calllback");
    response.on("data", function (chunk) {
      str += chunk;
    });

    response.on("end", function () {
      console.log(str);
      str = JSON.parse(str);
      if (str.auth_token) {
        const verified = jwt.verify(
          str.auth_token,
          process.env.AUTH_TOKEN_SECRET
        );
        req.user = verified;
        console.log(req.user);
        next();
      } else {
        return res.json(str);
      }
    });
    req.on("error", (error) => {
      console.error(error);
    });
  };

  var req = http.request(options, callback);
  //This is the data we are posting, it needs to be a string or a buffer
  req.write(str);
  req.end();
  return req;
};

module.exports.makeAuthTokenReq = makeAuthTokenReq;
