var express = require('express');
var router = express.Router();
var expenseController = require("../controller/expense_details")

router.get('/', expenseController.getExpenseDetails);
module.exports = router;
