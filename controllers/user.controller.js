const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  //  console.log(`Nancy 11 ${`{req.params}`}`);
  //  console.log(`Nancy 22 ${req.searchParams}`);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID Unknown : " + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  try {
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          bio: req.body.bio,
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        if (err) return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);
  try {
    await UserModel.remove({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Successfully deleted" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  if (!ObjectID.isValid(req.body.idToFollow))
    return res.status(400).send("ID Unknown : " + req.body.idToFollow);

  try {
    //add to the follower list
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true, upsert: true }
    ).select("-password").exec();

    //add to following List
    const userToFollow = await UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: req.params.id },
      },
      { new: true, upsert: true }
    ).select("-password").exec();

    res.status(201).json({ user, userToFollow });
  } catch (err) {
    console.log(`AMERRR :: ${err}`);
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnFollow)
  )
    return res.status(400).send("ID Unknown : " + req.params.id);

  try {
    //add to the follower list
    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { following: req.body.idToUnFollow },
      },
      { new: true, upsert: true }
    ).exec();

    //add to following List
    const userToUnFollow = await UserModel.findByIdAndUpdate(
      req.body.idToUnFollow,
      {
        $pull: { followers: req.params.id },
      },
      { new: true, upsert: true }
    ).exec();

    res.status(201).json({ user, userToUnFollow });
  } catch (err) {
    console.log(`AMERRR :: ${err}`);
    return res.status(500).json({ message: err });
  }
};
