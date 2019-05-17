#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed May 15 10:12:12 2019

@author: terry
"""
import numpy as np
import pandas as pd
from sklearn.cluster import DBSCAN
from sklearn import metrics

def transform(dataname):
    for i in dataname.index:
        dataname.at[i, 'age'] = np.log(2120.0-dataname.at[i, 'age'])
        
def normalise(dataname):
    meanX=dataname["coordX"].mean()
    stdX=dataname["coordX"].std()
    meanY=dataname["coordY"].mean()
    stdY=dataname["coordY"].std()
    meanAge=dataname["age"].mean()
    stdAge=dataname["age"].std()

    dataname.loc[:, 'age']=dataname.loc[:, 'age'].astype(float)
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
    subset=data[((data["class"]!="unknown_other") & (data.medium!="unknown_other"))]
    cols_to_drop=["Object ID","country","class","medium"]
    clustervector=subset.drop(columns=cols_to_drop)
    dbscan = DBSCAN(eps = eps,  min_samples = minSamples,n_jobs=-1)
    dbscan.fit(clustervector)
    dbscan_labels = dbscan.labels_
    silh = metrics.silhouette_score(clustervector, dbscan_labels)
    print("Silhouette Score: ", silh)
    clusters = subset[['Object ID',"age"]]
    clusters.columns=['Object ID','Cluster ID']
    clusters.loc[:,"Cluster ID"] = dbscan_labels
    print(clusters['Cluster ID'].value_counts())
    
    return clusters, silh, data.shape[0], eps, minSamples


def dbscanSTFit(data, eps, minSamples):
    #DBSCAN for non Year Data
    clustervector=data[["age","coordX","coordY"]]
    dbscan = DBSCAN(eps = eps,  min_samples = minSamples,n_jobs=-1)
    dbscan.fit(clustervector)
    dbscan_labels = dbscan.labels_
    silh = metrics.silhouette_score(clustervector, dbscan_labels)
    print("Silhouette Score: ", silh)
    clusters = data[['Object ID',"age"]]
    clusters.columns=['Object ID','Cluster ID']
    clusters.loc[:,"Cluster ID"] = dbscan_labels
    print(clusters['Cluster ID'].value_counts())
    
    return clusters, silh, data.shape[0], eps, minSamples


def saveCluster(cluster):    
    fullClusterList=pd.DataFrame(clusterdata.loc[:,"Object ID"])
    fullClusterList.loc[:,"Cluster ID"]=[-1]*fullClusterList.shape[0]
    fullClusterList.loc[fullClusterList["Object ID"].isin(cluster["Object ID"]),"Cluster ID"]=cluster["Cluster ID"]
    fullClusterList.to_csv("result"+str(i)+".csv")
    

clusterdata=pd.read_csv("ClusterData2.csv",delimiter = ',')
clusterdata=clusterdata.drop("Unnamed: 0",axis=1)
clusterdata.loc[clusterdata.age >2020,"age"]=-clusterdata.loc[clusterdata.age >2020,"age"]
clusterdata.loc[:,"age"]=clusterdata.loc[:,"age"].astype(float)
transform(clusterdata)
clusterdata.age.describe()
clusterdata.age.hist(bins=30)
normalise(clusterdata)

clusterdata.dtypes

clusterdata.isnull().sum().sum()
clusterdata.isna().sum().sum()
clusterdata.iloc[:,7:].sum(axis=1).value_counts()
pd.options.display.max_columns=84
clusterdata.age.describe()
clusterdata.age.hist(bins=50)
clusterdata.coordX.hist(bins=50)
clusterdata.coordY.hist(bins=50)

ScaledData=scale(clusterdata,ageScale=2,distanceScale=2)
ScaledData.age.hist(bins=50)
ScaledData.coordX.hist(bins=50)
ScaledData.coordY.hist(bins=50)

result=dbscanFit(ScaledData.sample(40000),eps=1.25,minSamples=1000)
ScaledData.age.hist()

result=[]
i=0

result.append(dbscanFit(ScaledData,eps=0.75,minSamples=1000))
saveCluster(result[i][0])
i+=1
result.append(dbscanFit(ScaledData,eps=0.75,minSamples=2000))
saveCluster(result[i][0])
i+=1
result.append(dbscanFit(ScaledData,eps=1,minSamples=2000))
saveCluster(result[i][0])
i+=1
result.append(dbscanFit(ScaledData,eps=1.25,minSamples=2000))
saveCluster(result[i][0])
i+=1
result.append(dbscanSTFit(ScaledData,eps=0.25,minSamples=1000))
saveCluster(result[i][0])
i+=1
result.append(dbscanSTFit(ScaledData,eps=0.5,minSamples=1000))
saveCluster(result[i][0])
i+=1
result.append(dbscanSTFit(ScaledData,eps=0.5,minSamples=2000))
saveCluster(result[i][0])
i+=1
result.append(dbscanSTFit(ScaledData,eps=0.75,minSamples=2000))
saveCluster(result[i][0])
i+=1

result.to_json("results.json")


#
#
#import time
#start=time.perf_counter()
#result.append(dbscanSTFit(ScaledData,eps=1,minSamples=2000))
#end=time.perf_counter()
#print(end-start)


