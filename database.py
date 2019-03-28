# -*- coding: utf-8 -*-
"""
Created on Thu Mar 28 14:17:49 2019

@author: Hugh
"""


#libraries

#import numpy as np

import pandas as pd

from  sqlalchemy import create_engine 

#read csv 

stations = pd.read_csv('station_codes.csv')

# set up database connection

engine = create_engine('mysql+pymysql://ucfnhke:baleyakuli@dev.spatialdatacapture.org:3306/ucfnhke')

conn = engine.raw_connection()

# upload data