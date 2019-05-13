#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon May 13 13:36:23 2019

@author: terry
"""

#This function takes in the MET data and the method/materials list and produces a dataframe indicating whether
#the artwork incoporates a certain method/material, this is show as either 1 (True) or 0 (False)

import numpy as np
import pandas as pd

data = pd.read_csv('Met430k.csv',delimiter = ',')
keywords = pd.read_csv("method_freq_final.csv",delimiter = ',')

def mediumMatch(data, keywords):
    strings=data[["Object ID","medium"]]
    for i, text in strings["medium"].items():
        strings.at[i,"medium"]=str(text).lower()
    
    tags=np.array(list(keywords["Medium"]))
    
    PD = data[["Object ID"]]
    for tag in tags:
        column=[0]*strings["medium"].size
        for i, string in strings["medium"].items():
            if tag in string:
                column[i]=1
        PD.loc[:,tag]=column
    
    return PD

mediumMatch(data,keywords)
