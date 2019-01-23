const chaiHttp = require('chai-http');
const chai = require('chai');

const should = chai.should();
chai.use(chaiHttp);
const server = require('../config/index');

// POST A QUESTION
describe('/POST post a new question', () => {
	it('Should post a new question', () => {
		const question = {
			title: 'Andela Bootcamp',
			body: 'Westerwelle Startup',
			createdBy: 1,
		};
		chai.request(server)
			.post('/api/v1/meetups/1/questions')
			.send(question)
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(201);
				res.body.data.should.be.a('array');
				res.body.data[0].should.have.property('user');
				res.body.data[0].should.have.property('meetup');
				res.body.data[0].should.have.property('title');
				res.body.data[0].should.have.property('body');
				res.body.data[0].should.have.property('tags');
				res.body.data[0].user.should.be.an('integer');
				res.body.data[0].meetup.should.be.an('integer');
				res.body.data[0].title.should.be.a('string');
			});
	});
});

describe('/POST post a dummy question', () => {
	it('Should return a 400 error', () => {
		const question = {
			title: 'Andela Bootcamp',
			body: 'Westerwelle Startup'
		};
		chai.request(server)
			.post('/api/v1/meetups/1/questions')
			.send(question)
			.end((err, res) => {
				res.should.have.status(400);
			});
	});
});

// POSTING A COMMENT ON A QUESTION
describe('/POST post a comment on a question', () => {
	it('Should post a comment on a question', () => {
		const comment = {
			body: 'Can you ask another question?',
			commentedBy: 1,
		};
		chai.request(server)
			.post('/api/v1/meetups/1/questions/comment')
			.send(comment)
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(201);
				res.body.data.should.be.a('array');
				res.body.data[0].should.have.property('message');
				res.body.data[0].message.should.be.a('string');
			});
	});
});

describe('/POST post a comment when not registered', () => {
	it('Should return an error', () => {
		const comment = {
			body: 'Can you ask another question?',
		};
		chai.request(server)
			.post('/api/v1/meetups/1/questions/comment')
			.send(comment)
			.end((err, res) => {
				res.should.have.status(400);
			});
	});
});

// UPVOTE AND DOWNVOTE QUESTIONS
describe('/PATCH upvote a question', () => {
	it('Should increment upvotes of a question', () => {
		chai.request(server)
			.patch('/api/v1/meetups/1/questions/upvote')
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(200);
			});
	});
});

describe('/PATCH downvote a question', () => {
	it('Should increment downvotes of a question', () => {
		chai.request(server)
			.patch('/api/v1/meetups/1/questions/downvote')
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(200);
			});
	});
});

describe('/POST post a reply to a comment', () => {
	it('Should post a reply on a comment', () => {
		const reply = {
			body: 'I hope I have answered your question.',
			commentedBy: 1,
		};
		chai.request(server)
			.post('/api/v1/meetups/1/questions/comment/respond')
			.send(reply)
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(201);
			});
	});
});
