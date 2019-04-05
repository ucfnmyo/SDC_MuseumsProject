

#Importing libraries
import pandas as pd
import requests
import numpy as np
import json
from pandas.io.json import json_normalize
import sqlalchemy
import time

#Initialising endpoint

# documentation here: 
# https://wiki.openraildata.com/index.php/HSP

#Service Details endpoint
SD_endpoint = "https://hsp-prod.rockshore.net/api/v1/serviceDetails"

#Service Metrics endpoint
SM_endpoint = "https://hsp-prod.rockshore.net/api/v1/serviceMetrics"

#Setting Headers and authorisation
header = {"Content-Type" : "application/json"};
auth = ("mohammadyounes08@gmail.com","CASAEliteSquad2019$$");


# test the connection with this query from the API documentation
#data = {
#     "from_loc":"BTN",
#     "to_loc":"VIC",
#     "from_time":"0700",
#     "to_time":"0800",
#     "from_date":"2016-07-01",
#     "to_date":"2016-08-01",
#     "days":"WEEKDAY"
#     }

# test_request = requests.post(SM_endpoint, headers = header, auth = auth, data = json.dumps(data))
# print("status: ", test_request)  

# info_from_api = json_normalize(test_request.json()['Services']) 
# print("info returned: ", info_from_api)

# print(len(info_from_api.index))



# need to loop through

# stations
# am and pm
# dates
#       stations * stations * times * weekdays in year
# means 3000 * 3000 * 2 * 250


from_station = "BTN"
to_station = "VIC"
from_time = "0700"
to_time = "2300"
from_date = "2016-07-01"
to_date = "2016-07-01"
days= "WEEKDAY"

data = {
     "from_loc":from_station,
     "to_loc":to_station,
     "from_time":from_time,
     "to_time":to_time,
     "from_date":from_date,
     "to_date":to_date,
     "days":days
     }

#
#
#data = {
#    'url': SM_endpoint, 
#    "from_loc":from_station,
#    "to_loc":to_station,
#    "from_time":from_time,
#    "to_time":to_time,
#    "from_date":from_date,
#    "to_date":to_date,
#    "days":days
#    }


start = time.time()
test_request = requests.post(SM_endpoint, headers = header, auth = auth, data = json.dumps(data))
end = time.time()
print("status: ", test_request)  
print("Query took ", end - start, "seconds to complete")


try:
    info_from_api = json_normalize(test_request.json()['Services']) 
except:
    print("no json returned by API")
    
# print("info returned: ", info_from_api)


print(len(info_from_api.index), "results returned")

# use time.sleep("amount of time")  # to add patience between queries 

