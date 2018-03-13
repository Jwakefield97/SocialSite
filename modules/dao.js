let obj = {},
    querybuilder = require("./querybuilder.js"),
    mysql = require("mysql"),
    dbprops = { //used to connect to db 
      host: "localhost",
      user: "hackathon",
      password: "hackathon",
      database: "hackathon"
    },
    bcrypt = require("bcrypt"), // used for encryption 
    saltRounds = 10;//num of salting rounds 

obj.findUser = function(user){

};

obj.signUpAttempt = function(attempt){
    return new Promise((res,rej) => {
        const dbconn = mysql.createConnection(dbprops); 
        attempt.password = attempt.password.trim(); 
        bcrypt.hash(attempt.password, saltRounds, (err, hash)=> {
            if(!err){
                attempt.password = hash; 
                dbconn.query(querybuilder.findUser(attempt.username), (err,result)=>{
                    if(err){
                        dbconn.destroy(); 
                        res("error"); 
                    }else{
                        if(result.length === 0){
                            dbconn.query(querybuilder.createUser(attempt), (err,result)=>{
                                if(err){
                                    dbconn.destroy();
                                    res("error");  
                                }else{
                                    dbconn.destroy();
                                    res("success"); 
                                }
                            }); 
                        }else{
                            dbconn.destroy();
                            res("registered");  
                        }
                    }
                });   
            }else{
                dbconn.destroy();
                res("error");
            }
        });
    }); 
};


obj.signInAttempt = function(attempt){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops); 
        dbconn.query(querybuilder.findUser(attempt.username), (err,result)=>{
            if(result.length === 1){
                bcrypt.compare(attempt.password.toString().trim(), result[0].Password, function(err, check) { 
                    if(err){
                        dbconn.destroy();
                        res("error"); 
                    }else{
                        if(check === true){
                            dbconn.destroy();
                            res(["success",result[0].Username]); //return success message and username

                        }else{
                            dbconn.destroy();
                            res("wrong"); 
                        }
                    }
                });
            }else{
                dbconn.destroy();
                res("error"); 
            } 
        }); 
    }); 
}; 



module.exports = obj; 