var express = require('express');
var router = express.Router();
var userController = require("../controller/add_expense")

router.post('/', userController.addExpenseDetails);

module.exports = router;
