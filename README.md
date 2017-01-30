# DataServiceCLES
A collection of annotated files for teaching the Cart Lab Education Series on January 31, 2017

## Setting up the Database

That's a theme for another CLES, or Qunying's Geography 576. For now, you can use the tutorial database. A SQL dump of it is included in the repository.


## Setting up the Bridge
1. Install Node (https://nodejs.org/en/)
2. Create a new application or clone my repo
3. Set up the application in ```app.js```
4. Write controllers for each endpoint

### Creating a new Node Application
1. Initialize new project with ```npm init```
2. Follow prompts on terminal screen to initialize new application
3. Open ```package.json``` with your favorite text editor.
4. Add the following to include dependencies:

  ```
  "dependencies": {
    "express": "latest",
    "body-parser": "latest",
    "pg": "latest",
    "pg-promise": "latest",
  }
  ```
  
  This installs the following libraries:

  - ```express```: Web framework
  - ```body-parser```: For getting query data
  - ```pg```: Postgres bindings
  - ```pg-promise```: Postgres bindings with better syntax

5. Run the command ```npm install```
6. You're now able to run your application. If you (at any time) need to add more dependencies, add them to the section you jsut created.

### Set up the application
1. Create a file called ```app.js```
2. Import the required modules (this part is a lot like python)
  - Require each library by creating a new variable with its name:
  ```
  var express = require('express')
```
3. Create a connection to the database.
  - For this, I like to use a function, so it can be reused. For example:

  ```
  createDBConnection(){
    //returns a database connection
    //NOTE: you must be on SHC network to use
      var cn = {
      host: yourHost,
      port: 5432, //default
      database: yourDBName,
      user: yourUsername,
      password: yourPassword
  };
  var db = pgp(cn); //do the connection using pg-promise library
  return db
  }
  ```
4. Write endpoint functions (see below)
5. Start your application. Tell the server to listen for incoming client requests.
  ```
  app.listen(8080, function () {
    console.log('Started application.')
})
```

### Writing endpoint functions
1. In the body of your ```app.js``` file, write a function for each endpoint you want to support. For now, we'll just focus on ```GET``` requests, but you can do other verbs as well, and get data pased in via the body of the request if you want that too...

  ```
  app.get('/flights', function (req, res) {
    //this function is the endpoint for the flight data

    //do step two here
    //do step three here
    //do step four here
    //do step five here
  })
  ```
2.  Inside of the function body, parse the user input:
  ```
  //get query parameters
  var originCity = req.query.originCity || null
  ```
  Include one variable for each filter/query parameter/argument you want in your endpoint. This gives you the value of that parameter, if it's in the query string, otherwise, you get a ```null```.

3. Write a SQL query, using the value other the parameter(s) given by the user. The SQL here is arbitrary -- you can do anything you might want to do in PGAdmin or psql.  Joins, views, selects, deletes -- it's all on the table. Pass user parameter values in via the ```${variableName}``` syntax, or see the [pg-promise](https://github.com/vitaly-t/pg-promise) library docs.

  ```sql = "SELECT * FROM flightdelays \
    WHERE 1=1
    AND (${origin} IS NULL or flightdelays.origin = ${origin})"
  ```

  This syntax ensures that all results will be given back to the user in the case that no origin city is specified, and is extremely helpful for API building.

4. Execute the query, using the pg-promise functions. This happens asynchronously, so be prepared. You can make an object with the query values first, if that helps you think through what you're passing to the query.

  ```
  db.any(sql, {origin: originCity})
    .then(function(data){
      //happens on success
      })
    .catch(function(err){
      //happens on error
      })
    ```

5. Do any data conversions or other stuff you want. Then return the result as JSON. I like to include a timestamp, and a message that says the call succeeded.

  ```
  //return response to user
  var ts = new Date().toJSON()
  var resOut = {
    "success" : true,
    "timestamp" : ts,
    data: data
  }
  res.json(resOut) //finish request by sending data back to the user
  ```

### Start the Service
1. Open a new terminal/command line window  
2. Run the command ```node app.js```
3. The server is running.

## Setting up the Client
The client can be set up as you would for any AJAX call. No special modifications are needed, you just need to know the names and data types of the values being given to the bridge data service (as you would for any API).

```$.ajax("localhost:8080", {
    data: {
      origin: 'PHX',
    },
    success: function(data){
      console.log("Got data!")
      console.log(data)
    },
    error: function(status, xhr, error){
      console.log(xhr.responseText)
    }
  })
```
