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

obj.findUsers = function(startIndex,endIndex){
    return new Promise((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops); 
        dbconn.query(querybuilder.findUsers(startIndex,endIndex), (err,result)=>{
            if(err){
                dbconn.destroy();
                res("error")
            }else{
                dbconn.destroy();
                res(result); 
            }
        });
    }); 
};

obj.searchUsers = function(searchTerm){
    return new Promise((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops); 
        dbconn.query(querybuilder.searchUsers(searchTerm), (err,result)=>{
            if(err){
                dbconn.destroy();
                res("error")
            }else{
                dbconn.destroy();
                res(result); 
            }
        });
    }); 
}

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

obj.updateProfile = function(username,updateObj){
    return new Promise ((res,rej) => {
        const dbconn = mysql.createConnection(dbprops); 
        dbconn.query(querybuilder.findAdditionalInfo(username), (err,result)=>{
            let query; 
            if(!err){
                if(result.length !== 0){
                    query = querybuilder.updateAdditonalInfo(username,updateObj); 
                }else{
                    query = querybuilder.insertAddionalInfo(username,updateObj); 
                }
                dbconn.query(query,(err,result)=>{
                    if(!err){
                        dbconn.destroy();
                        res("success"); 
                    }else{
                        console.log(err); 
                        dbconn.destroy();
                        res("error");
                    }
                }); 
            }else{
                console.log(err); 
                dbconn.destroy();
                res("error"); 
            }
        }); 
    }); 
}; 

obj.getAdditionalInfo = function(username){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops); 
        dbconn.query(querybuilder.findAdditionalInfo(username), (err,result)=>{
            if(!err){
                dbconn.destroy();
                res(result); 
            }else{
                dbconn.destroy();
                rej("error"); 
            }
        }); 
    }); 
}; 

obj.sendFriendRequest = function(from,to){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops);
        dbconn.query(querybuilder.findFriendRequests(from,to), (err,result)=>{
            if(err){
                dbconn.destroy();
                res("error"); 
            }else{
                if(result.length === 0){
                    dbconn.query(querybuilder.insertFriendRequest(from,to), (err,result)=>{
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
                    res("requested"); 
                }
            }
        }); 
    }); 
}; 

obj.getFriends = function(username){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops);
        dbconn.query(querybuilder.getFriends(username), (err,result)=>{
            if(err){
                dbconn.destroy();
                res("error"); 
                console.log(err);
            }else{
                dbconn.destroy();
                res(result); 
            }
        }); 
    }); 
};

obj.getPendingFriends = function(username){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops);
        dbconn.query(querybuilder.getPendingFriends(username), (err,result)=>{
            if(err){
                dbconn.destroy();
                res("error"); 
            }else{
                dbconn.destroy();
                res(result); 
            }
        }); 
    }); 
};

obj.addFriend = function(username, friend_username){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops);
        dbconn.query(querybuilder.addFriend(username,friend_username), (err,result)=>{
            if(err){
                dbconn.destroy();
                res("error");
            }else{
                dbconn.destroy();
                res("success"); 
            }
        });
    }); 
}; 

obj.deleteFriendRequest = function(username,friend_username){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops);
        dbconn.query(querybuilder.deleteFriendRequest(username,friend_username), (err,result)=>{
            if(err){
                dbconn.destroy();
                res("error");
            }else{
                dbconn.destroy();
                res("success"); 
            }
        });
    }); 
}; 

obj.deleteFriend = function(username,friend_username){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops);
        dbconn.query(querybuilder.deleteFriend(username,friend_username), (err,result)=>{
            if(err){
                dbconn.destroy();
                res("error");
            }else{
                dbconn.destroy();
                res("success"); 
            }
        });
    }); 
}; 

obj.createPost = function(username,postText){
    return new Promise ((res,rej)=>{
        const dbconn = mysql.createConnection(dbprops);
        dbconn.query(querybuilder.createPost(username,postText),(err,result)=>{
            if(err){
                dbconn.destroy();
                res("error");
            }else{
                dbconn.destroy();
                res("success"); 
            }
        }); 
    }); 
}; 

module.exports = obj; 