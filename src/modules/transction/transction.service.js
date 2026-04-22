import accountModel from "../../DB/models/bankaccout.js";
import transactionModel from "../../DB/models/transctionmodel.js";
import mongoose from "mongoose";


// =========================
// 10 - Deposit
// =========================
export const deposit = async (req, res, next) => {
    const { accountNumber, amount } = req.body;

    if (amount <= 0) return next(new Error("Invalid amount"));

    const account = await accountModel.findOne({
        accountNumber,
        userId: req.user._id
    });

    if (!account) return next(new Error("Account not found"));
    if (account.status === "frozen") return next(new Error("Account frozen"));

    const before = account.balance;

    account.balance += amount;
    await account.save();

    await transactionModel.create({
        accountId: account._id,
        type: "deposit",
        amount,
        balanceBefore: before,
        balanceAfter: account.balance,
        status: "completed"
    });

    return res.json({
        message: "Deposit success",
        balance: account.balance
    });
};



// =========================
// 20 - Withdraw
// =========================
export const withdraw = async (req, res, next) => {
    const { accountNumber, amount } = req.body;

    if (amount <= 0) return next(new Error("Invalid amount"));

    const account = await accountModel.findOne({
        accountNumber,
        userId: req.user._id
    });

    if (!account) return next(new Error("Account not found"));
    if (account.status === "frozen") return next(new Error("Account frozen"));

    if (account.balance < amount)
        return next(new Error("Insufficient balance"));

    const before = account.balance;

    account.balance -= amount;
    await account.save();

    await transactionModel.create({
        accountId: account._id,
        type: "withdraw",
        amount,
        balanceBefore: before,
        balanceAfter: account.balance,
        status: "completed"
    });

    return res.json({
        message: "Withdraw success",
        balance: account.balance
    });
};



// =========================
//transfer 
// =========================
export const transfer = async (req, res, next) => {
    const { fromAccount, toAccount, amount } = req.body;

    if (amount <= 0) return next(new Error("Invalid amount"));

    const sender = await accountModel.findOne({
        accountNumber: fromAccount,
        userId: req.user._id
    });

    if (!sender) return next(new Error("Sender not found"));
    if (sender.status === "frozen") return next(new Error("Account frozen"));
    if (sender.balance < amount)
        return next(new Error("Insufficient balance"));

    const receiver = await accountModel.findOne({
        accountNumber: toAccount
    });

    if (!receiver) return next(new Error("Receiver not found"));
console.log(receiver)
    const beforeSender = sender.balance;
    const beforeReceiver = receiver.balance;

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // transaction for sender
    await transactionModel.create({
        accountId: sender._id,
        type: "transfer",
        amount,
        balanceBefore: beforeSender,
        balanceAfter: sender.balance,
        status: "completed",
        toAccount: receiver._id
    });

    // transaction for receiver
    await transactionModel.create({
        accountId: receiver._id,
        type: "transfer",
        amount,
        balanceBefore: beforeReceiver,
        balanceAfter: receiver.balance,
        status: "completed"
    });

    return res.json({ message: "Transfer success" });
};



// =========================
// 40 - Get My Transactions
// =========================
export const getMyTransactions = async (req, res, next) => {
    const {
        page = 1,
        limit = 10,
        type,
        min,
        max,
        sort = "-createdAt"
    } = req.query;

    const accounts = await accountModel.find({ userId: req.user._id });
    const accountIds = accounts.map(acc => acc._id);

    const filter = { accountId: { $in: accountIds } };

    if (type) filter.type = type;

    if (min || max) filter.amount = {};
    if (min) filter.amount.$gte = Number(min);
    if (max) filter.amount.$lte = Number(max);

    const transactions = await transactionModel.find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(Number(limit));

    return res.json({ transactions });
};



// =========================
// 50 - Get One Transaction
// // =========================
// export const getOneTransaction = async (req, res, next) => {
//     const { id } = req.params;

//     const accounts = await accountModel.find({ userId: req.user._id });
//     const accountIds = accounts.map(acc => acc._id);

//     const transaction = await transactionModel.findOne({
//         _id: id,
//         accountId: { $in: accountIds }
//     });

//     if (!transaction)
//         return next(new Error("Transaction not found or unauthorized"));

//     return res.json({ transaction });
// };
export const getOneTransaction = async (req, res, next) => {
    const id = req.params.id?.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new Error("Invalid transaction id"));
    }

    const transaction = await transactionModel.findById(id);

    if (!transaction) {
        return next(new Error("Transaction not found"));
    }

    const account = await accountModel.findOne({
        _id: transaction.accountId,
        userId: req.user._id
    });

    if (!account) {
        return next(new Error("Transaction not found or unauthorized"));
    }

    return res.json({ transaction });
};


// =========================
// 60 - Summary
// =========================
export const getMySummary = async (req, res, next) => {
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
        if (t.type === "transfer") summary.transfers += t.amount;
    });

    return res.json({ summary });
};
