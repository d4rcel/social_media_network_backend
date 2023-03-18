const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");
const ObjectID = require("mongoose").Types.ObjectId;

module.exports.readPost = (req, res) => {
  PostModel.find((err, docs) => {
    if (!err) res.send(docs);
    else console.log("Error to get data: " + err);
  }).sort({ createdAt: -1 });
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

// Comments
module.exports.commentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  try {
    const comment = await PostModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            commenterId: req.body.commenterId,
            commenterPseudo: req.body.commenterPseudo,
            text: req.body.text,
            timestamps: new Date().getTime(),
          },
        },
      },
      { new: true }
    ).exec();

    return res.status(200).json({ comment });
  } catch (e) {
    return res.status(400).send(e);
  }
};

module.exports.editCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  try {
    const post = await PostModel.findById(req.params.id);

    const theComment = post.comments.find((comment) =>
      comment._id.equals(req.body.commentId)
    );

    if (!theComment) return res.status(404).send("Comment not found");

    theComment.text = req.body.text;

    const updatedPost = await post.save();

    return res.status(200).send(updatedPost);
  } catch (e) {
    return res.status(400).send(e);
  }
};

module.exports.deleteCommentPost = async (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID Unknown : " + req.params.id);

  try {
    const post = await PostModel.findByIdAndUpdate(req.params.id, {
      $pull: {
        comments: {
          _id: req.body.id,
        },
      },
    }).exec();

    return res.status(200).send(post);
  } catch (e) {
    console.log("Geeer " + e);
    return res.status(400).send(e);
  }
};
