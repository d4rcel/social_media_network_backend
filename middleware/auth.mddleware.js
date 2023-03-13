const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

module.exports.checkUser = (req, res, next) => {
  console.log("11111111111111");
  const token = req.cookies.jwt;
  if (token) {
    console.log("222222222222");
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      console.log("33333333333");
      if (err) {
        console.log("4444444444444");
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        console.log("5555555555555");
        next();
      } else {
        console.log("666666666666666");
        console.log("Mouchard :: 111" + JSON.stringify(decodedToken));
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        console.log("Mouchard :: 111" + res.locals.user);
        console.log("Mouchard :: 222" + user);
        next();
      }
    });
  } else {
    console.log("777777777777777777");
    res.locals.user = null;
    next();
  }
};

module.exports.koala = (req, res) => {
  console.log("ABRACATABRA");
};

module.exports.requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    console.log("AAAAAAAAAAAA");
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      console.log("BBBBBBBBBBBBB");
      if (err) {
        console.log(err);
      } else {
        console.log(JSON.stringify(decodedToken));
        next();
      }
    });
  } else {
    console.log("No token");
  }
};
