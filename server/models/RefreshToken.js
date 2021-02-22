const { Schema, model } = require("mongoose");

const RefreshTokenSchema = new Schema({
  refresh_token: {
    type: String,
    require: true,
    unique: true,
  },
});

const RefreshToken = model("refresh_tokens", RefreshTokenSchema);

module.exports = RefreshToken;
