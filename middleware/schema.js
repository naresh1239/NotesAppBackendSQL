const Joi = require('joi');


const userSchema = Joi.object({
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),

});

const loginSchema = Joi.object({
    email: Joi.string().min(3).required(),
    password: Joi.string().min(6).required(),
    remember : Joi.boolean().required()
});

const otpSchema = Joi.object({
    otp: Joi.number().integer().min(100000).max(999999).required(),
    email: Joi.string().min(6).required()
});

module.exports = {
    userSchema,
    loginSchema,
    otpSchema
};