const jwt = require("jsonwebtoken");
const FriendsList = require("../schema/model");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    const varify = await jwt.verify(token, process.env.SECRET_KEY);

    const varUser = await FriendsList.findOne({ _id: varify._id });

    req.token = token;
    req.varUser = varUser;

    next();
  } catch (error) {
    res.status(401).send(error);
  }
};

module.exports = auth;
