let obj = {};  

obj.createUser = function(attempt){
    return (`INSERT INTO user (FirstName,LastName,Email,Password) VALUES ('${attempt.firstName.toString().trim()}','${attempt.lastName.toString().trim()}','${attempt.email.toString().trim()}','${attempt.password.toString()}')`).toString(); 
}

module.exports = obj; 