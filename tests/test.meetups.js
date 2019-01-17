const chaiHttp = require('chai-http');
const chai = require('chai');
// const { expect } = require('chai');
let should = chai.should();
let server = require('../config/index');
chai.use(chaiHttp);
const meetups = require('../models/models');

// CREATE A MEETUP
describe("/POST create a new meetup", ()=>{
	it("Should create a new meetup", ()=>{
		let meetup = {
			topic: "Andela Bootcamp",
			location: "Westerwelle Startup",
			happeningOn: "01/22/2019",
			tags: "Git, Coding"
		};
		chai.request(server)
			.post('/api/v1/meetups')
			.send(meetup)
			.end((err,res)=>{
				// console.log(res.body.data[0].topic);
				res.should.have.status(201);
				res.body.data.should.be.a('array');
				res.body.data[0].should.have.property('topic');
				res.body.data[0].should.have.property('location');
				res.body.data[0].should.have.property('happeningOn');
				res.body.data[0].should.have.property('location');
				res.body.data[0].should.have.property('tags');
				res.body.data[0].topic.should.be.equal('Andela Bootcamp');
				res.body.data[0].location.should.be.equal('Westerwelle Startup');
				res.body.data[0].happeningOn.should.be.equal('01/22/2019');
			})
	})
})

// FETCH ALL MEETUPS
describe("/GET all meetups", ()=>{
	it("Should fetch all meetups", ()=>{
		chai.request(server)
			.get('/api/v1/meetups')
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.type.should.equal('application/json');
				res.body.data[0].should.include.keys(
					'id', 'topic', 'location', 'happeningOn', 'tags'
				);
			})
	})
})

// FETCH SPECIFIC MEETUP
describe("/GET a specific meetup by id", ()=>{
	it("Should fetch a specific meetup", ()=>{
		chai.request(server)
			.get('/api/v1/meetups/2')
			.end((err,res)=>{
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.data.should.include.keys(
					'id', 'topic', 'location', 'happeningOn', 'tags'
				);
			})
	})
})

// DELETE AN EXISTING MEETUP
describe("/DELETE delete a meetup", ()=>{
	it("Should delete a meetup", ()=>{
		chai.request(server)
			.delete('/api/v1/meetups/1')
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.should.be.a('object');
			})
	})
})

// FETCH UPCOMING MEETUPS
describe("/GET upcoming meetups", ()=>{
	it("Should fetch upcoming meetups", ()=>{
		chai.request(server)
			.get('/api/v1/meetups/upcoming')
			.end((err,res)=>{
				res.should.have.status(200);
				res.body.should.be.a('object');
			})
	})
})