SELECT * from SpatialMET LIMIT 10;

SELECT `Object ID`, `Object Name`, `Object Begin Date`, `Medium`, `lat`, `lng`, `Link Resource`  from SpatialMET Where CountryMatch = "DEU" LIMIT 10;

SELECT *  from SpatialMET Where CountryMatch = "DEU" LIMIT 10;


# SELECT COUNT(*) from artwork_cities_final;
# SELECT `City`, `city_geo



SELECT * FROM MET_Final2 Met_noUSA LIMIT 10;
DROP TABLE `ucfnjma`.`Final_Data`;
DROP TABLE `ucfnjma`.`Test_Table` ;

CREATE TABLE `ucfnjma`.`FINAL_DATA` (`Index` int, `Object ID` int, `object_number` text, `artist_nationality` text, `object_begin_date` int, `object_end_date` int, `credit_line` text, `country` text, `classification` text, `medium` text, `artist_display_name` text, `artist_display_bio` text, `culture` text, `object_name` text, `link` text, `acq_year` text, `Class_General` text);

LOAD DATA INFILE 'Met430k.csv'  INTO TABLE FINAL_DATA 
FIELDS TERMINATED BY ','  ENCLOSED BY '"'
LINES TERMINATED BY '\r\n' IGNORE 1 LINES;

SELECT * FROM ucfnjma.FINAL_DATA LIMIT 10;

RENAME TABLE `Test_Table` to `Final_Data`;


SELECT COUNT(*) FROM ;
