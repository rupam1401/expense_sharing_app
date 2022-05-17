const db_utils = require("../utilities/db_utils")

const addExpenseDetails = async(req,res) =>{
    try {
        let requestBody = req.body;
        let validRequest = await validateRequest(requestBody);
        console.log("validRequest ::: ",validRequest);
        if(validRequest == false){
            res.send({'message':'Request body is invalid.'});
        }
        else{
            let expenseType = requestBody.expenseType;
            switch (expenseType.toUpperCase()) {
                case 'EQUAL':
                    await equalShare(requestBody);
                    break;
                case 'EXACT':
                    await exactShare(requestBody);
                    break;
                case 'PERCENT':
                    await percentShare(requestBody);
                    break;
                default:
                    console.log("Expense Type is invalid!!!");
                    break;
            }
            res.status(200).send({'message':'Expenses added successfully.'});
        }
    } catch (error) {
        throw error;
    }
}

async function validateRequest(requestBody) {
    try {
        console.log("Validate Request :: STARTS");
        let valid = true;
        if(requestBody.borrowerList.length != requestBody.numberOfShare - 1){
            valid = false;
        }
        else{
            let getAllValidUserIdQuery = `select user_id from user_details`;
            let validUserIds = await db_utils.selectQuery(getAllValidUserIdQuery);
            let validUserIdList = [];
            validUserIds.forEach(element => {
                validUserIdList.push(element.user_id)
            });
            console.log("validUseIds :: ",validUserIdList);
            let expenseType = requestBody.expenseType;
            if(expenseType == 'EQUAL'){
                requestBody.borrowerList.forEach(userId => {
                        if(validUserIdList.indexOf(userId) === -1){
                            valid = false;
                        }      
                })
            }
            else{
                requestBody.borrowerList.forEach(userId => {
                    console.log("check for :: ",userId," ",validUserIdList.indexOf(userId));
                    let expenseType = requestBody.expenseType;
                        if(validUserIdList.indexOf(userId['borrowerId']) === -1){
                            valid = false;
                        }      
                })

            }
        }
        return valid;
    } catch (error) {
        throw error;
    }
}

// {"expenseType":"EQUAL","lender":1,"amount":1000,"numberOfShare":3,"borrowerList":[2,3,4]}

async function equalShare(requestBody) {
    try {
        console.log("eqaul share :: STARTS");
        let lenderId = requestBody.lender;
        let amount = requestBody.amount;
        let numberOfShare = requestBody.numberOfShare;
        let borrowerList = requestBody.borrowerList;
        
        let eachShare = amount/numberOfShare;
        eachShare = parseFloat(eachShare.toFixed(2))

        let extraShare = eachShare;
        if(eachShare * numberOfShare != amount){
            let totalAmountUsed = eachShare * numberOfShare;
            let totalAmountLeft = Number(amount * 100) - Number(totalAmountUsed * 100);
            totalAmountLeft = totalAmountLeft / 100;
            extraShare = +(extraShare *100) + +(totalAmountLeft* 100);
            extraShare = extraShare / 100;
        }
        let insertExpensequery = "INSERT INTO expense_details(loaner_id, borrower_id, amount) VALUES (?, ?, ?)";
        for (let i = 0; i < numberOfShare -1; i++) {
            const borrowerId = borrowerList[i];
            let shareAmount = eachShare;
            if(i == 0){
                shareAmount = extraShare;
            }
            console.log("lender :: ", lenderId," :: ",borrowerId, " :: ",shareAmount);
            let insertExpenseRes = await db_utils.insertQuery(insertExpensequery,[lenderId,borrowerId,shareAmount]);
            console.log("Data inserted :: ",insertExpenseRes);
        }
        console.log(eachShare);
    } catch (error) {
        throw error;
    }
}

// {"expenseType":"EXACT","lender":1,"amount":1000,"numberOfShare":3,"borrowerList":[{"borrowerId":2,"amount":200},{"borrowerId":3,"amount":300}]}

async function exactShare(requestBody) {
    try {
        console.log("exact share :: STARTS");
        let lenderId = requestBody.lender;
        let amount = requestBody.amount;
        let numberOfShare = requestBody.numberOfShare;
        let borrowerList = requestBody.borrowerList;
        let insertExpensequery = "INSERT INTO expense_details(loaner_id, borrower_id, amount) VALUES (?, ?, ?)";
        for (let i = 0; i < numberOfShare -1; i++) {
            let borrowerId = borrowerList[i]['borrowerId'];
            let borrowedAmmount = borrowerList[i]['amount'];

            let insertExpenseRes = await db_utils.insertQuery(insertExpensequery,[lenderId,borrowerId,borrowedAmmount]);

            console.log("Data inserted :: ",insertExpenseRes);
        }
    } catch (error) {
        throw error;
    }
}

// {"expenseType":"PERCENT","lender":1,"amount":1000,"numberOfShare":3,"borrowerList":[{"borrowerId":2,"sharePercent":40},{"borrowerId":3,"sharePercent":40}]}
async function percentShare(requestBody) {
    try {
        console.log("percent share :: STARTS");
        let lenderId = requestBody.lender;
        let amount = requestBody.amount;
        let numberOfShare = requestBody.numberOfShare;
        let borrowerList = requestBody.borrowerList;
        let insertExpensequery = "INSERT INTO expense_details(loaner_id, borrower_id, amount) VALUES (?, ?, ?)";
        for (let i = 0; i < numberOfShare -1; i++) {
            let borrowerId = borrowerList[i]['borrowerId'];
            let sharePercent = borrowerList[i]['sharePercent'];
            let borrowedAmount = (amount * sharePercent) / 100;
            let insertExpenseRes = await db_utils.insertQuery(insertExpensequery,[lenderId,borrowerId,borrowedAmount]);
            console.log("Data inserted :: ",insertExpenseRes);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    addExpenseDetails : addExpenseDetails
}