export const validation = (schema) => {
    return (req, res, next) => {

        const validationErrors = [];

        if (schema.body) {
            const { error } = schema.body.validate(req.body, { abortEarly: false });
            if (error) validationErrors.push(...error.details);
        }

        if (schema.params) {
            const { error } = schema.params.validate(req.params, { abortEarly: false });
            if (error) validationErrors.push(...error.details);
        }

        if (schema.query) {
            const { error } = schema.query.validate(req.query, { abortEarly: false });
            if (error) validationErrors.push(...error.details);
        }

        if (validationErrors.length) {
            return next(new Error(validationErrors.map(e => e.message).join(", "), { cause: 400 }));
        }

        next();
    };
};