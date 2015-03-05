function redirect_init() {
    // First, parse the query string
    var params = {}, queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    console.log(params)
    localStorage.setItem('accessToken', params['access_token']);

    if (params['error']){ 
        console.log(params['error'])
    }
    else {
        window.opener.callback_function()
    }
    window.close()
}