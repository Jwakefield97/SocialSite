const express = require("express"),
      route = express.Router(),
      dao = require("../modules/dao.js"),
      fileUpload = require('express-fileupload'); 
      
let authentication = function(req,res,next){
    if(req.session.username){
        req.session.touch(); 
        next(); 
    }else{
        res.redirect('/');
    }
}
route.use(authentication);  
//route.use(fileUpload()); 

//default route for home -- /home 
route.get("/",(req,res)=>{
    res.render("home.pug"); 
}); 

route.get("/searchUsers",(req,res)=>{
    let params = req.query;
    dao.searchUsers(params.searchTerm).then(result=>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    }); 
}); 

route.get("/getUserProfiles",(req,res)=>{
    let params = req.query;  
    dao.findUsers(params.userIndex,params.numUsers).then(result=>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    }); 
}); 

route.get("/getAdditionalInfo",(req,res)=>{
    dao.getAdditionalInfo(req.session.username).then(result=>{
        res.json(result[0]); 
    }).catch(err=>{
        res.send("error"); 
    }); 
}); 

route.post("/updateProfile",(req,res)=>{
    dao.updateProfile(req.session.username,req.body).then(result=>{
        res.send(result);  
    }).catch(err=>{
        console.log(err); 
    });  
}); 

route.get("/sendFriendRequest",(req,res)=>{
    let params = req.query; 
    dao.sendFriendRequest(req.session.username,params.friendTo).then(result=>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    });
}); 

route.get("/getFriends",(req,res)=>{
    dao.getFriends(req.session.username).then(result=>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    }); 
}); 

route.get("/getPendingFriends",(req,res)=>{
    dao.getPendingFriends(req.session.username).then(result=>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    }); 
}); 

route.get("/addFriend",(req,res)=>{  //add friend then delete the friend request from friend_pending 
    let params = req.query; 
    dao.addFriend(req.session.username, params.friend_username).then(result=>{
        if(result === "success"){
            dao.deleteFriendRequest(req.session.username, params.friend_username).then(result=>{
                res.send(result); 
            }).catch(err=>{
                console.log(err); 
            });
        }else{
            res.send("error"); 
        } 
    }).catch(err=>{
        console.log(err); 
    }); 
});

route.get("/deleteFriendRequest",(req,res)=>{
    let params = req.query; 
    dao.deleteFriendRequest(req.session.username, params.friend_username).then(result=>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    }); 
});

route.get("/deleteFriend",(req,res)=>{
    let params = req.query; 
    dao.deleteFriend(req.session.username, params.friend_username).then(result=>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    }); 
});

route.post("/createPost",(req,res)=>{
    dao.createPost(req.session.username, req.body.post_text).then(result=>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    })
}); 

route.get("/getPosts",(req,res)=>{
    
}); 

module.exports = route; 