const express = require("express");
const router = express.Router();

const { me, changeCredentials } = require("../controllers/user");
const { verifyAuthToken } = require("../middlewares/auth");

router.get("/me", verifyAuthToken, me);
router.post("/change-credentials", verifyAuthToken, changeCredentials);
module.exports = router;
