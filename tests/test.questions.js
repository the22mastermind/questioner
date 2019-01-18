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

// POSTING A COMMENT ON A QUESTION
describe('/POST post a comment on a question', () => {
	it('Should post a comment on a question', () => {
		const comment = {
			body: 'Can you ask another question?',
			commentedBy: 1,
		};
		chai.request(server)
			.post('/api/v1/meetups/1/questions/1/comment')
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
