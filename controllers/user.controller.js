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
  console.log("Mouchard 1111");
  if (!ObjectID.isValid(req.params.id))
  return res.status(400).send("ID Unknown : " + req.params.id);

  console.log("Mouchard 2222");
  try{
    console.log("Mouchard 333");
    await UserModel.findOneAndUpdate(
      {_id: req.params.id},
      {
        $set: {
          bio: req.body.bio
        }
      },
      {new: true, upsert: true, setDefaultsOnInsert: true},
      (err, docs) => {
        console.log("Mouchard 4444");
        if(!err) return res.send(docs)
        console.log("Mouchard 5555");
        if(err) return res.status(500).send({message : err})
        console.log("Mouchard 6666");
      }
      
    )
    console.log("Mouchard 7777");
  } catch(err) {
    console.log("Mouchard 8888" + err);
    return res.status(500).json({message : err})
  }
}

module.exports.deleteUser = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
  return res.status(400).send("ID Unknown : " + req.params.id);
  try {
    await UserModel.remove({_id: req.params.id}).exec()
    res.status(200).json({message: "Successfully deleted"})
  } catch(err) {
    return res.status(500).json({message : err})
  }
}