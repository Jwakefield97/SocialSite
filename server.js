"use strict"; 
const express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    http = require("http").Server(app),
    socketIo = require("socket.io")(http),
    mysql = require("mysql"),
    dbconn = mysql.createConnection({ //used to connect to db 
      host: "localhost",
      user: "hackathon",
      password: "hackathon",
      database: "hackathon"
    }),
    bcrypt = require("bcrypt"), // used for encryption 
    saltRounds = 10,//num of salting rounds
    querybuilder = require("./modules/querybuilder.js"),
    feedRoutes = require("./routes/feedRoutes.js"),
	expressSession = require("express-session"); //used for logins and sessions;   

app.use(express.static("resources"));

app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 


app.use(expressSession({ secret: 'this-is-a-secret-token', cookie: { maxAge: 600000 }}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.use("/home", feedRoutes); 

app.get("/",(req,res)=>{
    if(req.session.username){
        res.redirect("/home/feed"); 
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
    let attempt = req.body; 
    attempt.password = attempt.password.trim(); 
    bcrypt.hash(attempt.password, saltRounds, (err, hash)=> {
       if(!err){
            attempt.password = hash; 
            dbconn.query(querybuilder.findUser(attempt.username), (err,result)=>{
                if(err){
                    res.send("error");  
                    console.log(err); 
                }else{
                    if(result.length === 0){
                        dbconn.query(querybuilder.createUser(attempt), (err,result)=>{
                            if(err){
                                res.send("error");
                                console.log(err); 
                            }
                        }); 
                        res.send("success");
                    }else{
                        res.send("registered"); 
                    }
                }
            });   
       }else{
            res.send("error");
            console.log(err); 
       }
   });
});

app.post("/login-attempt",(req,res)=>{
    let attempt = req.body;  
    dbconn.query(querybuilder.findUser(attempt.username), (err,result)=>{
        if(result.length === 1){
            bcrypt.compare(attempt.password.toString().trim(), result[0].Password, function(err, check) { 
                if(err){
                    res.send("error"); 
                }else{
                    if(check === true){
                        req.session.username = result[0].Username; //set session id 
                        res.send("success"); 

                    }else{
                        res.send("wrong"); 
                    }
                }
            });
        }else{
            res.send("error"); 
        } 
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