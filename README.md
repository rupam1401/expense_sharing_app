# expense_sharing_app
Assignment for round 2 of Unico Connect

# Install and Run the project
1. Clone the project from github using command : git clone https://github.com/rupam1401/expense_sharing_app.git
2. Change directory to main folder using command : cd expense_sharing_app
2. Run command to install dependenciesand node modules : npm install
3. Run command to start the project : npm start
4. Test the apis using postman tool

APIs:
1. http://localhost:3000/addExpense : To add the new expense
    Validation used : 
        Size of borrowerList should be 1 less than number of shares mentioned.
        User id in borrower list should be present in application i.e. 1, 2, 3, 4.

    a. Request body to add EQUAL Expense = {"expenseType":"EQUAL","lender":1,"amount":1000,"numberOfShare":3,"borrowerList":[2,3]}

    b. Request body to add EXACT Expense = {"expenseType":"EXACT","lender":1,"amount":1000,"numberOfShare":3,"borrowerList":[{"borrowerId":2,"amount":200},{"borrowerId":3,"amount":300}]}

    c. Request body to add EXACT Expense = {"expenseType":"PERCENT","lender":1,"amount":1000,"numberOfShare":3,"borrowerList":[{"borrowerId":2,"sharePercent":40},{"borrowerId":3,"sharePercent":40}]}

2. http://localhost:3000/users : To get the details of all the users of the application

3. http://localhost:3000/getExpense : To get the all previous expenses of the application