# SDC_MuseumsProject
Interactive web visualization of museum data.

## website to-dos
1. Formatting - work on div dimensions so that the elements display nicely.
2. Choropleth scale. Decide on color scaling.
3. Scaling and legend. Tidy up the domain to nice round numbers.
4. Refactor code.
5. Replace pie chart with row chart once the categorisation has been cleaned up (currently too many categories to display properly)
6. Add graph labels and ability to reset filters
7. Add records table to list selected records
8. Add listener on records table to select clusters and bring through images of artwork
9. Create a ZoomIn function which locates artwork by cities.
10. Add website pages to detail analysis and clustering statistics.
11. Erorr check on d3 node updates and removals



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




