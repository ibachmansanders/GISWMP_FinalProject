/*Bridge application to take in data (input), 
 *write SQL, and execute queries, 
 *ultimately putting it into a DB output 
 *and packaging it for use.*/

//for importing modules
 var express = require('express');

//connect to the DB function
creatDBConnection() {
	var cn = {
		host: localhost, //enter host
		port: 5432, //default
		database: PathLessTravelled,
		user: postgres,
		password: Ascendant_17
	};
	var db = pgp(cn); //does the connection using pg-promise libary
	return db;
}

//endpoint functions


//have my server listen for incoming client requests and log that it's functioning.
app.listen(8080, function() {
	console.log('Started application.')
});