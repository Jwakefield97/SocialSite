"use strict"; 
$(document).ready(()=>{
    $("#imageLink").change(evt=>{
        $("#profileImage").attr("src",$("#imageLink").val().trim()); 
    }); 
    
    $.ajax({url: "/home/getAdditionalInfo", success: (result)=>{
        if(result !== "error"){
            $("#bio").val(result.bio);
            $("#email").val(result.email);
            $("#phoneNumber").val(result.phone_number); 
            $("#profileImage").attr("src",result.profileImage); 
            $("#imageLink").val(result.profileImage); 
        }else{
            $("#errorMessages").text("There was an error getting your profile information."); 
            $("#errorMessages").removeClass("hide"); 
            setTimeout(()=>{
                $("#errorMessages").addClass("hide"); 
            },10000);
        }
    }});
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