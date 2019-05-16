We are clustering by two numerical variables, the artwork age and the location, and three categorical variables, the classification given by the MET and our extracted keywords for materials and method.

This may seem a straight-forward task, but there are three important aspects of our dataset:
1. We don't know how many clusters to expect; the clusters are likely to vary greatly in size; and there will be points that don't naturally form a cluster. This rules out k-means clustering and leans towards a density based approach such as DBSCAN. 

2. But we are also dealing with BIG DATA, at over 400,000 records. Processes such as DBSCAN that depend on pairwise distance comparisons naturally scale quadratically. 

3. As an additional complication, our categorical variables have a very large number of categories; furthermore not all records have a single value in each category - there are records with no information for the category AND there are records which have multiple category values e.g. the artwork has been produced using more than one material.

[Value counts by each categorical variable to illustrate the data breakdown]

To cluster categorical variables, a standard approach is one-hot encoding: creating a binary parameter for each potential category value. There are two drawbacks with this: it doesn't deal well with varying numbers of values in each record, as the more information records have, the further away they appear distance wise, and null records form an artifical cluster; secondly it's unclear how to normalise the data, as a typical normalisation by the standard deviation of the data scales rare cateogries to larger distances. This might be valid, but equally it may not be.

A usual alternative is to consider the Gower distance. Effectively, this gives each pair of records a similarity score by tallying up the number of matches they have in the category, which is useful for differing numbers of values. This is converted into a distance for our clustering by normalising the scores to a range of 1 and the distance is simply 1 less the score. 

The DBSCAN implementation in python available to us usually uses Euclidean distance, but has the ability to call any pairwise distance function and we could have precomputated a similarity matrix, but for our dataset this would have taken over 1 week to calculate! The standard euclidean distance implementation makes use of some shortcuts and scales more easily. So from a practical perspective, we used one-hot encoding, but removed all null values to avoid the creation of an artifical cluster, and didn't normalise the data, so that the scales are similar to a Gower distance. This leaves issues with records that has multiple values but it's a relatively small part of the dataset.

A similar problem comes into our notion of distance. For this we are using the centroids of the countries, processed using QGIS, and we can work directly with the latitude and longitude to calculate an accurate distance between points, through some basic trigonometry, but even the fastest implementation isn't feasible for our scale of dataset. In order to get round this we decided to convert the coordinates to a projection, which allows us to make use of the standard DBSCAN distance function. We used the Lambart Conformal Conic projection. Its advantages are that straight-lines in the projection equate to great-circles, the shortest path between two points, and it minimises the distortion of distance in the northern hemisphere, which is where the majority of the artwork is from. The disadvantage is the overstatement of distance in the southern hemiphere. Furthermore by using a projection, we miscalculate distance where the shortest path lies across a projection boundary, e..g between USA and Japan the shortest path goes via the Pacific, not Europe.

Having done this we can see that the data, the x co-ordinate forms three distinct clusters, likely to be continents, and that for the y-axis most fo the artwork is from the northern hemisphere as expected.

Our final task was to normalise the artwork dates {write up here or separately?}


# Website Version
We are clustering by two numerical variables, the artwork age and the location, and three categorical variables, the classification given by the MET and our extracted keywords for materials and method.

This may seem a straight-forward task, but there are three important aspects of our dataset:
1. We don't know how many clusters to expect; the clusters are likely to vary greatly in size; and there will be points that don't naturally form a cluster. This rules out k-means clustering and leans towards a density based approach such as DBSCAN. 

2. But we are also dealing with BIG DATA, at over 400,000 records. Processes such as DBSCAN that depend on pairwise distance comparisons naturally scale quadratically. 

3. As an additional complication, our categorical variables have a very large number of categories; furthermore not all records have a single value in each category - there are records with no information for the category AND there are records which have multiple category values e.g. the artwork has been produced using more than one material.

We overcame the categorical problem with a one-hot encoding approach:creating a binary parameter for each potential category value. Vectorizing the data in this manner allowed us to create distances that would be captured by the DBSCAN. Artworks that did not match with any category or medium keywords were dropped to avoid artifical clusters.   

Temporal data was incorported with the object begin date, since it defines an artistic reaction to a historical event. The Gower distance function enabled us to normalise annual dates that would fit in well with DBSCAN euclidean distance function. 

A similar problem comes into our notion of distance. For this we are using the centroids of the countries, processed using QGIS, and we can work directly with the latitude and longitude to calculate an accurate distance between points. In order to get round this we decided to convert the coordinates to a projection, which allows us to make use of the standard DBSCAN distance function. We used the Lambart Conformal Conic projection. Its advantages are that straight-lines in the projection equate to great-circles, the shortest path between two points, and it minimises the distortion of distance in the northern hemisphere, which is where the majority of the artwork is from.
