const joi = require("joi")

const userValidation = (data) => {
    const schemaValidation = joi.object({
        user_name: joi.string().required().min(3).max(256),
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email: joi.string().required().min(6).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const postValidation = (data) => {
    const schemaValidation = joi.object({
        user_id: joi.string().required().length(24),
        title: joi.string().required().min(2).max(50),
        article: joi.string().required().max(1000),
    })
    return schemaValidation.validate(data)
}

const commentValidation = (data) => {
    const schemaValidation = joi.object({
        user_id: joi.string().required().length(24),
        post_id: joi.string().required().length(24),
        comment_text: joi.string().required().max(500),
    })
    return schemaValidation.validate(data)
}

const likeValidation = (data) => {
    const schemaValidation = joi.object({
        user_id: joi.string().required().length(24),
        post_id: joi.string().required().length(24),
    })
    return schemaValidation.validate(data)
}

const idFieldValidation = (id_param) => {
    const schemaValidation = joi.string().required().length(24)
    return schemaValidation.validate(id_param)
}



module.exports.userValidation = userValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation
module.exports.commentValidation = commentValidation
module.exports.likeValidation = likeValidation
module.exports.idFieldValidation = idFieldValidation