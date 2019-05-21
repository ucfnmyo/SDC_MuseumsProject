# SDC_MuseumsProject
Interactive web visualization of museum data.

## map to-dos in vague order of priority
- update Clusters info panel to provide a space for cluster name and description. 
- create a countries filter reset button
- change styling to differentiate between countries with zero artwork and those which have artworks but are currently filtered out.
- grey out getimage button if there is no associated image. 
- add the table header which gives the current date and country filters used
- format the country stat text
- make the country stats discount unknown/other as main class. add Medium
- change the bar graph bar thickness.probably requires redefining the xaxis scale function.


## local website
To run a local version of website, a local host needs to be setup to avoid CORS issues. 
Navigate on command line to the host directory and run "python -m http.server" (python 3)
then browse to localhost: 8000 (or other portnumber)

it assumes a world.geoJSON file exists in /maps subfolder, and MET_noUSA.csv file in /data subfolder
The geoJSON file is the countries one on github. The csv file is a temporary data file until api integrated.

## to run the server

a separate apache server will deliver the file "public_html/index.html"  whenever you visit the address "http://dev.spatialdatacapture.org/~username"

so to host the web page on your own server, just replace the index.html file that's there currently with the one from the repo. 

clone the repo onto the case server
navigate to the Server directory using "cd"

use `node DataServer.js` to start the server


Replace the 4 digit port number with the one you are using. 
in a web browser go to http://dev.spatialdatacapture.org:8872/location/DEU to test api. 
if that doesn't respond, go to http://dev.spatialdatacapture.org:8872, to check if server is working at all. 

to run after closing server access use: `forever start DataServer.js`
to stop a forever process use either: `forever stopall' or `forever stop DataServer.js`




