const Joi = require('@hapi/joi')

const registerValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string()
            .required(),
        studentId: Joi.string()
            .required(),
        password: Joi.string()
            .required(),
    })
    return schema.validate(body)
}

module.exports.registerValidation = registerValidation

const loginValidation = (body) => {
    const schema = Joi.object({
        studentId: Joi.string()
            .required(),
        password: Joi.string()
            .required()
    })
    return schema.validate(body)
}

module.exports.loginValidation = loginValidation