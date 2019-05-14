#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon May 13 22:37:04 2019

@author: terry
"""
import math
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt


def Haversine(origin, destination):
    #Calculate the Haversine distance  - not scaled for earth radius.
    lat1, lon1 = origin
    lat2, lon2 = destination
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) * math.sin(dlon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return c

Met = pd.read_csv('Met430k.csv', sep = ',', engine = 'python')
geocodes = pd.read_csv('geocodes.csv', sep = ',', engine = 'python')

ClusterData=Met.loc[Met.object_begin_date <= 2019]
for i in ClusterData.index:
    ClusterData.at[i, 'normalised_age'] = (np.log((2120-ClusterData.at[i, 'object_begin_date']))-5.6)*2
        
SpatioTemporalData=ClusterData[["Object ID","normalised_age"]].merge(geocodes[["Object ID","coordX","coordY"]],how="left",left_on="Object ID",right_on="Object ID")

meanX=geocodes["coordX"].mean()
stdX=geocodes["coordX"].std()
meanY=geocodes["coordY"].mean()
stdY=geocodes["coordY"].std()

for i in SpatioTemporalData.index:
        SpatioTemporalData.at[i, 'coordX'] = (geocodes.at[i, 'coordX']-meanX)/stdX
        SpatioTemporalData.at[i, 'coordY'] = (geocodes.at[i, 'coordY']-meanY)/stdY

import scipy
from sklearn.cluster import DBSCAN
from sklearn import metrics
import functools


def metricFunction(x,y,mu):
    time = abs(x[1]-y[1])  
    space = Haversine((x[3],x[2]),(y[3],y[2]))
    distance = time + mu * space
    return distance

def dbscanFitMetric(data, eps, minSamples,mu):
    metric_weighted=functools.partial(metricFunction,mu=mu)
    #DBSCAN for non Year Data
    dbscan = DBSCAN(eps = eps, metric = metric_weighted, min_samples = minSamples)
    dbscan.fit(data)
    dbscan_labels = dbscan.labels_
    silh = metrics.silhouette_score(data, dbscan_labels)
    print("Silhouette Score: ", silh)
    clusters = pd.DataFrame(dbscan_labels)
    clusters['Count'] = 1
    clusters.columns = ['Cluster ID', 'Count']
    print(clusters.groupby('Cluster ID').sum().head())
    
    return dbscan_labels

def dbscanFit(data, eps, minSamples):
    #DBSCAN for non Year Data
    dbscan = DBSCAN(eps = eps,  min_samples = minSamples)
    dbscan.fit(data)
    dbscan_labels = dbscan.labels_
    silh = metrics.silhouette_score(data, dbscan_labels)
    print("Silhouette Score: ", silh)
    clusters = pd.DataFrame(dbscan_labels)
    clusters['Count'] = 1
    clusters.columns = ['Cluster ID', 'Count']
    print(clusters.groupby('Cluster ID').sum().head())
    
    return dbscan_labels



import time
start=time.perf_counter()
dbscanFit(SpatioTemporalData.iloc[1:100000,1:],eps=0.5,minSamples=10)
end=time.perf_counter()
print(end-start)
