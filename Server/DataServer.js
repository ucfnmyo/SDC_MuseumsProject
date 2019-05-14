#!/usr/bin/env node

//  FlickrData API Server
//  Author:  Steven Gray
//  Description:  This FlickrAPI server allows users to connect to the Flickr Database and return values to explore on a mpa
//                for Workshop 8 - 9 of the course.
//  Notes:        This API assumes you have an SQL function called DISTANCE defined which can be created by running the following query in MySQL:

//  CREATE FUNCTION distance(a POINT, b POINT) RETURNS double DETERMINISTIC RETURN ifnull(acos(sin(X(a)) * sin(X(b)) + cos(X(a)) * cos(X(b)) * cos(Y(b) - Y(a))) * 6380, 0)

var moment = require('moment');

var portNumber = 8872;

var mysql = require('mysql');

 // MySQL Connection Variables
var connection = mysql.createConnection({
  host     : 'dev.spatialdatacapture.org',
  user     : 'ucfnjma',
  password : 'jucahedagu',
  database : 'ucfnjma'
});

connection.connect();

//  Setup the Express Server
var express = require('express');
var app = express();
app.set('view engine', 'ejs');

// Provides the static folders we have added in the project to the web server.
app.use(express.static(__dirname + '/js'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/images'));

// Default API Endpoint - return the index.ejs file in the views folder

app.get('/', function(req, res) {
    return res.render('api_index');
})

// app.get('/test', function(req, res) {
// 	return res.render('flickr_index');
// })

// app.get('/date', function(req, res) {
// 	var d = new Date();
// 	console.log(d);
// 	return res.send(d);
// })


app.get('/bubble', function (req, res) {

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      var sql = "SELECT `regions`, `countries` FROM Final_Data";

      connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
                // If we have data that comes back send it to the user.
                // does this need to be json'ed?
                res.send(rows);
                }else{
                    console.log("empty query");
                    res.send("empty query");
                    }
                });
});


//  API EndPoint to get all data
app.get('/data', function (req, res) {

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      var sql = "SELECT * FROM Final_Data";

      connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
                // If we have data that comes back send it to the user.
                // does this need to be json'ed?
                res.send(rows);
                }else{
                    console.log("empty query");
                    res.send("empty query");
                    }
                });
});

// API endpoint to get a limited full table select for demonstration purposes
app.get('/dataLimited', function (req, res) {

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      var sql = "SELECT * FROM Final_Data LIMIT 100";

      connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
                // If we have data that comes back send it to the user.
                // does this need to be json'ed?
                res.send(rows);
                }else{
                    console.log("empty query");
                    res.send("empty query");
                    }
                });
});


//  API EndPoint to get summary data
app.get('/summary/:key', function (req, res) {

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      var sql = "SELECT * FROM Met_noUSA";

      connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
                // If we have data that comes back send it to the user.
                // does this need to be json'ed?
                res.send(rows);
                }else{
                    console.log("empty query");
                    res.send("empty query");
                    }
                });
});


//  API EndPoint to get data subset for one value of a code
app.get('/subset/:code/:value', function (req, res) {

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      if(req.params.code != ""){
               
        // Parse the values from the URL into numbers for the query, and use function to escape special characters
        var code = req.params.code;
        code1 = mysql_real_escape_string(code);
        var value = mysql_real_escape_string(req.params.value);

        // SQL Statement to run
        var sql = "SELECT *  FROM SpatialMET WHERE  \""+code+"\" = \""+value+"\ Limit 10";



        // Log it on the screen for debugging
        console.log(sql);

        // Run the SQL Query
        connection.query(sql, function(err, rows, fields) {
          if (err) console.log("Err:" + err);
          if(rows != undefined){
            // If we have data that comes back send it to the user.
            res.send(rows);
          }else{
            console.log("empty query");
            res.send("empty query");
          }
        });
      }else{
        // If all the URL variables are not passed send an empty string to the user
        console.log("incorrect URL variables");
        res.send("incorrect URL variables");
      }







      
/////////////////////////////////////////////////////////
      var sql = "SELECT * FROM XXXTABLE_NAMEXXX WHERE " ;

      connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
                // If we have data that comes back send it to the user.
                // does this need to be json'ed?
                res.send(rows);
                }else{
                    console.log("empty query");
                    res.send("empty query");
                    }
                });
});


//  API EndPoint to get points for a certain location 
app.get('/location/:code', function (req, res) {

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database
      if(req.params.code != ""){
               
                // Parse the values from the URL into numbers for the query
		// mysql_real_escape_string

    var code = req.params.code;
    code1 = mysql_real_escape_string(code)


		console.log("code: ", code);
    console.log("code1: ", code1);
    console.log("\"DEU\"")

                // SQL Statement to run
		
		var sql = "SELECT `Object ID`, `Object Name`, `Object Begin Date`, `Medium`, `lat`, `lng`, `Link Resource`  FROM SpatialMET WHERE CountryMatch = \""+code+"\" Limit 10";
                // var sql = "SELECT * FROM SpatialMET WHERE CountryMatch = " +location;
                
                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes back send it to the user.
                                // does this need to be json'ed?
                                res.send(rows);
                        }else{
				console.log("empty query");
                                res.send("empty query");
                        }
                });
        }else{
                // If all the URL variables are not passed send an empty string to the user
		console.log("incorrect URL variables");
                res.send("incorrect URL variables");
        }
});



//  API EndPoint to get data from specific area - /data/51.1/0.0/30 
app.get('/data/:lat/:lon/:radius', function (req, res) {

	console.log("data for a specific area");

      // Alows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database
      if(req.params.lat != "" && req.params.lon != "" && req.params.radius != ""){
               
                // Parse the values from the URL into numbers for the query
                var lat = parseFloat(req.params.lat);
                var lon = parseFloat(req.params.lon);
                var radius = parseFloat(req.params.radius);


                // SQL Statement to run
                var sql = "SELECT * FROM photo_locations WHERE DISTANCE(points, POINT("+lon+","+lat+") ) <= " + radius;
                
                // Log it on the screen for debugging
                console.log(sql);

                // Run the SQL Query
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                // If we have data that comes bag send it to the user.
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
        }else{
                // If all the URL variables are not passed send an empty string to the user
                res.send("insufficient arguements");
        }
});

// API Endpoint to get data for specific photograph from database - /data/photoDescription/1234567
app.get('/data/photoDescription/:pid', function (req, res) {
	console.log("get specific photo data");
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      if(req.params.pid != ""){
                var pid = parseInt(req.params.pid);
            
                var sql = "SELECT * FROM metadata as a INNER JOIN photos as b ON a.pid = b.pid where a.pid = " + pid; 

                console.log(sql);
                connection.query(sql, function(err, rows, fields) {
                        if (err) console.log("Err:" + err);
                        if(rows != undefined){
                                res.send(rows);
                        }else{
                                res.send("");
                        }
                });
        }else{
                res.send("missing data");
        }
});

// Setup the server and print a string to the screen when server is ready
var server = app.listen(portNumber, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App listening at http://%s:%s', host, port);
});

function mysql_real_escape_string (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}
