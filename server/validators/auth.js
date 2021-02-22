// auth validation
const Joi = require("joi");

// sign Up validation
const registerValidation = (data) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(4).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// change credentialValidation
const changeCredentialsValidation = (data) => {
  console.log(data);
  const schema = Joi.object().keys({
    name: Joi.string().min(4).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// Sign In validation
const loginValidation = (data) => {
  const schema = Joi.object().keys({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.changeCredentialsValidation = changeCredentialsValidation;
