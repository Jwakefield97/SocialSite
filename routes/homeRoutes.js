const express = require("express"),
      route = express.Router(); 
      
let authentication = function(req,res,next){
    if(req.session.username){
        req.session.touch(); 
        next(); 
    }else{
        res.redirect('/');
    }
}
route.use(authentication); 

//default route for home -- /home 
route.get("/",(req,res)=>{
    res.render("home.pug"); 
}); 


module.exports = route; 