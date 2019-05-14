require(tidyverse)
require(sf)

points <- st_read("centroids.geojson")
LLC <- 102009
points <- st_transform(points,LLC)
data <- read_csv("Met430k.csv")
Country <- data %>% select("Object ID","country")
coords <- bind_cols(list(points$NAME,st_coordinates(points)[,1],st_coordinates(points)[,2]))
colnames(coords) <- c("Name","coordX","coordY")

Countries_geocoded <- inner_join(Country,coords, by=c("country"="Name"))
exceptions <- anti_join(Country,coords, by=c("country"="Name"))
write_csv(Countries_geocoded,"geocodes.csv")



timeData <- data %>% filter(object_begin_date<=2019) %>% mutate(normalisedAge= (log(2120-object_begin_date)-5.6)*2)
SpatioTemporalData <- timeData %>% select(`Object ID`,normalisedAge) %>% left_join(Countries_geocoded %>% select(-country))
write_csv(SpatioTemporalData,"STdata.csv")

