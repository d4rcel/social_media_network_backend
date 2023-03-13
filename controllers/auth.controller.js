const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60 * 1000
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

module.exports.signup = async (req, res) => {
  console.log(req.body);
  const { pseudo, email, password } = req.body;
  try {
    const user = await UserModel.create({ pseudo, email, password });
    res.status(201).json({ user: user.id });
  } catch (e) {
    res.status(200).send({ e });
  }
};

module.exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.login(email, password);
    // console.log('MIL ::' + user);
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge:maxAge})
    res.status(200).json({user: user._id})
  } catch (err) {
    // console.log('KILO ' + err);
    res.status(500).json(err)
  }
};

module.exports.logout = async (req, res) => {
    res.cookie('jwt', '', {maxAge: 1})
    res.redirect('/')
};
