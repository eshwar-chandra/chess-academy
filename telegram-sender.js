//bot token
var telegram_bot_id = "5483364145:AAH1wQaF39YVmrvMrgFATSaax58dsZB5x1Y";
//chat id
var chat_id = 743640880;
var u_name, email, phone, details, message;
var ready = function () {
    u_name = document.getElementById("name").value;
    email = document.getElementById("email").value;
    phone = document.getElementById("phone").value;
    details = document.getElementById("details").value;
    message = "Name: " + u_name + "\nEmail: " + email + "\nphone: " + phone + "\nStudent Details" + details;
};
var sender = function () {
    ready();
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://api.telegram.org/bot" + telegram_bot_id + "/sendMessage",
        "method": "POST",
        "headers": {
            "Content-Type": "application/json",
            "cache-control": "no-cache"
        },
        "data": JSON.stringify({
            "chat_id": chat_id,
            "text": message
        })
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
    document.getElementById("details").value = "";
    alert("Our team will get in touch with You. \nThank You")
    return false;
};