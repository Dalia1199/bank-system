import accountModel from "../../DB/models/bankaccout.js";

export const getUserAccounts = async (req, res, next) => {
    const accounts = await accountModel.find({ userId: req.user._id });
    return res.status(200).json({ message: "Success", accounts });
};

export const createExtraAccount = async (req, res, next) => {
    const { accountType } = req.body;

    const account = await accountModel.create({
        userId: req.user._id,
        accountNumber: "ACC" + Date.now(),
        accountType: accountType || "current",
        balance: 0
    });

    return res.status(201).json({ message: "Account Created", account });
};