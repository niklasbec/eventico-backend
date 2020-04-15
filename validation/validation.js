//Validation
const Joi = require("@hapi/joi")


// Register Validation
const registerValidation = data => {

    const valSchemaRegister = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })

    return valSchemaRegister.validate(data)
}

//Login Validation
const loginValidation = data => {

    const valSchemaLogin = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    })

    return valSchemaLogin.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation