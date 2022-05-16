const db_utils = require("../utilities/db_utils")

const getExpenseDetails = async(req,res) =>{
    try {
        let selectExpenseDetailsQuery = `
        select ed_details.loaner_id,ed_details.borrower_id,ed_details.amount,ud1.user_name loaner_name,ud2.user_name borrower_name from 
        (SELECT loaner_id, borrower_id, ROUND(SUM(applicable_amount), 2) amount, false as value_used FROM 
        ( select least(loaner_id, borrower_id) loaner_id,greatest(loaner_id, borrower_id) borrower_id,amount,
        case when least(loaner_id, borrower_id) = loaner_id then amount else -1 *amount end applicable_amount from expense_details) applicable_amount_details 
        GROUP BY loaner_id,borrower_id) ed_details 
        left outer join user_details ud1 on ed_details.loaner_id = ud1.user_id 
        left outer join user_details ud2 on ed_details.borrower_id = ud2.user_id`;
        let expenseDetails =await db_utils.selectQuery(selectExpenseDetailsQuery);
        let expenseList = [];
        expenseDetails.forEach(expense => {
            let value= "";
            if(expense['amount'] <= 0){
                value = expense['loaner_name'] + " Owes " + expense['borrower_name'] + " : Rs " + (-1 * expense['amount']);    
            }
            else{
                value = expense['borrower_name'] + " Owes " + expense['loaner_name'] + " : Rs " + expense['amount'];    
            }
            
            expenseList.push(value);
        });
        console.log("Got details :: ",expenseDetails);
        res.send({'expenseList':expenseList});
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getExpenseDetails : getExpenseDetails
}