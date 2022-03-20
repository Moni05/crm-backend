const Joi = require("joi");

const email = Joi.string().email({
	minDomainSegments: 2,
	tlds: { allow: ["com", "net"] },
});

const pin = Joi.number().min(10000).max(999999).required();
const password = Joi.string().min(3).max(30).required();
const shortStr = Joi.string().min(2).max(50);
const longStr = Joi.string().min(2).max(1000);
const phone = Joi.number().min(7000000000).max(9999999999).required();
const dt = Joi.date();

const resetPassReqEmailValidation = (req, res, next) => {

    const schema = Joi.object({ email });

    const value = schema.validate(req.body);

    if(value.error){
        return res.send(value.error.message);
    }

    next();

}

const updatePasswordReqValidation = (req, res, next) => {
	const schema = Joi.object({ email, pin, password });

	const value = schema.validate(req.body);
	if (value.error) {
		return res.send(value.error.message);
	}
	next();
};

const createNewTicketReqValidation = (req, res, next) => {

    const schema = Joi.object({
		subject: shortStr.required(),
		sender: shortStr.required(),
		message: longStr.required(),
		issueDate: dt.required(),
	});

    const value = schema.validate(req.body);

    if (value.error) {
		return res.send(value.error.message);
	}
	next();

}

const replyTicketReqValidation = (req, res, next) => {

    const schema = Joi.object({
		sender: shortStr.required(),
		message: longStr.required(),
	});

    const value = schema.validate(req.body);

    if (value.error) {
		return res.send(value.error.message);
	}
	next();

}

const newUserReqValidation = (req, res, next) => {
	const schema = Joi.object({
		name: shortStr.required(),
		company: shortStr.required(),
		address: shortStr.required(),
		phone: phone,
		email: shortStr.required(),
		password: shortStr.required(),
	});

	const value = schema.validate(req.body);

	if (value.error) {
		return res.json({ status: "error", message: value.error.message });
	}

	next();
};

module.exports = { resetPassReqEmailValidation, updatePasswordReqValidation, createNewTicketReqValidation, 
	               replyTicketReqValidation, newUserReqValidation };