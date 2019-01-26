import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../config/index';

const should = chai.should();
const { expect } = chai.expect;
chai.use(chaiHttp);

// GET HOMEPAGE
describe('/GET homepage', () => {
	it('Should return the homepage', () => {
		chai.request(server)
			.get('/')
			.end((err, res) => {
				res.should.have.status(200);
			});
	});
});

// // POST HOMEPAGE
// describe('/POST homepage', () => {
// 	it('Should return a 400 error', () => {
// 		chai.request(server)
// 			.post('/')
// 			.end((err, res) => {
// 				res.should.have.status(404);
// 			});
// 	});
// });

// describe('/GET an invalid url', () => {
// 	it('Should return a 404 error', () => {
// 		chai.request(server)
// 			.get('/api/v1/something')
// 			.end((err, res) => {
// 				res.should.have.status(404);
// 			});
// 	});
// });

// // CREATE A MEETUP
// describe('/POST create a new meetup', () => {
// 	it('Should create a new meetup', () => {
// 		const meetup = {
// 			topic: 'Andela Bootcamp',
// 			location: 'Westerwelle Startup',
// 			happeningOn: '01/25/2019',
// 			tags: 'Git, Coding'
// 		};
// 		chai.request(server)
// 			.post('/api/v1/meetups')
// 			.send(meetup)
// 			.end((err, res) => {
// 				// console.log(res.body);
// 				res.should.have.status(201);
// 				res.body.data.should.be.a('array');
// 				res.body.data[0].should.have.property('topic');
// 				res.body.data[0].should.have.property('location');
// 				res.body.data[0].should.have.property('happeningOn');
// 				res.body.data[0].should.have.property('location');
// 				res.body.data[0].should.have.property('tags');
// 				res.body.data[0].topic.should.be.equal('Andela Bootcamp');
// 				res.body.data[0].location.should.be.equal('Westerwelle Startup');
// 				res.body.data[0].happeningOn.should.be.equal('01/25/2019');
// 				res.body.data[0].happeningOn.should.be.a('string');
// 			});
// 	});
// });

// // FETCH ALL MEETUPS
// describe('/GET all meetups', () => {
// 	it('Should fetch all meetups', () => {
// 		chai.request(server)
// 			.get('/api/v1/meetups')
// 			.end((err, res) => {
// 				// console.log(res.body);
// 				res.should.have.status(200);
// 				res.body.should.be.a('object');
// 				res.type.should.equal('application/json');
// 				// res.body.data[0].should.include.keys(
// 				// 	'id', 'topic', 'location', 'happeningOn', 'tags'
// 				// );
// 			});
// 	});
// });

// // FETCH SPECIFIC MEETUP
// describe('/GET a specific meetup by id', () => {
// 	it('Should fetch a specific meetup', () => {
// 		chai.request(server)
// 			.get('/api/v1/meetups/2')
// 			.end((err, res) => {
// 				if (res.body.error) {
// 					res.should.have.status(404);
// 					return;
// 				}
// 				res.should.have.status(200);
// 				res.body.should.be.a('object');
// 				res.body.data.should.include.keys(
// 					'id', 'topic', 'location', 'happeningOn', 'tags'
// 				);
// 			});
// 	});
// });

// // DELETE AN EXISTING MEETUP
// describe('/DELETE delete a meetup', () => {
// 	it('Should delete a meetup', () => {
// 		chai.request(server)
// 			.delete('/api/v1/meetups/1')
// 			.end((err, res) => {
// 				res.should.have.status(200);
// 				res.body.should.be.a('object');
// 			});
// 	});
// });

// // FETCH UPCOMING MEETUPS
// describe('/GET upcoming meetups', () => {
// 	it('Should fetch upcoming meetups', () => {
// 		chai.request(server)
// 			.get('/api/v1/meetups/upcoming')
// 			.end((err, res) => {
// 				res.should.have.status(200);
// 				res.body.should.be.a('object');
// 			});
// 	});
// });

// // RSVP TO A MEETUP
// describe('/POST rsvp to a meetup', () => {
// 	it('Should create rsvp to a meetup', () => {
// 		const rsvp = {
// 			userId: 1,
// 			meetupId: 2,
// 			response: 'Maybe'
// 		};
// 		chai.request(server)
// 			.post('/api/v1/meetups/1/rsvps')
// 			.send(rsvp)
// 			.end((err, res) => {
// 				if (res.body.error) {
// 					res.should.have.status(404);
// 					return;
// 				}
// 				res.should.have.status(201);
// 				res.body.data.should.be.a('array');
// 				res.body.data[0].should.have.property('userId');
// 				res.body.data[0].should.have.property('meetupId');
// 				res.body.data[0].should.have.property('response');
// 				res.body.data[0].userId.should.be.a('integer');
// 				res.body.data[0].meetupId.should.be.a('integer');
// 				res.body.data[0].response.should.be.a('string');
// 			});
// 	});
// });

// describe('/POST rsvp to a meetup', () => {
// 	it('Should return status code 400', () => {
// 		const rsvp = {
// 			userId: 1,
// 			meetupId: 2
// 		};
// 		chai.request(server)
// 			.post('/api/v1/meetups/1/rsvps')
// 			.send(rsvp)
// 			.end((err, res) => {
// 				res.should.have.status(400);
// 			});
// 	});
// });

// // UPDATE A MEETUP
// describe('/PATCH update a meetup', () => {
// 	it('Should update a meetup', () => {
// 		const meetup = {
// 			topic: 'Andela Bootcamp',
// 			location: 'Westerwelle Startup',
// 			happeningOn: '01/26/2019',
// 			tags: 'Git, Coding, someothertag'
// 		};
// 		chai.request(server)
// 			.patch('/api/v1/meetups/1')
// 			.send(meetup)
// 			.end((err, res) => {
// 				if (res.body.error) {
// 					res.should.have.status(404);
// 					return;
// 				}
// 				res.should.have.status(200);
// 			});
// 	});
// });

// describe('/PATCH update a meetup', () => {
// 	it('Should return a status code 400', () => {
// 		const meetup = {
// 			topic: 'Andela Bootcamp'
// 		};
// 		chai.request(server)
// 			.patch('/api/v1/meetups/1')
// 			.send(meetup)
// 			.end((err, res) => {
// 				res.should.have.status(400);
// 			});
// 	});
// });

// // ADD TAGS TO A MEETUP
// describe('/POST add tags to a meetup', () => {
// 	it('Should return status code 201', () => {
// 		const tags = {
// 			tags: 'Programming, WebDev, DevOps, RESTful API, Nodejs, ES6'
// 		};
// 		chai.request(server)
// 			.patch('/api/v1/meetups/1/tags')
// 			.send(tags)
// 			.end((err, res) => {
// 				if (res.body.error) {
// 					res.should.have.status(404);
// 					return;
// 				}
// 				res.should.have.status(201);
// 				res.body.data.should.be.a('array');
// 				res.body.data.should.have.property('meetup');
// 				res.body.data.should.have.property('topic');
// 				res.body.data.should.have.property('tags');
// 				res.body.data.tags.should.be.a('array');
// 			});
// 	});
// });

// describe('/POST add tags to a meetup', () => {
// 	it('Should return status code 400', () => {
// 		const tags = {
// 			tags: ''
// 		};
// 		chai.request(server)
// 			.patch('/api/v1/meetups/1/tags')
// 			.send(tags)
// 			.end((err, res) => {
// 				res.should.have.status(400);
// 			});
// 	});
// });
