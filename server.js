"use strict"; 
const express = require("express"), 
    app = express(), 
    bodyParser = require("body-parser"), 
    http = require("http").Server(app),
    socketIo = require("socket.io")(http); 
app.use(express.static("resources"));

app.set("view engine","pug");//sets view engine  
app.set("views", "./views");  //tells view engine where to look for templates 

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); 

app.get("/",(req,res)=>{
    res.render("login.pug"); 
}); 

app.post("/login-attempt",(req,res)=>{
    console.log(req.body); 
    res.send("success"); 
}); 

socketIo.on("connection",(socket)=>{
    socket.on("message",(msg)=>{
        socketIo.emit("message",msg); 
    });
});


http.listen(3000,()=>{
    console.log("Listening on port 3000");
}); 