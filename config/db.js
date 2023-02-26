const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

mongoose
  .connect(
    "mongodb+srv://" + process.env.DB_USER_PASS + "@cluster0.dxpee9n.mongodb.net/social_media_network",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("Connected to Mongodb"))
  .catch((err) => console.log(`Failed to connect to Mongodb ${err}`));
