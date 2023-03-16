const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data: " + err);
  });
};

module.exports.createPost = async (req, res) => {
  const newPost = new PostModel({
    posterId: req.body.posterId,
    message: req.body.message,
    video: req.body.video,
    likers: [],
    comments: [],
  });

  try {
    const post = await newPost.save();
    res.status(201).json(post);
  } catch (e) {
    return res.status(400).send(err);
  }
};

module.exports.updatePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  const updatedRecord = {
    message: req.body.message,
  };

  try {
    const updatedData = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedRecord },
      { new: true }
      // (err, docs) => {
      //     if(!err) res.send(docs)
      //     else console.log('Update error: ' + err);
      // }
    ).exec();
    res.send(test);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.deletePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  try {
    const deletedData = await PostModel.findByIdAndRemove(
      req.params.id
      // (err, docs) => {
      //     if(!err) res.send(docs)
      //     else console.log('Delete error : ' + err);
      // }
    ).exec();

    res.status(200).send(deletedData);
  } catch (e) {
    res.status(400).send(e);
  }
};

// Like And Unlike Post

module.exports.likePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  try {
    const likedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likers: req.body.id },
      },
      { new: true }
    ).exec();

    const liker = await UserModel.findByIdAndUpdate(
      req.body.id,
      {
        $addToSet: { likes: req.params.id },
      },
      { new: true }
    ).exec();
    return res.status(200).json({ likedPost, liker });
  } catch (e) {
    return res.status(400).send(e);
  }
};

module.exports.unlikePost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

    try {
      const unlikedPost = await PostModel.findByIdAndUpdate(
        req.params.id,
        {
          $pull: { likers: req.body.id },
        },
        { new: true }
      ).exec();
  
      const unliker = await UserModel.findByIdAndUpdate(
        req.body.id,
        {
          $pull: { likes: req.params.id },
        },
        { new: true }
      ).exec();
      return res.status(200).json({ unlikedPost, unliker });
    } catch (e) {
      return res.status(400).send(e);
    }
};
