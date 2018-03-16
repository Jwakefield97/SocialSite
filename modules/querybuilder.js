let obj = {};  

obj.createUser = function(attempt){
    return (`INSERT INTO user (FirstName,LastName,Email,Username,Password) VALUES ('${attempt.firstName.toString().trim()}','${attempt.lastName.toString().trim()}','${"null"}','${attempt.username.toString().trim()}','${attempt.password.toString()}')`).toString(); 
};

obj.findUser = function(username){
    return (`SELECT * FROM user WHERE Username='${username.toString().trim()}'`).toString();
};

obj.findUsers = function(startIndex,endIndex){
    return (`SELECT u.username, u.FirstName, u.LastName, a.profileImage, a.bio, a.email, a.phone_number FROM user u LEFT JOIN user_additional a ON u.username=a.username ORDER BY u.username ASC LIMIT ${startIndex},${endIndex}`).toString();
}; 

obj.findAdditionalInfo = function(username){
    return (`SELECT * FROM user_additional WHERE username='${username}'`).toString(); 
};

obj.insertAddionalInfo = function(username,info){
    return (`INSERT INTO user_additional (username,profileImage,bio,email,phone_number,last_accessed) VALUES ('${username.toString().trim() || null}','${info.profileImage.toString().trim() || null}','${info.bio.toString().trim() || null}','${info.email.toString().trim() || null}',${info.phoneNumber.toString().trim() || null},NOW())`).toString(); 
};

obj.updateAdditonalInfo = function(username,info){
    return (`UPDATE user_additional SET profileImage='${info.profileImage.toString().trim() || null}',bio='${info.bio.toString().trim() || null}',email='${info.email.toString().trim() || null}',phone_number=${info.phoneNumber.toString().trim() || null},last_accessed=NOW() WHERE username='${username.toString().trim()}'`).toString();
};

obj.searchUsers = function(searchTerm){
    return (`SELECT u.username, u.FirstName, u.LastName, a.profileImage, a.bio, a.email, a.phone_number FROM user u LEFT JOIN user_additional a ON u.username=a.username WHERE u.username LIKE '%${searchTerm.toString().trim()}%' OR u.FirstName LIKE '%${searchTerm.toString().trim()}%' OR u.LastName LIKE '%${searchTerm.toString().trim() || null}%' ORDER BY u.username ASC`).toString(); 
};

obj.findFriendRequests = function(from,to){
    return (`(SELECT username FROM friend WHERE username = '${from.toString().trim()}' AND friend_username = '${to.toString().trim()}') UNION ALL (SELECT username FROM friends_pending WHERE username = '${from.toString().trim()}' AND friend_username = '${to.toString().trim()}')`).toString(); 
};

obj.insertFriendRequest = function(from,to){
    return (`INSERT INTO friends_pending (username,friend_username,request_status,time_requested) VALUES ('${from.toString().trim()}','${to.toString().trim()}','pending',NOW())`).toString();
}; 

obj.getFriends = function(username){
    return (``).toString(); 
}

module.exports = obj; 
