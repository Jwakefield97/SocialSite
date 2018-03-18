CREATE DATABASE hackathon; 

CREATE TABLE user (
	Id INT NOT NULL AUTO_INCREMENT,
    FirstName VARCHAR(200) NOT NULL,
    LastName VARCHAR(200) NOT NULL,
    Username VARCHAR(200) NOT NULL, 
    Password VARCHAR(200) NOT NULL, 
    DateJoined DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (Id) 
); 

CREATE TABLE user_additional (
	username VARCHAR(200) NOT NULL,
    profileImage VARCHAR(1000),
    bio VARCHAR(2000), 
	email VARCHAR(300),
    phone_number INT, 
    last_accessed DATETIME, 
    PRIMARY KEY (username) 
);  
CREATE TABLE friend (
	username VARCHAR(200) NOT NULL,
    friend_username VARCHAR(200) NOT NULL,
	time_friended DATETIME DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (username,friend_username) 
); 
 

CREATE TABLE friends_pending (
	username VARCHAR(200) NOT NULL,
    friend_username VARCHAR(200) NOT NULL,
    request_status VARCHAR(10),                
    time_requested DATETIME DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (username,friend_username)
); 

CREATE TABLE posts(
  id INT NOT NULL AUTO_INCREMENT, 
  poster_username VARCHAR(200) NOT NULL,
  post_text VARCHAR(2000) NOT NULL, 
  time_created DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id) 
);
