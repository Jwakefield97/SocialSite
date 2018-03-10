"use strict";
let socket = io(),
    username = document.getElementById("username-input"),
    messageBox = document.getElementById("message-box");
    
document.getElementById("submit-button").addEventListener("click", (evt)=>{
    if(messageBox.value){
        socket.emit("message",{username: username.value || "anonymous", msg: messageBox.value})
        messageBox.value = ""; 
    }
});

//listen for enter key when in text box
messageBox.addEventListener("keypress", (e)=>{
    let key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
        if(messageBox.value){
            socket.emit("message",{username: username.value || "anonymous", msg: messageBox.value})
            messageBox.value = ""; 
        }
    }
}); 

socket.on("message",(msg)=>{
    let messageWrapper = document.getElementById("message-wrapper"),
        divNode = document.createElement("div"),
        sender = "",  
        pNode = document.createElement("p"),
        spanNode = document.createElement("span"),
        now = new Date(); 

        divNode.classList.add("container"); 
        if(msg.username === username.value){
            divNode.classList.add("darker")
            sender = "Me"; 
        }else{
            sender = msg.username; 
        }
        pNode.innerText ="("+sender+"): "+msg.msg; 

        spanNode.innerText = now.getHours()+":"+now.getMinutes(); 
        spanNode.classList.add("time-right"); 

        divNode.appendChild(pNode); 
        divNode.appendChild(spanNode); 

        messageWrapper.appendChild(divNode); 
});