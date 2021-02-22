const bcrypt = require("bcryptjs");
const saltFactor = 10;

const comparePassword = async (password, actualPassword) => {
  try {
    return await bcrypt.compare(password, actualPassword);
  } catch (err) {
    throw err;
  }
};

const generatePassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltFactor);
    const hashed_password = await bcrypt.hash(password, salt);
    return hashed_password;
  } catch (err) {
    throw err;
  }
};

module.exports.generatePassword = generatePassword;
module.exports.comparePassword = comparePassword;
