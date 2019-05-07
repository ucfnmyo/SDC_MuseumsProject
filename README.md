# SDC_MuseumsProject
Interactive web visualization of museum data.

To run a local version of website, a local host needs to be setup to avoid CORS issues. 
Navigate on command line to the host directory and run "python -m http.server" (python 3)
then browse to localhost: 8000 (or other portnumber)

## to run the server

clone the repo onto the case server
navigate to the Server directory using "cd"

use `node DataServer.js` to start the server

in a web browser go to http://dev.spatialdatacapture.org:8872/location/DEU to test api. 
if that doesn't respond, go to http://dev.spatialdatacapture.org:8872, to check if server is working at all. 

to run after closing server access use: `forever start DataServer.js`
to stop a forever process use either: `forever stopall' or `forever stop DataServer.js`




