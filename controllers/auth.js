const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  const user = await User.create(req.body);

  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({
    user: { name: user.name },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Authentication invalid");
    error.statusCode = StatusCodes.BAD_REQUEST;
    throw error;
  }

  const user = await User.findOne({ email });
  if (!user) {
    const error = new Error("Authentication invalid");
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Authentication invalid");
    error.statusCode = StatusCodes.UNAUTHORIZED;
    throw error;
  }

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({
    user: { name: user.name },
    token,
  });
};

module.exports = { register, login };
