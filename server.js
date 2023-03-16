const express = require("express");
const cookieParser = require('cookie-parser')
// const bodyParser = require("body-parser");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes")
require("dotenv").config({ path: "./config/.env" });
require("./config/db");
const {checkUser, requireAuth} = require('./middleware/auth.mddleware')
const app = express();

// app.use(bodyParser)
// app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// jwt
app.get("*", checkUser)
app.get('/jwtid', requireAuth, (req, res) => {
  res.status(200).send(res.locals.user._id)
})

//routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes)

//server
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
