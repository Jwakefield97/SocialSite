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

module.exports = route; 