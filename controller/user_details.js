const db_utils = require("../utilities/db_utils")

const getUserDetails = async(req,res) =>{
    let selectUserDetailsQuery = "select * from user_details where user_id = ?";
    let params = [];
    const userDetails =await db_utils.selectQuery(selectUserDetailsQuery,[1]);
    console.log("Got details :: ",req);
    // return userDetails;
    res.send({'users':userDetails});
}

module.exports = {
    getUserDetails : getUserDetails
}