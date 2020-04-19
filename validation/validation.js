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

const patchUserValidation = data => {

    const valSchemaPatchEvent = Joi.object({
        name: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()

    })

    return valSchemaPatchEvent.validate(data)
}

const createEventValidation = data => {

    const valSchemaCreateEvent = Joi.object({
        title: Joi.string().min(7).required(),
        eventLocation: Joi.string().required(),
        public: Joi.bool(),
        eventDate: Joi.date(),
        eventDescription: Joi.string(),
        eventPrice: Joi.number(),
    })

    return valSchemaCreateEvent.validate(data)
}

const patchEventValidation = data => {

    const valSchemaPatchEvent = Joi.object({
        eventLocation: Joi.string().required(),
        eventDate: Joi.date().required(),
        eventDescription: Joi.string().required(),

    })

    return valSchemaPatchEvent.validate(data)
}


const participateEventValidation = data => {

    const valSchemaParticipateEvent = Joi.object({
        name: Joi.string().required(),
        email: Joi.date(),
        note: Joi.string(),
    })

    return valSchemaParticipateEvent.validate(data)
}


module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.patchUserValidation = patchUserValidation
module.exports.createEventValidation = createEventValidation
module.exports.patchEventValidation = patchEventValidation
module.exports.participateEventValidation = participateEventValidation