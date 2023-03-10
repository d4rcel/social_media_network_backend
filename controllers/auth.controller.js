const UserModel = require('../models/user.model')

module.exports.signup = async (req, res) => {
    console.log(req.body);
    const {pseudo, email, password} = req.body
    try{
        const user = await UserModel.create({pseudo, email, password})
        res.status(201).json({user: user.id})
    } catch(e) {
        res.status(200).send({e})
    }
}