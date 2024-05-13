const { signup } = require("../controllers/auth.controller");

module.exports={
    usernameAlreadyExist:"Failed! Username is already in use!",
    emailAlreadyExist:"Failed! Email is already in use!",
    userCreateError:"Failed! Error while creating user!",
    userNotFound:"Failed! User not found!",
    invalidPassword:"Failed! Invalid password!",
    signOut: "Signed out completed successfully!",
    signupSuccess:"Sigup completed Successfully!",
    siginSuccess:"Signin completed successfully!",
    updateDataRequired:"Failed! update deatails missing!",
    createRideFailed:"Failed! Error while create  ride! please try again!",
    rideNotFound:"Faild! Ride details not available right now. Plase try after sometime!"
};