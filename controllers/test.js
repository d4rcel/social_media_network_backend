module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
      return res.status(400).send("ID Unknown : " + req.params.id);
  
    if (!ObjectID.isValid(req.body.idToFollow))
      return res.status(400).send("ID Unknown : " + req.body.idToFollow);
  
    try{
      //add to the follower list
      const user = await UserModel.findByIdAndUpdate(
        req.params.id,
        {
          $addToSet: {following: req.body.idToFollow}
        },
        {new: true, upsert: true}
      ).exec();
  
      //add to following List
      const userToFollow = await UserModel.findByIdAndUpdate(
        req.body.idToFollow,
        {
          $addToSet: {followers: req.params.id}
        },
        {new: true, upsert: true}
      ).exec();
  
      res.status(201).json({user, userToFollow});
  
    } catch(err) {
      console.log(`AMERRR :: ${err}`);
      return res.status(500).json({message : err})
    }
  }