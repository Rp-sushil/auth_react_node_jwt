const User = require("../models/User");
const { changeCredentialsValidation } = require("../validators/auth");
const {
  generatePassword,
  comparePassword,
} = require("../utils/passwordHelper");

const changeCredentials = async (req, res) => {
  const { error } = changeCredentialsValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const { name, email, password, newPassword } = req.body;
  console.log("here");
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User can not found!" });
    try {
      const isPasswordCorrect = await comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Password is incorect!" });
      }
      const isNewPasswordEqualsOld = await comparePassword(
        newPassword,
        user.password
      );
      if (isNewPasswordEqualsOld) {
        return res
          .status(400)
          .json({ message: "New password is same as old one" });
      }
      const new_hashed_password = await generatePassword(newPassword);
      user.name = name;
      user.password = new_hashed_password;
      try {
        await user.save();
        return res.json({
          user: {
            _id: user._id,
            name,
            email,
          },
          message: "Successfully changeed credentials In...",
        });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const me = async (req, res) => {
  try {
    console.log(req.user);
    const userdata = await User.findOne({ _id: req.user._id });
    if (!userdata)
      return res.status(400).json({ message: "User does not exist!" });
    const { _id, name, email } = userdata;
    res.json({ user: { _id, name, email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports.me = me;
module.exports.changeCredentials = changeCredentials;
