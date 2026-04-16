import transactionModel from "../../DB/models/transctionmodel.js";
import accountModel from "../../DB/models/bankaccout.js";

export const getAccountSummary = async (req, res, next) => {

    const accounts = await accountModel.find({ userId: req.user._id });
    const accountIds = accounts.map(acc => acc._id);

    const transactions = await transactionModel.find({
        accountId: { $in: accountIds }
    });

    let summary = {
        balance: 0,
        deposits: 0,
        withdrawals: 0,
        transfers: 0
    };

    accounts.forEach(acc => {
        summary.balance += acc.balance;
    });

    transactions.forEach(t => {
        if (t.type === "deposit") summary.deposits += t.amount;
        if (t.type === "withdraw") summary.withdrawals += t.amount;
        if (t.type.includes("transfer")) summary.transfers += t.amount;
    });

    return res.json({ summary });
};