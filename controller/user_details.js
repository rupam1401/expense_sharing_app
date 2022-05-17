const db_utils = require("../utilities/db_utils")

const getUserDetails = async(req,res) =>{
    let selectUserDetailsQuery = "select * from user_details";
    let params = [];
    const userDetails =await db_utils.selectQuery(selectUserDetailsQuery);
    console.log("Got details :: ",req);
    // return userDetails;
    res.send({'users':userDetails});
}

module.exports = {
    getUserDetails : getUserDetails
}