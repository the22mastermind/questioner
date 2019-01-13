// var http = require("http")

// http.createServer(function(request, response){
// 	response.writeHead(200, {'Content-Type': 'text/plain'});

// 	response.end('Hello World\n');
// }).listen(8081);

// console.log('Server running at http://127.0.0.1:8081/');


// var fs = require("fs");
// var data = fs.readFileSync('input.txt');

// console.log(data.toString());
// console.log("Program ended!")


// var fs = require("fs");
// fs.readFile('input.txt', function(err, data){
// 	if(err) return console.error(err);
// 	console.log(data.toString());
// });
// console.log("Program ended!");


// import events module
var events = require('events');

// create an eventEmitter object
var eventEmitter = new events.EventEmitter();

// create an event handler
var connectHandler = function connected(){
	console.log('connection successful.');

	// fire the data_received event
	eventEmitter.emit('data_received');
}

// bind the connection event with the handler
eventEmitter.on('connection', connectHandler);

// bind the data_received event with the anonymous function
eventEmitter.on('data_received', function(){
	console.log('data received successfully.');
});

// fire the connection event
eventEmitter.emit('connection');

console.log("Program ended.");