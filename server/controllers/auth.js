const User = require("../models/User");
const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");
const { loginValidation, registerValidation } = require("../validators/auth");
const {
  generatePassword,
  comparePassword,
} = require("../utils/passwordHelper");

const generateAuthToken = (_id, name, email) => {
  return jwt.sign({ _id, name, email }, process.env.AUTH_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};
const generateRefreshToken = (_id, name, email) => {
  return jwt.sign({ _id, name, email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
};

const register = async (req, res) => {
  console.log("we got the request");
  console.log(req.body);
  const { error } = registerValidation(req.body);
  console.log(error);

  if (error) return res.status(400).json({ message: error.details[0].message });
  const { name, email, password } = req.body;
  try {
    const emailExists = await User.findOne({ email });
    if (emailExists)
      return res.status(400).json({ message: "Email already exists!" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  const hashed_password = await generatePassword(password);
  const user = new User({
    name,
    email,
    password: hashed_password,
  });
  try {
    console.log(user);
    const { _id, name, email } = await user.save();
    res.json({
      user: {
        _id,
        name,
        email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const login = async (req, res) => {
  const { error } = loginValidation(req.body);
  console.log(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not found!" });
    try {
      const ispasswordCorrect = await comparePassword(password, user.password);
      if (!ispasswordCorrect) {
        return res.status(400).json({ message: "Password is incorect!" });
      }
      const auth_token = generateAuthToken(user._id, user.name, user.email);
      const refresh_token = generateRefreshToken(
        user._id,
        user.name,
        user.email
      );
      const newRefreshToken = new RefreshToken({
        refresh_token,
      });
      try {
        await newRefreshToken.save();
        res.header("auth-token", auth_token);
        res.header("refresh-token", refresh_token);
        const { _id, name, email } = user;
        console.log(user);
        return res.json({
          user: {
            _id,
            name,
            email,
          },
          auth_token,
          refresh_token,
          message: "Successfully Logged In...",
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const logout = async (req, res) => {
  const refresh_token = req.header("refresh-token");
  try {
    const token = await RefreshToken.deleteOne({
      refresh_token: refresh_token,
    });
    res.json({ token_id: token, message: "Successfully logged out!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateNewauthToken = async (req, res) => {
  console.log("trying to generate new auth token");
  try {
    const refreshToken = await RefreshToken.findOne({
      refresh_token: req.header("refresh-token"),
    });
    if (!refreshToken)
      return res
        .sendStatus(400)
        .json({ message: "You are logged out, Need to login again!" });
    const { _id, name, email } = req.user;
    const authToken = generateAuthToken(_id, name, email);
    res.header("auth-token", authToken);
    return res.json({ message: "new token generated", auth_token: authToken });
  } catch (error) {
    return res.send(500).json(error.message);
  }
};

module.exports.register = register;
module.exports.login = login;
module.exports.logout = logout;
module.exports.generateNewauthToken = generateNewauthToken;
