let obj = {};  

obj.createUser = function(attempt){
    return (`INSERT INTO user (FirstName,LastName,Email,Username,Password) VALUES ('${attempt.firstName.toString().trim()}','${attempt.lastName.toString().trim()}','${"null"}','${attempt.username.toString().trim()}','${attempt.password.toString()}')`).toString(); 
};

obj.findUser = function(username){
    return (`SELECT * FROM user WHERE Username='${username.toString().trim()}'`).toString();
};

obj.findAdditionalInfo = function(username){
    return (`SELECT * FROM user_additional WHERE username='${username}'`).toString(); 
};

obj.insertAddionalInfo = function(username,info){
    return (`INSERT INTO user_additional (username,profileImage,bio,email,phone_number,last_accessed) VALUES ('${username.toString().trim()}','${info.profileImage.toString().trim()}','${info.bio.toString().trim()}','${info.email.toString().trim()}',${info.phoneNumber.toString().trim()},NOW())`).toString(); 
};

obj.updateAdditonalInfo = function(username,info){
    return (`UPDATE user_additional SET profileImage='${info.profileImage.toString().trim()}',bio='${info.bio.toString().trim()}',email='${info.email.toString().trim()}',phone_number=${info.phoneNumber.toString().trim()},last_accessed=NOW() WHERE username='${username.toString().trim()}'`).toString();
};

module.exports = obj; 