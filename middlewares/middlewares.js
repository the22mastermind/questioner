const Joi = require('joi');


function mustBeInteger(req, res, next) {
    const id = req.params.id;
    if (!Number.isInteger(parseInt(id))) {
        res.status(400).json({ 
            status: 400,
            message: 'ID parameter in url must be an integer'
        });
    } else {
        next();
    }
}

function validateSignUp(user) {
    const schema = {
        firstname: Joi.string().min(3).max(30).required(),
        lastname: Joi.string().min(3).max(30).required(),
        othername: Joi.string().min(3).max(30).optional(),
        email: Joi.string().email().required(),
        phoneNumber: Joi.string().min(10).max(15).required(),
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).max(15).required(),
        isAdmin: Joi.boolean().required()
    };
    return Joi.validate(user, schema);
}

function validateMeetup(meetup) {
    const schema = {
        topic: Joi.string().min(5).required(),
        location: Joi.string().min(5).required(),
        happeningOn: Joi.date().min('now').required(),
        tags: Joi.string().max(80)
    };
    return Joi.validate(meetup, schema);
}

function validateQuestion(question) {
    const schema = {
        // user: Joi.number().integer().required(),
        // meetup: Joi.number().integer().required(),
        title: Joi.string().min(3).required(),
        body: Joi.string().min(5).required(),
        createdBy: Joi.number().positive().required(),
        meetupId: Joi.number().positive().required()
    };
    return Joi.validate(question, schema);
}

function validateUpvoteDownvoteQuestion(meetup) {
    const schema = {
        meetupId: Joi.number().positive().required()
    };
    return Joi.validate(meetup, schema);
}

function validateRSVP(rsvp) {
    const schema = {
        userId: Joi.number().positive().required(),
        meetupId: Joi.number().positive().required(),
        response: Joi.string().min(2).required()
    };
    return Joi.validate(rsvp, schema);
}

function validateSignIn(user) {
    const schema = {
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).max(15).required()
    };
    return Joi.validate(user, schema);
}

function validateComment(comment) {
    const schema = {
        body: Joi.string().min(5).required(),
        commentedBy: Joi.number().positive().required(),
        questionId: Joi.number().positive().required()
    };
    return Joi.validate(comment, schema);
}

module.exports = {
    mustBeInteger,
    validateSignUp,
    validateSignIn,
    validateMeetup,
    validateQuestion,
    validateUpvoteDownvoteQuestion,
    validateRSVP,
    validateComment
};
