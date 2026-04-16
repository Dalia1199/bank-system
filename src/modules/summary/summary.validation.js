import Joi from "joi";

export const summarySchema = {
    params: Joi.object({
        accountId: Joi.string().required()
    })
};