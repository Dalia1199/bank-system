import accountModel from "../../DB/models/bankaccout.js";
import transactionModel from "../../DB/models/transctionmodel.js";

export const deposit = async (req, res, next) => {
    const { accountNumber, amount } = req.body;

    const account = await accountModel.findOneAndUpdate(
        { accountNumber },
        { $inc: { balance: amount } },
        { new: true }
    );

    if (!account) return next(new Error("Account not found"));

    await transactionModel.create({
        accountId: account._id,
        type: "deposit",
        amount,
        finalBalance: account.balance
    });

    return res.status(200).json({ message: "Success", account });
};

export const withdraw = async (req, res, next) => {
    const { accountNumber, amount } = req.body;

    const account = await accountModel.findOne({ accountNumber });

    if (!account || account.balance < amount)
        return next(new Error("Insufficient balance"));

    account.balance -= amount;
    await account.save();

    await transactionModel.create({
        accountId: account._id,
        type: "withdraw",
        amount,
        finalBalance: account.balance
    });

    return res.status(200).json({ message: "Withdraw success", account });
};

export const transfer = async (req, res, next) => {
    const { fromAccount, toAccount, amount } = req.body;

    const sender = await accountModel.findOne({ accountNumber: fromAccount });
    if (!sender || sender.balance < amount)
        return next(new Error("Insufficient balance"));

    const receiver = await accountModel.findOneAndUpdate(
        { accountNumber: toAccount },
        { $inc: { balance: amount } },
        { new: true }
    );

    if (!receiver) return next(new Error("Receiver not found"));

    sender.balance -= amount;
    await sender.save();

    await transactionModel.create({
        accountId: sender._id,
        type: "transfer",
        amount,
        toAccount
    });

    return res.status(200).json({ message: "Transfer success" });
};
export const getOneTransaction = async (req, res, next) => {
    const { id } = req.params;

    const transaction = await transactionModel.findById(id);

    if (!transaction)
        return next(new Error("Transaction not found", { cause: 404 }));

    // security: لازم تتأكدي إنها بتاعة نفس المستخدم
    if (transaction.accountId.userId.toString() !== req.user._id.toString())
        return next(new Error("Unauthorized access"));

    return res.status(200).json({ transaction });
};
export const getMyTransactions = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;

    const accounts = await accountModel.find({ userId: req.user._id });

    const accountIds = accounts.map(acc => acc._id);

    const transactions = await transactionModel.find({
        accountId: { $in: accountIds }
    })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await transactionModel.countDocuments({
        accountId: { $in: accountIds }
    });

    return res.status(200).json({
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        data: transactions
    });
};
export const getMySummary = async (req, res, next) => {
    const accounts = await accountModel.find({ userId: req.user._id });

    const accountIds = accounts.map(a => a._id);

    const transactions = await transactionModel.find({
        accountId: { $in: accountIds }
    });

    let summary = {
        totalBalance: 0,
        deposits: 0,
        withdrawals: 0,
        transfers: 0
    };

    accounts.forEach(acc => {
        summary.totalBalance += acc.balance;
    });

    transactions.forEach(t => {
        if (t.type === "deposit") summary.deposits += t.amount;
        if (t.type === "withdraw") summary.withdrawals += t.amount;
        if (t.type === "transfer") summary.transfers += t.amount;
    });

    return res.status(200).json({ summary });
};