"use strict"; 
let userCount = 0, //how many users are currently on the page
    userAmount = 15, //amount of user to return 
    defaultUserImage = "/profile_images/defaultProfileImage.png"; 


let loadUsers = function(){
    $.ajax({type: "GET",url: "/home/getUserProfiles", data: {userIndex: userCount, numUsers: userAmount}, success: (result)=>{
        if(result !== "error"){
            createUserTable(result,userCount === 0); 
        }else{
            console.log("error while getting user info"); 
        }
        userCount += userAmount; 
    }}); 
}; 

let createUserTable = function(users,isNewTable){
    let oldTable = $("#userTable"),
        newTable = document.createElement("tbody"); 
    newTable.id = "userTable"; 
    if(isNewTable){ //create table 
        users.forEach(user=>{
            let rowNode = document.createElement("tr"),
                picNode = document.createElement("td"),
                imgNode = document.createElement("img"), 
                userNameNode = document.createElement("td"),
                firstNameNode = document.createElement("td"),
                lastNameNode = document.createElement("td"); 
            rowNode.setAttribute("scope","row");
            if(user.profileImage === null || user.profileImage === "null"){
                imgNode.setAttribute("src",defaultUserImage); 
            }else{
                imgNode.setAttribute("src",user.profileImage); 
            }
            imgNode.setAttribute("alt","profile pic");
            imgNode.classList.add("img-rounded"); 
            imgNode.classList.add("img-thumbnail"); 
            imgNode.setAttribute("height","50");
            imgNode.setAttribute("width","50");

            userNameNode.innerText = user.username; 
            firstNameNode.innerText = user.FirstName; 
            lastNameNode.innerText = user.LastName; 
            picNode.appendChild(imgNode); 
            rowNode.appendChild(picNode); 
            rowNode.appendChild(userNameNode);
            rowNode.appendChild(firstNameNode);
            rowNode.appendChild(lastNameNode);
            newTable.appendChild(rowNode); 
        });
        oldTable.replaceWith(newTable);  
    }else{ // append to table 
        users.forEach(user=>{
            let rowNode = document.createElement("tr"),
                picNode = document.createElement("td"),
                imgNode = document.createElement("img"), 
                userNameNode = document.createElement("td"),
                firstNameNode = document.createElement("td"),
                lastNameNode = document.createElement("td"); 
            rowNode.setAttribute("scope","row");
            if(user.profileImage === null || user.profileImage === "null"){
                imgNode.setAttribute("src",defaultUserImage); 
            }else{
                imgNode.setAttribute("src",user.profileImage); 
            }
            imgNode.setAttribute("alt","profile pic");
            imgNode.classList.add("img-rounded"); 
            imgNode.classList.add("img-thumbnail"); 
            imgNode.setAttribute("height","50");
            imgNode.setAttribute("width","50");

            userNameNode.innerText = user.username; 
            firstNameNode.innerText = user.FirstName; 
            lastNameNode.innerText = user.LastName; 
            picNode.appendChild(imgNode); 
            rowNode.appendChild(picNode); 
            rowNode.appendChild(userNameNode);
            rowNode.appendChild(firstNameNode);
            rowNode.appendChild(lastNameNode);
            oldTable.append(rowNode); 
        });
    }
}; 

let searchUserTable = function(){
    userCount = 0;
    userAmount = 15;
    if($("#searchSiteBar").val().toString().trim() !== ""){
        $.ajax({url: "/home/searchUsers", data: {searchTerm: $("#searchSiteBar").val().toString().trim()}, success: (result)=>{
            if(result !== "error"){
                console.log(result);
                createUserTable(result,true); 
            }else{  
                console.log("there was an error"); 
            }
        }});
    }else{
        loadUsers(); 
    }
}; 

$(document).ready(()=>{
    $("#imageLink").change(evt=>{
        $("#profileImage").attr("src",$("#imageLink").val().trim()); 
    }); 

    loadUsers(); //load inital 25 users for searching 

    $.ajax({url: "/home/getAdditionalInfo", success: (result)=>{
        if(result !== "error"){
            $("#bio").val(result.bio === "null" ? "": result.bio);
            $("#email").val(result.email === "null" ? "": result.email);
            $("#phoneNumber").val(result.phone_number === null ? "": result.phone_number); 
            $("#profileImage").attr("src",result.profileImage === "null" ? defaultUserImage: result.profileImage); 
            $("#imageLink").val(result.profileImage === "null" ? "": result.profileImage); 
        }else{
            $("#errorMessages").text("There was an error getting your profile information."); 
            $("#errorMessages").removeClass("hide"); 
            setTimeout(()=>{
                $("#errorMessages").addClass("hide"); 
            },10000);
        }
    }});

    $("#loadMoreUsers").click(evt=>{
        loadUsers();
    }); 

    $("#searchSiteButton").click(evt=>{ //search on click of search button 
        searchUserTable();
    }); 

    $("#searchSiteBar").keypress(evt =>{ //search on enter key 
        if(evt.key === "Enter"){
            searchUserTable();
        }
    }); 

    $("#saveChanges").click(evt=>{
        //check these for validity and sanitize 
        let updateObj = {
            bio: $("#bio").val().trim(),
            email: $("#email").val().trim(),
            phoneNumber: $("#phoneNumber").val().trim(),
            profileImage: $("#imageLink").val().trim()
        }; 
        $.ajax({type:"POST",method: "POST", url:"/home/updateProfile", data: updateObj, success: (res)=>{
            if(res === "success"){
                $("#successMessages").text("Your profile was update successfully!"); 
                $("#successMessages").removeClass("hide"); 
                setTimeout(()=>{
                    $("#successMessages").addClass("hide"); 
                },10000); 
            }else{
                $("#errorMessages").text("There was an error updating your profile."); 
                $("#errorMessages").removeClass("hide"); 
                setTimeout(()=>{
                    $("#errorMessages").addClass("hide"); 
                },10000); 
            } 
        }}); 
    }); 

}); 