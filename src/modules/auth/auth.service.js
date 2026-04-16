import  UserModel  from "../../DB/models/usermodel.js";
import AccountModel from "../../DB/models/bankaccout.js";
import { hash,compare } from "../../common/utilities/security/hash.js";
import jwt from "jsonwebtoken";




export const register = async (req, res, next) => {
    const { name, email, password } = req.body;

    const exist = await UserModel.findOne({ email });
    if (exist) return next(new Error("Email exists", { cause: 409 }));

    const hashedPassword = hash({ plain_text: password });

    const user = await UserModel.create({
        name,
        email,
        password: hashedPassword
    });

    await AccountModel.create({
        userId: user._id,
        accountNumber: "ACC" + Date.now(),
        balance: 0
    });

    return res.status(201).json({ message: "User created" });
};


export const login = async (req, res, next) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) return next(new Error("Invalid credentials"));

    const match = compare({
        plain_text: password,
        cipher_text: user.password
    });

    if (!match) return next(new Error("Invalid credentials"));

    const token = jwt.sign({ id: user._id }, "secret");

    return res.status(200).json({ message: "Login success", token });
};