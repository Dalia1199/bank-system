import accountModel from "../../DB/models/bankaccout.js";
import transactionModel from "../../DB/models/transctionmodel.js";

export const getAccountSummary = async (req, res, next) => {
    const { accountId } = req.params;

    const account = await accountModel.findById(accountId);
    if (!account) return next(new Error("Account not found"));

    if (account.userId.toString() !== req.user._id.toString())
        return next(new Error("Unauthorized access"));

    const transactions = await transactionModel.find({ accountId });

    let summary = {
        balance: account.balance,
        deposits: 0,
        withdrawals: 0,
        transfers: 0
    };

    transactions.forEach(t => {
        if (t.type === "deposit") summary.deposits += t.amount;
        if (t.type === "withdraw") summary.withdrawals += t.amount;
        if (t.type === "transfer") summary.transfers += t.amount;
    });

    return res.status(200).json({ summary });
};