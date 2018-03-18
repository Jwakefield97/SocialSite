let obj = {};  

obj.createUser = function(attempt){
    return (`INSERT INTO user (FirstName,LastName,Email,Username,Password) VALUES ('${attempt.firstName.toString().trim()}','${attempt.lastName.toString().trim()}','${"null"}','${attempt.username.toString().trim()}','${attempt.password.toString()}')`).toString(); 
};

obj.findUser = function(username){
    return (`SELECT * FROM user WHERE Username='${username.toString().trim()}'`).toString();
};

obj.findUsers = function(startIndex,endIndex){
    return (`SELECT u.Username, u.FirstName, u.LastName, a.profileImage, a.bio, a.email, a.phone_number FROM user u LEFT JOIN user_additional a ON u.username=a.username ORDER BY u.username ASC LIMIT ${startIndex},${endIndex}`).toString();
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
    return (`SELECT u.Username, u.FirstName, u.LastName, a.profileImage, a.bio, a.email, a.phone_number FROM user u LEFT JOIN user_additional a ON u.username=a.username WHERE u.username LIKE '%${searchTerm.toString().trim()}%' OR u.FirstName LIKE '%${searchTerm.toString().trim()}%' OR u.LastName LIKE '%${searchTerm.toString().trim() || null}%' ORDER BY u.username ASC`).toString(); 
};

obj.findFriendRequests = function(from,to){
    return (`(SELECT username FROM friend WHERE username = '${from.toString().trim()}' AND friend_username = '${to.toString().trim()}') UNION ALL (SELECT username FROM friends_pending WHERE username = '${from.toString().trim()}' AND friend_username = '${to.toString().trim()}')`).toString(); 
};

obj.addFriend = function(username,friend){
    return (`INSERT INTO friend (username,friend_username,time_friended) VALUES ('${username.toString().trim()}','${friend.toString().trim()}',NOW())`).toString(); 
}

obj.getFriends = function(username){
    return (`SELECT u.username, u.FirstName, u.LastName, u.profileImage FROM (SELECT u.Username,u.FirstName,u.LastName,ua.profileImage FROM user u LEFT JOIN user_additional ua ON u.username = ua.username) as u, friend f WHERE f.username = '${username.toString().trim()}' AND u.Username = f.friend_username`).toString(); 
};
obj.getPendingFriends = function(username){
    return (`SELECT u.Username, u.FirstName, u.LastName, u.profileImage, fp.request_status FROM (SELECT u.Username,u.FirstName,u.LastName,ua.profileImage FROM user u LEFT JOIN user_additional ua ON u.username = ua.username) as u, friends_pending fp WHERE u.Username = fp.username AND fp.friend_username = '${username.toString().trim()}'`).toString(); 
}; 

obj.insertFriendRequest = function(from,to){
    return (`INSERT INTO friends_pending (username,friend_username,request_status,time_requested) VALUES ('${from.toString().trim()}','${to.toString().trim()}','pending',NOW())`).toString();
}; 

obj.deleteFriendRequest = function(username, friend){
    return (`DELETE FROM friends_pending WHERE username = '${friend.toString().trim()}' AND friend_username = '${username.toString().trim()}'`).toString();
};

obj.deleteFriend = function(username, friend){
    return (`DELETE FROM friend WHERE username = '${username.toString().trim()}' AND friend_username = '${friend.toString().trim()}'`).toString();
};

obj.createPost = function(username,text){
    return (`INSERT INTO posts (poster_username,post_text) VALUES ('${username.toString().trim()}','${text.toString().trim()}')`).toString(); 
}; 
module.exports = obj; 

