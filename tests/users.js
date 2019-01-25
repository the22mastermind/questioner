import chaiHttp from 'chai-http';
import chai from 'chai';

const should = chai.should();
chai.use(chaiHttp);

import server from '../config/index';

// CREATE A USER
describe('/POST create a new user', () => {
	it('Should create a new user', () => {
		const user = {
			firstname: 'John',
			lastname: 'Doe',
			email: 'johndoe@gmail.com',
			phoneNumber: '1234567890',
			username: 'johndoe',
			password: 'xxxxxxxx',
			isAdmin: true
		};
		chai.request(server)
			.post('/api/v1/users')
			.send(user)
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(201);
				res.body.data.should.be.a('array');
				res.body.data[0].should.have.property('firstname');
				res.body.data[0].should.have.property('lastname');
				res.body.data[0].should.have.property('email');
				res.body.data[0].should.have.property('phoneNumber');
				res.body.data[0].should.have.property('username');
				res.body.data[0].should.have.property('isAdmin');
				res.body.data[0].isAdmin.should.be.a('boolean');
			});
	});
});

// LOGIN A USER
describe('/POST login a user', () => {
	it('Should login a user', () => {
		const user = {
			username: 'johndoe',
			password: 'xxxxxxxx'
		};
		chai.request(server)
			.post('/api/v1/users/login')
			.send(user)
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(201);
				res.body.data.should.be.a('object');
				res.body.data.should.have.property('username');
				res.body.data.should.have.property('password');
			});
	});
});

// FETCH USER PROFILE/DASHBOARD
describe('/GET user profile/dashboard', () => {
	it('Should fetch user profile', () => {
		chai.request(server)
			.get('/api/v1/users/profile')
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.type.should.equal('application/json');
				res.body.data[0].should.include.keys(
					'id', 'firstname', 'lastname', 'username', 'password', 'isAdmin'
				);
			});
	});
});

// UPDATE PASSWORD OF A USER
describe('/PUT user password reset', () => {
	it('Should update password of a user', () => {
		const user = {
			username: 'johndoe',
			password: 'complexpassword',
			confirmPassword: 'complexpassword'
		};
		chai.request(server)
			.put('/api/v1/users/password-reset')
			.send(user)
			.end((err, res) => {
				if (res.body.error) {
					res.should.have.status(404);
					return;
				}
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.data.should.include.keys(
					'id', 'firstname', 'lastname', 'email', 'isAdmin'
				);
			});
	});
});
