#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May 15 10:12:12 2019

@author: terry
"""
import pandas as pd
from sklearn.cluster import DBSCAN
from sklearn import metrics

def normalise(dataname):
    meanX=dataname["coordX"].mean()
    stdX=dataname["coordX"].std()
    meanY=dataname["coordY"].mean()
    stdY=dataname["coordY"].std()
    meanAge=dataname["age"].mean()
    stdAge=dataname["age"].std()

    for i in dataname.index:
        dataname.at[i, 'coordX'] = (dataname.at[i, 'coordX']-meanX)/stdX
        dataname.at[i, 'coordY'] = (dataname.at[i, 'coordY']-meanY)/stdY
        dataname.at[i, 'age'] = (dataname.at[i, 'age']-meanAge)/stdAge
    
def scale(dataname,ageScale,distanceScale):
    PD=dataname.copy(deep=True)
    for i in PD.index:
        PD.at[i, 'coordX'] = distanceScale * PD.at[i, 'coordX']
        PD.at[i, 'coordY'] = distanceScale * PD.at[i, 'coordY']
        PD.at[i, 'age'] = ageScale * PD.at[i, 'age']
    
    return PD

def dbscanFit(data, eps, minSamples):
    #DBSCAN for non Year Data
    subset=data[(~data["class"].isnull()) &(~data.medium.isnull())]
    cols_to_drop=["Unnamed: 0","Object ID","country","class","medium"]
    clustervector=subset.drop(columns=cols_to_drop)
    dbscan = DBSCAN(eps = eps,  min_samples = minSamples,p=1,n_jobs=-1)
    dbscan.fit(clustervector)
    dbscan_labels = dbscan.labels_
    silh = metrics.silhouette_score(clustervector, dbscan_labels)
    print("Silhouette Score: ", silh)
    clusters = subset[['Object ID',"age"]]
    clusters.columns=['Object ID','Cluster ID']
    clusters.loc[:,"Cluster ID"] = dbscan_labels
    print(clusters['Cluster ID'].value_counts())
    
    return clusters,silh


def dbscanSTFit(data, eps, minSamples):
    #DBSCAN for non Year Data
    clustervector=data[["age","coordX","coordY"]]

    dbscan = DBSCAN(eps = eps,  min_samples = minSamples,p=1,n_jobs=-1)
    dbscan.fit(clustervector)
    dbscan_labels = dbscan.labels_
    silh = metrics.silhouette_score(clustervector, dbscan_labels)
    print("Silhouette Score: ", silh)
    clusters = data[['Object ID',"age"]]
    clusters.columns=['Object ID','Cluster ID']
    clusters.loc[:,"Cluster ID"] = dbscan_labels
    print(clusters['Cluster ID'].value_counts())
    
    return clusters,silh

ClusterData=pd.read_csv("ClusterData1.csv",delimiter = ',')
normalise(ClusterData)
ScaledData=scale(ClusterData,ageScale=2,distanceScale=2)

1/4*2**4
results=[]
for i in range(5):
    ScaledData==scale(ClusterData,ageScale=1,distanceScale=1/4*2**i)
    for j in range(10):
        results.append(dbscanFit(ScaledData.sample(100000),eps=1/32*2**j,minSamples=1000))
        

result=dbscanFit(ScaledData.sample(10000),eps=2,minSamples=100)


ScaledData.loc[370834,:]

#
#import time
#start=time.perf_counter()
#dbscanFit(ScaledData.sample(100000),eps=2,minSamples=100)
#end=time.perf_counter()
#print(end-start)

