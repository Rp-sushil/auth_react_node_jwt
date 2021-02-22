const jwt = require("jsonwebtoken");
var http = require("http");

// const { makeAuthTokenReq } = require("../utils/authTokenGenHelper");

const verifyAuthToken = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ message: "Access denied!" });
  try {
    const verified = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    req.user = verified;
    console.log(req.user);
    next();
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ message: err.message });

    if (err.name === "TokenExpiredError") {
      // makeAuthTokenReq(req, res, next);
      // console.log(data, "datatatata");
      if (!req.header("refresh-token")) {
        return res.status(401).json({ message: "Acess denied!" });
      }
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
          // console.log(str);
          str = JSON.parse(str);
          if (str.auth_token) {
            const verified = jwt.verify(
              str.auth_token,
              process.env.AUTH_TOKEN_SECRET
            );
            req.user = verified;
            // console.log(req.user);
            next();
          } else {
            return res.json(str);
          }
        });
        response.on("error", (error) => {
          console.error(error);
        });
      };

      var reqs = http.request(options, callback);
      //This is the data we are posting, it needs to be a string or a buffer
      reqs.write(str);
      reqs.end();
    } else {
      return res.status(400).json({ message: err.message });
    }
  }
};

const verifyRefreshToken = (req, res, next) => {
  const token = req.header("refresh-token");
  console.log("refreshtokenverfication");
  if (!token) return res.status(401).json({ message: "Acess denied!" });
  try {
    const verified = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
module.exports.verifyAuthToken = verifyAuthToken;
module.exports.verifyRefreshToken = verifyRefreshToken;
