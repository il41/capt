// load the express library, which should be in the node_modules folder
// if you don't have a node_modules folder inside this basic-template folder
// see the README.md file in the root directory of this repo for instructions
const express = require('express')

// here we call the express() function which returns a default express server
// application. we assign it to a variable called 'app'
const app = express()

// here we create a variable that will contain our port number, this is set
// either in the terminal when we launch the app like: node server.js 3000
// otherwise  defaults to port 80, which requires sudo, ex: sudo node server.js
const port = process.argv[2] || 8002

// we can serve up an entire directory of static files using express.static()
// instead of having to define all the app.get() paths individually
app.use( express.static(__dirname+'/www') )

// start listening for requests from potential clients
app.listen( port, function(err){
    if(err){ // if there's an error, log it to terminal
        console.log(err)
    } else { // otherwise, log the following...
        console.log(`server is listening, visit http://localhost:${port}`)
    }
})
