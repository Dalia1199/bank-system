import Joi from "joi";

export const depositSchema = {
    body: Joi.object({
        accountNumber: Joi.string().required(),
        amount: Joi.number().positive().required()
    })
};

export const withdrawSchema = {
    body: Joi.object({
        accountNumber: Joi.string().required(),
        amount: Joi.number().positive().required()
    })
};

export const transferSchema = {
    body: Joi.object({
        fromAccount: Joi.string().required(),
        toAccount: Joi.string().required(),
        amount: Joi.number().positive().required()
    })
};