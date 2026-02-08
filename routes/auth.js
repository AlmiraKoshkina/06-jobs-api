const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth"); // <-- важно: auth, не authController

router.post("/register", register);
router.post("/login", login);

module.exports = router;
