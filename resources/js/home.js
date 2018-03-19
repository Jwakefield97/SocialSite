"use strict"; 
let userCount = 0, //how many users are currently on the page
    userAmount = 15, //amount of user to return 
    defaultUserImage = "/profile_images/defaultProfileImage.png",
    usersList = [],
    friendsList = [],
    friendsPendingList = []; 
let formatDate = function(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
};

let setMessage = function(type,msg){
    if(type === "error"){
        $("#errorMessages").text(msg); 
        $("#errorMessages").removeClass("hide"); 
        setTimeout(()=>{
            $("#errorMessages").addClass("hide"); 
        },10000);
    }else if (type === "success"){
        $("#successMessages").text(msg); 
        $("#successMessages").removeClass("hide"); 
        setTimeout(()=>{
            $("#successMessages").addClass("hide"); 
        },10000);
    }else if (type === "info"){
        $("#infoMessages").text(msg); 
        $("#infoMessages").removeClass("hide"); 
        setTimeout(()=>{
            $("#infoMessages").addClass("hide"); 
        },10000);
    }; 
}; 

let removeFriendFromList = function(username){
    friendsList = friendsList.slice(friendsList.indexOf(findUserObj(friendsList,username)),-1); 
}; 

let removeFriendFromPendingList = function(username){
    friendsPendingList = friendsPendingList.slice(friendsPendingList.indexOf(findUserObj(friendsPendingList,username)),-1); 
}; 

let findUserObj = function(listObj,username){
    let result; 
    listObj.forEach(item=>{
        if(item.Username === username){
            result = item; 
        }
    }); 
    return result; 
};  

let getUsers = function(){
    $.ajax({type: "GET",url: "/home/getUserProfiles", data: {userIndex: userCount, numUsers: userAmount}, success: (result)=>{
        if(result !== "error"){
            createUserTable(result,userCount === 0,"userTable"); 
            usersList = result; 
        }else{
            setMessage("error", "An error occured while getting user info."); 
        }
        userCount += userAmount; 
    }}); 
}; 

let createUserTable = function(users,isNewTable,tableId){
    let oldTable = $(`#${tableId}`),
        newTable = document.createElement("tbody"); 
    newTable.id = tableId; 

    if(tableId === "userTable"){      //hide the friend request button if on friends table 
        $("#sendFriendRequest").show(); 
    }else{
        $("#sendFriendRequest").hide(); 
    }

    if(isNewTable){ //create table 
        users.forEach(user=>{
            let rowNode = document.createElement("tr"),
                picNode = document.createElement("td"),
                imgNode = document.createElement("img"), 
                userNameNode = document.createElement("td"),
                userNameText = document.createElement("div"), 
                userNameLink = document.createElement("a"), 
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

            userNameLink.setAttribute("href",`#${user.Username}`.toString());
            userNameLink.setAttribute("id",user.Username); 
            userNameText.innerText = user.Username; 
            userNameLink.addEventListener("click",evt=>{
                evt.preventDefault();
                setUserModal(evt.target.innerText,tableId); 
                $("#inspectUser").modal("show");
            }); 

            firstNameNode.innerText = user.FirstName; 
            lastNameNode.innerText = user.LastName; 
            userNameLink.appendChild(userNameText); 
            userNameNode.appendChild(userNameLink); 
            picNode.appendChild(imgNode); 
            rowNode.appendChild(picNode); 
            rowNode.appendChild(userNameNode);
            rowNode.appendChild(firstNameNode);
            rowNode.appendChild(lastNameNode);
            if(tableId === "friendsTable"){
                let removeNode = document.createElement("button"),
                    removeColumn = document.createElement("td"); 
                removeNode.setAttribute("class","btn btn-danger"); 
                removeNode.setAttribute("type","button"); 
                removeNode.setAttribute("id",user.Username); 
                removeNode.innerText="Remove"; 
                removeNode.addEventListener("click",evt=>{
                    deleteFriend(evt.target.id); 
                }); 
                removeColumn.appendChild(removeNode); 
                removeColumn.setAttribute("class","text-right");
                rowNode.appendChild(removeColumn); 
            }
            newTable.appendChild(rowNode); 
        });
        oldTable.replaceWith(newTable);  
    }else{ // append to table 
        users.forEach(user=>{
            let rowNode = document.createElement("tr"),
                picNode = document.createElement("td"),
                imgNode = document.createElement("img"), 
                userNameNode = document.createElement("td"),
                userNameText = document.createElement("div"), 
                userNameLink = document.createElement("a"), 
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

            userNameLink.setAttribute("href",`#${user.Username}`.toString());
            userNameLink.setAttribute("id",user.Username); 
            userNameText.innerText = user.Username; 
            userNameLink.addEventListener("click",evt=>{
                evt.preventDefault();
                setUserModal(evt.target.innerText,tableId); 
                $("#inspectUser").modal("show");
            }); 

            firstNameNode.innerText = user.FirstName; 
            lastNameNode.innerText = user.LastName; 
            userNameLink.appendChild(userNameText); 
            userNameNode.appendChild(userNameLink); 
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
                createUserTable(result,true,"userTable"); 
                usersList = result;
            }else{  
                setMessage("error","There was an error while searching for users."); 
            }
        }});
    }else{
        getUsers(); 
    }
}; 

let setUserModal = function(username,fromTable){
    if(fromTable === "userTable"){
        usersList.forEach(user=>{
            if(user.Username === username){
                if(user.profileImage !== null && user.profileImage !== "null"){
                    $("#inspectProfileImage").attr("src",user.profileImage); 
                }
                $("#inspectUsername").text(user.Username);
                $("#inspectFirstName").text(user.FirstName);
                $("#inspectLastName").text(user.LastName);
                $("#inspectBio").text(user.bio);
                $("#inspectEmail").text(user.email);
                $("#inspectPhoneNumber").text(user.phone_number);
            }
        }); 

    }else if (fromTable === "friendsTable"){
        friendsList.forEach(friend=>{
            if(friend.Username === username){
                if(friend.profileImage !== null && friend.profileImage !== "null"){
                    $("#inspectProfileImage").attr("src",friend.profileImage); 
                }
                $("#inspectUsername").text(friend.Username);
                $("#inspectFirstName").text(friend.FirstName);
                $("#inspectLastName").text(friend.LastName);
                $("#inspectBio").text(friend.bio);
                $("#inspectEmail").text(friend.email);
                $("#inspectPhoneNumber").text(friend.phone_number);
            }
        }); 
    }else if(fromTable === "friendsPendingTable"){
        friendsPendingList.forEach(friend=>{
            if(friend.Username === username){
                if(friend.profileImage !== null && friend.profileImage !== "null"){
                    $("#inspectProfileImage").attr("src",friend.profileImage); 
                }
                $("#inspectUsername").text(friend.Username);
                $("#inspectFirstName").text(friend.FirstName);
                $("#inspectLastName").text(friend.LastName);
                $("#inspectBio").text(friend.bio);
                $("#inspectEmail").text(friend.email);
                $("#inspectPhoneNumber").text(friend.phone_number);
            }
        }); 
    }
}; 

let getAdditonalInfo = function(){
    $.ajax({url: "/home/getAdditionalInfo", success: (result)=>{
        if(result !== "error"){
            $("#bio").val(result.bio === "null" ? "": result.bio);
            $("#email").val(result.email === "null" ? "": result.email);
            $("#phoneNumber").val(result.phone_number === null ? "": result.phone_number); 
            $("#profileImage").attr("src",result.profileImage === "null" ? defaultUserImage: result.profileImage); 
            $("#imageLink").val(result.profileImage === "null" ? "": result.profileImage); 
        }else{
            setMessage("error","There was an error getting your profile information.");
        }
    }});
}; 

let sendFriendRequest = function(username){
    $("#inspectUser").modal("hide");
    $.ajax({url: "/home/sendFriendRequest", data: {friendTo: username},  success: (result)=>{
        if(result === "error"){
            setMessage("error","There was an error sending friend request."); 
        }else if(result === "requested"){
            setMessage("error", "This friend has already been requested.");
        }else{
            setMessage("success","Friend request was sent successfully!");
        }
    }});
};

let createPendingRequestTable = function(pending){
    let oldTable = $("#friendsPendingTable"),
        newTable = document.createElement("tbody"); 
    newTable.id = "friendsPendingTable"; 
    pending.forEach(request=>{
        let rowNode = document.createElement("tr"),
        picNode = document.createElement("td"),
        imgNode = document.createElement("img"), 
        userNameNode = document.createElement("td"),
        userNameText = document.createElement("div"), 
        userNameLink = document.createElement("a"), 
        statusNode = document.createElement("td"),
        acceptNode = document.createElement("button"),
        rejectNode = document.createElement("button"); 
        rowNode.setAttribute("scope","row");
        if(request.profileImage === null || request.profileImage === "null"){
            imgNode.setAttribute("src",defaultUserImage); 
        }else{
            imgNode.setAttribute("src",request.profileImage); 
        }
        imgNode.setAttribute("alt","profile pic");
        imgNode.classList.add("img-rounded"); 
        imgNode.classList.add("img-thumbnail"); 
        imgNode.setAttribute("height","50");
        imgNode.setAttribute("width","50");

        userNameLink.setAttribute("href",`#${request.Username}`.toString());
        userNameLink.setAttribute("id",request.Username); 
        userNameText.innerText = request.Username; 
        userNameLink.addEventListener("click",evt=>{
            evt.preventDefault();
            setUserModal(evt.target.innerText,"friendsPendingTable"); 
            $("#inspectUser").modal("show");
        }); 

        acceptNode.setAttribute("class","btn btn-primary"); 
        acceptNode.setAttribute("type","button"); 
        acceptNode.setAttribute("id",request.Username); 
        acceptNode.innerText="Accept"; 
        acceptNode.addEventListener("click",evt=>{
            acceptFriendRequest(evt.target.id); 
        }); 

        rejectNode.setAttribute("class","btn btn-danger"); 
        rejectNode.setAttribute("type","button"); 
        rejectNode.setAttribute("id",request.Username);
        rejectNode.innerText="Reject";
        rejectNode.addEventListener("click",evt=>{
            rejectFriendRequest(evt.target.id); 
        }); 

        statusNode.setAttribute("class","text-right");

        statusNode.appendChild(acceptNode);
        statusNode.appendChild(rejectNode);
        userNameLink.appendChild(userNameText); 
        userNameNode.appendChild(userNameLink); 
        picNode.appendChild(imgNode); 
        rowNode.appendChild(picNode); 
        rowNode.appendChild(userNameNode);
        rowNode.appendChild(statusNode);
        newTable.appendChild(rowNode); 
    }); 
    oldTable.replaceWith(newTable);
}; 

let getPendingRequests = function(){
    $.ajax({type: "GET",url: "/home/getPendingFriends", success: (result)=>{
        if(result !== "error"){  
            friendsPendingList = result;
            createPendingRequestTable(result);  
        }else{
            setMessage("error","error while getting pending friend requests."); 
        }
        userCount += userAmount; 
    }}); 
}; 

let getFriends = function(){
    $.ajax({type: "GET",url: "/home/getFriends", success: (result)=>{
        if(result !== "error"){
            createUserTable(result,true,"friendsTable"); 
            friendsList = result; 
        }else{
            setMessage("error","error while getting friends list."); 
        }
        userCount += userAmount; 
    }}); 
}; 

let acceptFriendRequest = function(username){
    $.ajax({type: "GET",url: "/home/addFriend", data: {friend_username: username}, success: (result)=>{
        if(result !== "error"){
            setMessage("success",`You are now friends with ${username}!`); 
            //remove the user from pending. add to friends and redraw both tables. 
            friendsList.push(findUserObj(friendsPendingList,username)); 
            removeFriendFromPendingList(username);
            createUserTable(friendsList,true,"friendsTable"); 
            createPendingRequestTable(friendsPendingList);

        }else{
            setMessage("error",`There was an error accepting the friend request from ${username}`); 
        }
    }}); 
}; 

let rejectFriendRequest = function(username){
    $.ajax({type: "GET",url: "/home/deleteFriendRequest", data: {friend_username: username}, success: (result)=>{
        if(result !== "error"){
            setMessage("success",`The friend request from ${username} was deleted!`);
            removeFriendFromPendingList(username); 
            createPendingRequestTable(friendsPendingList);
        }else{
            setMessage("error",`There was an error deleting the friend request from ${username}`); 
        }
    }});  
}; 

let createPostsList = function(posts){
    let oldList = $("#postList"),
        newList = document.createElement("ul"); 
    newList.id = "postList"; 
    newList.setAttribute("class","mx-0 px-0"); 
    posts.forEach(item=>{
        let li = document.createElement("li"),
            card = document.createElement("div"),
            header = document.createElement("div"),
            headerImg = document.createElement("img"),
            body = document.createElement("div"),
            bodyP = document.createElement("p"),
            footer = document.createElement("div"),
            footerD = document.createElement("div"); 

            card.setAttribute("class","card");
            card.setAttribute("style","box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);");
            header.setAttribute("class","header")
            headerImg.setAttribute("class","img-thumbnail img-rounded float-left"); 
            headerImg.setAttribute("height","100");
            headerImg.setAttribute("width","100"); 
            headerImg.setAttribute("alt","profile image"); 
            headerImg.setAttribute("data-toggle","tooltip"); 
            headerImg.setAttribute("data-placement","top");
            headerImg.setAttribute("title",item.poster_username); 
            if(item.profileImage === null || item.profileImage === "null"){
                headerImg.setAttribute("src",defaultUserImage); 
            }else{
                headerImg.setAttribute("src",item.profileImage); 
            }
            body.setAttribute("class", "card-body"); 
            bodyP.setAttribute("class","card-text");
            bodyP.innerText = item.post_text;
            footer.setAttribute("class","card-footer text-muted"); 
            footerD.setAttribute("class","card-text");
            footerD.setAttribute("class","card-text");
            footerD.innerText = `Date: ${formatDate(new Date(item.time_created))}`;
            li.setAttribute("class","mb-5");

            header.appendChild(headerImg);
            body.appendChild(bodyP); 
            footer.appendChild(footerD); 
            card.appendChild(header);
            card.appendChild(body);
            card.appendChild(footer); 
            li.appendChild(card)
            newList.appendChild(li); 
    }); 
    oldList.replaceWith(newList); 
}; 

let getPosts = function(){
    $.ajax({type: "GET",url: "/home/getPosts", success: (result)=>{
        if(result !== "error"){ 
            createPostsList(result); 
        }else{
            setMessage("error",`An error occurred while retrieving posts.`); 
        }
    }});
}; 

let deleteFriend = function(username){
    $.ajax({type: "GET",url: "/home/deleteFriend", data: {friend_username: username}, success: (result)=>{
        if(result !== "error"){
            setMessage("success",`${username} was removed from your friends list!`); 
            removeFriendFromList(username); 
            createUserTable(friendsList,true,"friendsTable"); 
        }else{
            setMessage("error",`There was an error removing ${username} from your friends list.`); 
        }
    }});  
};

$(document).ready(()=>{

    //add swipe to mobile
    let htmlTag = document.getElementsByTagName("html")[0],
        clientX,
        lastTab = "pills-feed-tab";
    htmlTag.addEventListener('touchstart', function(e){
        //check to make sure client isn't scrolling on table
        let node = (e.target.nodeName).toLowerCase();
        if(node !== "tbody" && node !== "thead" && node !== "table" && node !== "td" && node !== "tr" && node !== "img" && node !== "a"){
            clientX = e.touches[0].clientX;
        }
    }, false);

    htmlTag.addEventListener('touchend', e => {
        let deltaX = e.changedTouches[0].clientX - clientX,
            threshHold = 65;
        let node = (e.target.nodeName).toLowerCase();
        if(node !== "tbody" && node !== "thead" && node !== "table" && node !== "td" && node !== "tr" && node !== "img" && node !== "a"){
            if(deltaX < 0){ //swiped right 
                if(Math.abs(deltaX) > threshHold){
                    if(lastTab === "pills-feed-tab"){
                        lastTab = "pills-search-tab"; 
                        $("#pills-search-tab").click();
                    }else if(lastTab === "pills-search-tab"){
                        lastTab = "pills-friends-tab"; 
                        $("#pills-friends-tab").click();
                    }else if(lastTab === "pills-friends-tab"){
                        lastTab = "pills-profile-tab"; 
                        $("#pills-profile-tab").click();
                    }else if(lastTab === "pills-profile-tab"){
                        lastTab = "pills-profile-tab"; 
                        $("#pills-profile-tab").click(); 
                    }
                }
            }else{
                if(Math.abs(deltaX) > threshHold){
                    if(lastTab === "pills-profile-tab"){
                        lastTab = "pills-friends-tab"; 
                        $("#pills-friends-tab").click();
                    }else if(lastTab === "pills-friends-tab"){
                        lastTab = "pills-search-tab"; 
                        $("#pills-search-tab").click();
                    }else if(lastTab === "pills-search-tab"){
                        lastTab = "pills-feed-tab"; 
                        $("#pills-feed-tab").click();
                    }else if(lastTab === "pills-feed-tab"){
                        lastTab = "pills-feed-tab"; 
                        $("#pills-feed-tab").click(); 
                    }
                }
            }
        } 
        clientX = 0; 
    }, false);
    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    if(window.mobilecheck() || $(window).width() < 550){
        $("#usersFullTable").addClass("table-responsive"); 
        $("#friendsPendingFullTable").addClass("table-responsive"); 
        $("#friendsFullTable").addClass("table-responsive"); 
    }
    $(window).resize(evt=>{
        if(window.mobilecheck() || $(window).width() < 550){
            $("#usersFullTable").addClass("table-responsive"); 
            $("#friendsPendingFullTable").addClass("table-responsive"); 
            $("#friendsFullTable").addClass("table-responsive"); 
        }else{
            $("#usersFullTable").removeClass("table-responsive"); 
            $("#friendsPendingFullTable").removeClass("table-responsive"); 
            $("#friendsFullTable").removeClass("table-responsive");
        }
    }); 

    //TODO: seperate js into different files based on tabs 
    getPosts(); 
    $('[data-toggle="tooltip"]').tooltip(); 
    //--------------posts tab------------------
    $("#createPost").click(evt=>{
        $("#modalPostText").val(""); 
        $("#createPostModal").modal("show"); 
    }); 

    $("#pills-feed-tab").click(evt=>{
        lastTab="pills-feed-tab"; 
        getPosts(); 
    }); 

    $("#createPostModalButton").click(evt=>{
        $("#createPostModal").modal("hide"); 
        let postText = $("#modalPostText").val().trim(); 
        if(postText.length !== 0 || postText.length !== 2000){
            $.ajax({type: "POST",url: "/home/createPost", data: {post_text: postText}, success: (result)=>{
                if(result !== "error"){
                    //TODO: add post to feed
                    getPosts();
                    setMessage("success","post was created successfully!"); 
                }else{
                    setMessage("error",`An error occurred while creating post.`); 
                }
            }}); 
        }
    }); 

    //------------friends tab-------------------
    $("#pills-friends-tab").click(evt=>{
        lastTab="pills-friends-tab"; 
        getPendingRequests(); 
        getFriends(); 
    }); 
    
    //-------------search tab -------------------
    $("#pills-search-tab").click(evt=>{//load users when tab is clicked
        lastTab="pills-search-tab"; 
        userCount = 0;
        userAmount = 15;
        getUsers();
    });
    
    $("#loadMoreUsers").click(evt=>{ 
        getUsers();
    }); 
    
    $("#searchSiteButton").click(evt=>{ //search on click of search button 
        searchUserTable();
    }); 
    
    $("#searchSiteBar").keypress(evt =>{ //search on enter key 
        if(evt.key === "Enter"){
            searchUserTable();
        }
    });   
    
    $("#sendFriendRequest").click(evt=>{
        sendFriendRequest($("#inspectUsername").text()); 
    }); 
    
    
    //----------------profile tab-------------------
    $("#pills-profile-tab").click(evt=>{
        lastTab="pills-profile-tab"; 
        getAdditonalInfo();
    });
    $("#imageLink").change(evt=>{
        $("#profileImage").attr("src",$("#imageLink").val().trim()); 
    }); 
    $("#saveChanges").click(evt=>{  //save profile changes 
        //check these for validity and sanitize 
        let updateObj = {
            bio: $("#bio").val().trim(),
            email: $("#email").val().trim(),
            phoneNumber: $("#phoneNumber").val().trim(),
            profileImage: $("#imageLink").val().trim()
        }; 
        $.ajax({type:"POST",method: "POST", url:"/home/updateProfile", data: updateObj, success: (res)=>{
            if(res === "success"){
                setMessage("success","Your profile was update successfully!"); 
            }else{
                setMessage("error","There was an error updating your profile."); 
            } 
        }}); 
    }); 

}); 