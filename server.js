"use strict"; 
const express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    http = require("http").Server(app),
    socketIo = require("socket.io")(http),
    dao = require("./modules/dao.js"), 
    querybuilder = require("./modules/querybuilder.js"),
    homeRoutes = require("./routes/homeRoutes.js"),
	expressSession = require("express-session"); //used for logins and sessions;   

app.use(express.static("resources"));

app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 


app.use(expressSession({ secret: 'this-is-a-secret-token', cookie: { maxAge: 600000 }}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.use("/home", homeRoutes); 

app.get("/",(req,res)=>{
    if(req.session.username){
        res.redirect("/home"); 
    }else{
        res.render("login.pug"); 
    }
}); 

app.get('/logout', (req,res)=>{
    req.session.destroy(); 
    res.redirect("/"); 
});    

app.get("/sign-up",(req,res)=>{
    res.render("signup.pug"); 
}); 

app.post("/sign-up-attempt", (req,res)=>{
    dao.signUpAttempt(req.body).then(result =>{
        res.send(result); 
    }).catch(err=>{
        console.log(err); 
    }); 
});

app.post("/login-attempt",(req,res)=>{
    dao.signInAttempt(req.body).then(result =>{
        if(result[0] === "success"){
            req.session.username = result[1]; //set session id
            res.send(result[0]); //return success string to browser
        }else{
            res.send(result); 
        }
    }).catch(err=>{
        console.log(err); 
    });
}); 

socketIo.on("connection",(socket)=>{
    socket.on("message",(msg)=>{
        socketIo.emit("message",msg); 
    });
});


http.listen(3000,()=>{
    console.log("Listening on port 3000");
}); 