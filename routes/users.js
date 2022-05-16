var express = require('express');
var router = express.Router();
var userController = require("../controller/user_details")
/* GET users listing. */
router.get('/', userController.getUserDetails);
module.exports = router;
