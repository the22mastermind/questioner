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

function validateMeetup(req, res, next) {
    const { topic, location, happeningOn, tags } = req.body;

    if (topic && location && happeningOn && tags) {
        next();
    } else {
        res.status(400).json({ 
            status: 400,
            message: 'Topic, Location, HappeningOn and Tags fields are required!'
        });
    }
}

function validateQuestion(req, res, next) {
    const { title, body } = req.body;

    if (title && body) {
        next();
    } else {
        res.status(400).json({ 
            status: 400,
            message: 'Title and body fields are required!'
        });
    }
}

function validateRSVP(req, res, next) {
    const { status } = req.body;

    if ( status) {
        next();
    } else {
        res.status(400).json({ 
            status: 400,
            message: 'RSVP status required! [yes, no or maybe)'
        });
    }
}

module.exports = {
    mustBeInteger,
    validateMeetup,
    validateQuestion,
    validateRSVP
};
