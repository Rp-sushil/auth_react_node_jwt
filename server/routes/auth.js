const express = require("express");
const router = express.Router();

const {
  register,
  login,
  logout,
  generateNewauthToken,
} = require("../controllers/auth");

const { verifyRefreshToken } = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.delete("/logout", verifyRefreshToken, logout);
router.get("/refresh", verifyRefreshToken, generateNewauthToken);
module.exports = router;
