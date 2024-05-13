const messageConstants = require('../constants/message.constants');
const UserModel = require('../models/user.model');

exports.updateUser = async (req, res,next) => {
  try{
    const updateData=req.body.updateData;

    if(Object.keys(updateData).length === 0){
      return res.status(403).json({message:messageConstants.updateDataRequired})
    }
    
    if(updateData.lastActiveTime)updateData.lastActiveTime =  new Date();
    const user = await UserModel.findOneAndUpdate({_id:req.user._id},updateData).lean();
    if(!user){
      return res.status(404).json({message:messageConstants.userNotFound});
    }
    delete user.password;
    return res.status(200).json(user);
  
  }catch(err){
    return next(err);
  }
};
