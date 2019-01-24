import Joi from 'joi';

function validateSignUp(user) {
    const schema = {
        firstname: Joi.string().min(3).max(30).required(),
        lastname: Joi.string().min(3).max(30).required(),
        othername: Joi.string().max(30).optional(),
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
        images: Joi.string().max(300).optional(),
        tags: Joi.string().max(80).required()
    };
    return Joi.validate(meetup, schema);
}

function validateQuestion(question) {
    const schema = {
        title: Joi.string().min(3).required(),
        body: Joi.string().min(5).required()
    };
    return Joi.validate(question, schema);
}

function validateUpvoteDownvoteQuestion(meetup) {
    const schema = {
        id: Joi.number().positive().required()
    };
    return Joi.validate(meetup, schema);
}

function validateRSVP(rsvp) {
    const schema = {
        response: Joi.string().min(2).max(8).required()
    };
    return Joi.validate(rsvp, schema);
}

function validatePasswordReset(credentials) {
    const schema = {
        username: Joi.string().min(3).max(30).required(),
        password: Joi.string().min(8).max(15).required()
    };
    return Joi.validate(credentials, schema);
}

function validateComment(comment) {
    const schema = {
        body: Joi.string().min(5).required()
    };
    return Joi.validate(comment, schema);
}

function validateTags(tags) {
    const schema = {
        tags: Joi.string().max(300).required()
    };
    return Joi.validate(tags, schema);
}

export default {
    validateSignUp,
    validateMeetup,
    validateQuestion,
    validateUpvoteDownvoteQuestion,
    validateRSVP,
    validateComment,
    validatePasswordReset,
    validateTags
};
