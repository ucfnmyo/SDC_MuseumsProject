#!/usr/bin/env node

//  Met Museum Collection API Server

/////////////////////////////////////////////////////
//// WARNING
////  This script basically ignores memory management and doesn't free any memory after it's used except by accident
//// After ~12 API calls or so, there's a good chance  the heap will be totally full and the server will crash. 
// ` forever` will restart it, freeing the memory but it's still not optimal and will be a problem if 
// you're running a temporary server with `node` because that won't restart. 
///////////////////////

// if the node process gets orphaned by a dropped network connection 
// use ps -ef | grep node to find the pid of the process you need to stop
// use kill <pid> to kill that process


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
    console.log("api homepage endpoint")
    return res.render('api_index');
})

//  API EndPoint to get all data
app.get('/data', function (req, res) {

  console.log("all data endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      var sql = "SELECT `Object ID`, `object_begin_date`, `class`, `country`, `object_name`, `Cluster_ID`, `medium`, `onclear_medium` FROM Final_Data";
      //  object ID, country, begin data, object name, cluster id, class, medium

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// gets summary data for country bubble chart
// 1
app.get('/bubble', function (req, res) {

  console.log("bubble endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      var sql = "SELECT `region`, `country`, Count(*) AS count_value FROM Final_Data Group by `region`, `country`";

      connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
                // If we have data that comes back send it to the user.
                // does this need to be json'ed?
                res.send(rows);
                }else{
                    // console.log("empty query");
                    res.send("empty query");
                    }
                });
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// gets summary data for country bubble chart
// 2
app.get('/bubble/Prints', function (req, res) {

  console.log("bubble endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      var sql = "SELECT `region`, `country`, Count(*) AS count_value FROM Final_Data WHERE `Class_General` = 'Prints' GROUP BY `region`, `country`";

      connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
                // If we have data that comes back send it to the user.
                // does this need to be json'ed?
                res.send(rows);
                }else{
                    // console.log("empty query");
                    res.send("empty query");
                    }
                });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// gets summary data for country bubble chart
// 3
app.get('/bubble/Metal', function (req, res) {

  console.log("bubble endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      var sql = "SELECT `region`, `country`, Count(*) AS count_value FROM Final_Data WHERE `Class_General` = 'Metal' Group by `region`, `country`";

      connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
                // If we have data that comes back send it to the user.
                // does this need to be json'ed?
                res.send(rows);
                }else{
                    // console.log("empty query");
                    res.send("empty query");
                    }
                });
});


// API endpoint to get a limited full table select for demonstration purposes
// 3
app.get('/dataLimited', function (req, res) {

  console.log("dataLimited endpoint")

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
                    // console.log("empty query");
                    res.send("empty query");
                    }
                });
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get summary data
// works for "region" "country", "acq_year", "Class_General",  
app.get('/summary/:key/:year', function (req, res) {

  console.log("summary endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      // check for key
      if(req.params.key != "" && req.params.key != ""){
        // console.log("parameters correct");

        // Parse the values from the URL into numbers for the query, and use function to escape special characters
        var key = mysql_real_escape_string(req.params.key);

        if(req.params.year != ""){

          // console.log("year variable");
          var year = mysql_real_escape_string(req.params.year);

          if(year == "year"){

            // console.log("include year in group by");
            // if year is right
            // console.log("key: ", key);

            var sql = "SELECT `"+key+"`, `object_begin_date`, COUNT(*) AS count FROM Final_Data GROUP BY  `"+key+"`, `object_begin_date`";
            // console.log("test sql query: ", sql)
            // var sql = "SELECT `region`, COUNT(*) AS count FROM Final_Data GROUP BY  `region`";
            // Log it on the screen for debugging
            console.log(sql);

            // Run the SQL Query
            connection.query(sql, function(err, rows, fields) {
              if (err) console.log("Err:" + err);
              if(rows != undefined){
                // If we have data that comes back send it to the user.
                res.send(rows);
              }else{
                // console.log("empty query");
                res.send("empty query");
              }

            })   // end connection query

          }else{
              // if year is wrong
              // console.log("year value is not 'year'");
              // res.send("value in year position unrecognized");

          if (year == "no"){

            // if year value is blank
            // console.log("no year");
            // var sql = "SELECT \'"+key+"\', COUNT(*) AS count FROM Final_Data GROUP BY  \'"+key+"\'";
            // var sql = "SELECT COUNT(*) AS count FROM Final_Data GROUP BY  `region`";
              var sql = "SELECT `"+key+"`, COUNT(*) AS count FROM Final_Data GROUP BY  `"+key+"`";

            // Log it on the screen for debugging
            console.log(sql);

                        // Run the SQL Query
              connection.query(sql, function(err, rows, fields) {
                if (err) console.log("Err:" + err);
                if(rows != undefined){
                  // If we have data that comes back send it to the user.
                  res.send(rows);
                }else{
                  // console.log("empty query");
                  res.send("empty query");
                }

              })   // end connection query

          }else{

            // console.log("year parameter incorrect");
            res.send("year parameter incorrect");

          }

        

            }  // end catch wrong year value

      }else{ // if year is blank (technically redundant but not harmful)

              console.log("year parameter missing");
              res.send("year parameter mising");

            } // end check for key
    }else {         // if the key argument is blank

    // If all the URL variables are not passed send an empty string to the user
    console.log("missing URL variables");
    res.send("missing URL variables");

          }
  });   // end of summary endpoint

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get data subset for one of terry's clusters
app.get('/cluster/:value', function (req, res) {

  console.log("cluster endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      if(req.params.value != ""){

        console.log("get parameters ok");
        var value = mysql_real_escape_string(req.params.value);
        console.log("cluster id: ", value);
        value = parseInt(value);

        var sql = "SELECT `Object ID`, `object_name`, `object_begin_date`, `class`, `country`, `medium`, `Cluster_ID`, `link`, onclear_medium FROM Final_Data WHERE Cluster_ID = \'"+value+"\'";
        // `Object ID`, `object_begin_date`, `class`, `country`, `object_name`, `Cluster_ID`


        // console.log("query: ", sql)

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
        }); // end sql query

      }else{
        // if code or value is blank
        console.log("missing URL variables");
        res.send("missing URL variables");

      }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get data for one of Mo's clusters for carlos's charts
app.get('/cluster2/:value', function (req, res) {

  console.log("cluster 2 endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      if(req.params.value != ""){

        console.log("get parameters ok");
        var value = mysql_real_escape_string(req.params.value);
        console.log("cluster id: ", value);
        value = parseInt(value);

        var sql = "SELECT * FROM Cluster_Output WHERE clusterIDs = \'"+value+"\'";

        // console.log("query: ", sql)

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
        }); // end sql query

      }else{
        // if code or value is blank
        console.log("missing URL variables");
        res.send("missing URL variables");

      }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get data for a cluster from Carlos table
app.get('/cluster3/:value', function (req, res) {

  console.log("cluster 3 endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      if(req.params.value != ""){

        console.log("get parameters ok");
        var value = mysql_real_escape_string(req.params.value);
        console.log("cluster id: ", value);
        value = parseInt(value);

        var sql = "SELECT * FROM Country_Per_Cluster WHERE clusterID = \'"+value+"\'";

        // console.log("query: ", sql)

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
        }); // end sql query

      }else{
        // if code or value is blank
        console.log("missing URL variables");
        res.send("missing URL variables");

      }
});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get mo his clusters from Final Data for his map version
app.get('/cluster4/:value', function (req, res) {

  console.log("cluster 4 endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      if(req.params.value != ""){

        console.log("get parameters ok");
        var value = mysql_real_escape_string(req.params.value);
        console.log("cluster id: ", value);
        value = parseInt(value);

        var sql = "SELECT * FROM Final_Data WHERE clusterIDs = \'"+value+"\'";

        // console.log("query: ", sql)

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
        }); // end sql query

      }else{
        // if code or value is blank
        console.log("missing URL variables");
        res.send("missing URL variables");

      }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get Carlos the cluster chart table for a single cluster id. 
app.get('/clusterchart/:value', function (req, res) {

  console.log("cluster 4 endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      if(req.params.value != ""){

        console.log("get parameters ok");
        var value = mysql_real_escape_string(req.params.value);
        console.log("cluster id: ", value);

        if(value = "no"){

        var sql = "SELECT * FROM Cluster_Chart";

        // console.log("query: ", sql)

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
        }); // end sql query

      }else{
        // if code or value is blank
        console.log("missing URL variables");
        res.send("missing URL variables");

      }

        }else{

        value = parseInt(value);

        var sql = "SELECT * FROM Cluster_Chart WHERE `ClusterID` = \'"+value+"\'";

        // console.log("query: ", sql)

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
        }); // end sql query

      }else{
        // if code or value is blank
        console.log("missing URL variables");
        res.send("missing URL variables");

      }

        }


});





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get data subset for one value of a code
app.get('/subset/:code/:value', function (req, res) {

  console.log("subset endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      if(req.params.code != "" && req.params.value != ""){

        console.log("get parameters ok");
        var code = mysql_real_escape_string(req.params.code);
        var value = mysql_real_escape_string(req.params.value);

        var sql = "SELECT * FROM Final_Data WHERE `"+code+"` = \'"+value+"\'";

        // console.log("query: ", sql)

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
        }); // end sql query

      }else{
        // if code or value is blank
        console.log("missing URL variables");
        res.send("missing URL variables");

      }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get data for a specific country, classification and year range
app.get('/specific/:country/:cat/:early/:late', function (req, res) {

  console.log("specific endpoint")

  // Allows data to be downloaded from the server with security concerns
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
  // If all the variables are provided connect to the database

  if(req.params.country != "" && req.params.class != "" && req.params.early != "" && req.params.late != ""){

    console.log("get parameters ok");
    var country = mysql_real_escape_string(req.params.country);
    var cat = mysql_real_escape_string(req.params.cat);
    var early = mysql_real_escape_string(req.params.early);
    var late = mysql_real_escape_string(req.params.late);

    // console.log("early pre parse: ", early);
    // console.log("late pre parse: ", late);



    // console.log("country: ", country);
    // console.log("category: ", cat);
    // console.log("early: ", early);
    // console.log("late: ", late);

//////////////////////////////////////////////////////////////////////////////////////////////////
    if( early != "no" || late != "no"){
      early = parseInt(early);
      late = parseInt(late);
    };

    // console.log("early: ", early);
    // console.log("late: ", late);


// conditional sql string here
    if(country == "no"){
      if(cat == "no"){

        if( early == "no" || late == "no"){
          var sql = "no"
        }else{ // neither year is no
           // only year values
           var sql = "SELECT * FROM Final_Data WHERE `acq_year` >= \'"+early+"\' AND `acq_year` <= \'"+late+"\' ";
        } // end year no else

      }else{ // if cat has a value

        if( early == "no" || late == "no"){
          // country is no cat has a value years are no
          var sql = "SELECT * FROM Final_Data WHERE `Class_General` = \'"+cat+"\'";
        }else{ // neither year is no
          // country is no cat has a value years have values
          var sql = "SELECT * FROM Final_Data WHERE `Class_General` = \'"+cat+"\' AND `acq_year` >= \'"+early+"\' AND `acq_year` <= \'"+late+"\' ";
        } //end year no else

      } // end cat no else
    }else{ // country is not no
      if(cat == "no"){

        if( early == "no" || late == "no"){
          // country  only
          var sql = "SELECT * FROM Final_Data WHERE `country` =  \'"+country+"\'";
        }else{ // neither year is no
          // country has a value cat is no years have values
          var sql = "SELECT * FROM Final_Data WHERE `country` = \'"+country+"\' AND `acq_year` >= \'"+early+"\' AND `acq_year` <= \'"+late+"\' ";
        } // end year no else

      }else{ // if cat is not no

        if( early == "no" || late == "no"){
          // country is no cat has a value years are no
          var sql = "SELECT * FROM Final_Data WHERE `Class_General` = \'"+cat+"\' AND `country` = \'"+country+"\'";
        }else{ // neither year is no
          // country has a value  cat has a value  years have values
          var sql = "SELECT * FROM Final_Data WHERE `country` = \'"+country+"\' AND `Class_General` = \'"+cat+"\' AND `acq_year` >= \'"+early+"\' AND `acq_year` <= \'"+late+"\' ";
        } // end year no else

      } // end cat no else
    }  // end country no else

  //////////////////////////////////////////////////////////////////////////////////////////////////
    // var sql = "SELECT * FROM Final_Data WHERE country = \'"+country+"\' AND Class_General = \'"+cat+"\' AND acq_year >= \'"+early+"\' AND acq_year <= \'"+late+"\'  ";
    console.log("query: ", sql)

    if(sql == "no"){

      res.send("must use at least one parameter");
    }else{
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
      }); // end sql query
    }

  }else{
    // if code or value is blank
    console.log("missing URL variables");
    res.send("missing URL variables");
  }   // end check if params are blanks
});    // end function


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get data subset for timeline of acquisitions by year for bubble chart
app.get('/timeline/group', function (req, res) {

    console.log("first group endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

    var sql = "SELECT country, count FROM donation_data WHERE country ='United States' OR country = 'United Kingdom' OR country = 'Japan' OR country = 'Egypt' OR country = 'Zaire' OR country = 'Australia'";
   //var sql = "SELECT country FROM donation_data LIMIT 10"  

       // Run the SQL Query
    connection.query(sql, function(err, rows, fields) {
      if (err) console.log("Err:" + err);
      if(rows != undefined){
        // If we have data that comes back send it to the user.
        res.send(rows);
      }else{
        // console.log("empty query");
        res.send("empty query");
      }
    }); // end sql query     

/////////////////////////////////////////////////////////////////

});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get data subset for timeline of acquisitions by year for bubble chart
app.get('/timeline/secondgroup', function (req, res) {

    console.log("secondgroup endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

    var sql = "SELECT country, count FROM donation_data WHERE country ='France' OR country = 'Mexico' OR country = 'Iran' OR country = 'China' OR country = 'Brazil' OR country = 'Italy' OR country = 'India'";
    //console.log("query: ", sql);
    //var sql = "SELECT country FROM donation_data LIMIT 10"  

       // Run the SQL Query
    connection.query(sql, function(err, rows, fields) {
      if (err) console.log("Err:" + err);
      if(rows != undefined){
        // If we have data that comes back send it to the user.
        res.send(rows);
      }else{
        // console.log("empty query");
        res.send("empty query");
      }
    }); // end sql query     

/////////////////////////////////////////////////////////////////

});



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  API EndPoint to get data subset for timeline of acquisitions by year for bubble chart
app.get('/acq/:early/:late', function (req, res) {

    console.log("acq endpoint")

      // Allows data to be downloaded from the server with security concerns
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-WithD");
      // If all the variables are provided connect to the database

      if(req.params.early != "" && req.params.late != ""){

        var early = mysql_real_escape_string(req.params.early);
        var late = mysql_real_escape_string(req.params.late);
        console.log("early: ", early);
        console.log("late: ", late);

        // check if the two values are "no"

        if(early == "no" && late == "no"){

          console.log("no year range")
          var sql = "SELECT country, count FROM donation_data";

          // console.log("query: ", sql)

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
          }); // end sql query


        }else{

        // console.log("early and late are not both no");
        var early = parseInt(req.params.early);
        var late = parseInt(req.params.late);
        // console.log("early: ", early);
        // console.log("late: ", late);

          // if there is a date range

          var sql = "SELECT country, count FROM donation_data WHERE year >= \'"+early+"\' AND year <= \'"+late+"\'";
          // var sql = "SELECT * FROM Final_Data WHERE `"+code+"` = \'"+value+"\'";

          // console.log("query: ", sql)

          // Run the SQL Query
          connection.query(sql, function(err, rows, fields) {
            if (err) console.log("Err:" + err);
            if(rows != undefined){
              // If we have data that comes back send it to the user.
              res.send(rows);
            }else{
              // console.log("empty query");
              res.send("empty query");
            }
          }); // end sql query

        }


      }else{
        // if code or value is blank
        // console.log("missing URL variables");
        res.send("missing URL variables");

      }
});

////////////////////////////////////////////////////////////////////////////////////////

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
