let obj = {};  

obj.createUser = function(attempt){
    return (`INSERT INTO user (FirstName,LastName,Email,Username,Password) VALUES ('${attempt.firstName.toString().trim()}','${attempt.lastName.toString().trim()}','${"null"}','${attempt.username.toString().trim()}','${attempt.password.toString()}')`).toString(); 
}

obj.findUser = function(username){
    return (`SELECT * FROM user WHERE Username='${username.toString().trim()}'`).toString();
}

module.exports = obj; 