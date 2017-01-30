//This is app.js
//This is designed to be a simple tutorial on how to build a data service to an existing postgres database

//import necessary modules
var app = require("express")();
var bodyParser = require('body-parser');
var pg = require("pg");
var pgp = require('pg-promise')();


///create a connection to the datase
function createDBConnection(){
  //returns a database connection
  //NOTE: you must be on SHC network to use
    var cn = {
        host: 'geo-gradserver.shc.wisc.edu',
        port: 5432, //default
        database: 'class-tutorial',
        user: 'classtutorialuser',
        password:  'Tutorial!'
    };
    var db = pgp(cn); //do the connection using pg-promise library
    return db
}

//create a connection instance to use in any query
db = createDBConnection()


//API ENDPOINTS
app.get('/flights', function (req, res) {
  //this function is the endpoint for the flight data

  //get query parameters
  var originCity = req.query.originCity || null
  var limit = req.query.limit || null

  //write the SQL you'll need for the query
  sql = "SELECT * FROM flightdelays \
    WHERE 1=1\
    AND (${origin} IS NULL or flightdelays.origin = ${origin}) \
    LIMIT ${limit};"

  //define the variables you want to pass to your query
  vars = {
    origin: originCity,
    limit: limit
  }

  //execute the query
  //expect any number of rows to be returned [0, Infinity)
  db.any(sql, vars)
    .then(function(data){
      //on success
      var ts = new Date().toJSON()
      var resOut = {
        "success" : true,
        "timestamp" : ts,
        data: data
      }
      res.json(resOut) //finish request by sending data back to the user
    })
  .catch(function(err){
    //on error
    var ts = new Date().toJSON()
    var resOut = {
      "success" : false,
      "timestamp" : ts,
      data: []
    }
    res.json(resOut) //send error notifcation back to the user
  })
})



// start the service
app.listen(8080, function () {
  console.log('Server running...')
})
