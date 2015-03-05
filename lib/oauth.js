function init(json) {
    client_id = json.client_id
    type = json.type
    callback_function = json.callback_function
}

function login() {
   var loginUrl="https://api.imgur.com/oauth2/authorize?client_id=" + client_id + "&response_type=" + type + "&state=okay"
      
   imgurLoginWindow=window.open(loginUrl, "LoginWindow", "location=1, scrollbars=1,"+
      "width="+500+",height="+300);
}