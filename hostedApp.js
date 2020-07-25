//=============== AWS Cognito IDs ===============
const clientId = '';
const region = '';
const apiGatewzayHost = ''
const lambdaEndpoint = ''
//==============================

//===============AWS Cognito Hosted Ui References==================
const domainName = ''
const loggedInRedirectUrl = ''
const loggedOutRedirectUrl = ''
//==========================================

var xmlHttp = new XMLHttpRequest();

const challengeUrls = {
    logIn: `${domainName}.auth.${region}.amazoncognito.com/login?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=${loggedInRedirectUrl}`,
    userInfo: `${domainName}.auth.${region}.amazoncognito.com/oauth2/userInfo`,
    logOut: `${domainName}.auth.${region}.amazoncognito.com/logout?client_id=${clientId}&logout_uri=${loggedOutRedirectUrl}`
}


var currentSession

getCurrentLoggedInSession()

function logOut() {
    sessionStorage.clear()
    window.location = challengeUrls.logOut
}

function clearLogs(){
    $('#log').empty();
}

function getUserInfo(){
    var response
    xmlHttp.onreadystatechange = function() {
        if(this.readyState == 4 && this.status == 200) {
            response = JSON.parse(xmlHttp.responseText)
            logMessage('User Information !', 'blue')
            logMessage(`Username:${response.username}`)
            logMessage(`Email:${response.email}`)
        }
    };
    xmlHttp.open( "GET", challengeUrls.userInfo, false );
    xmlHttp.setRequestHeader('Authorization', `Bearer ${currentSession.access_token}`)
    xmlHttp.send(); 
}

function getCurrentLoggedInSession(){
    $("#loader").show();
    try{
        if(!sessionStorage.currentSession) {
            var authCode = window.location.href.split('=')[1]
            window.history.pushState({}, document.title, loggedInRedirectUrl);
            var theUrl = `${apiGatewzayHost}/${lambdaEndpoint}?authCode=${authCode}&authType=code`
            xmlHttp.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                    sessionStorage.setItem('currentSession', xmlHttp.responseText)
                }
            };
            xmlHttp.open( "GET", theUrl, false );
            xmlHttp.setRequestHeader('host', apiGatewzayHost)
            xmlHttp.setRequestHeader('Date', new Date().toISOString()) 
            xmlHttp.send();
        }

        currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
        validateSession()
    }catch(e){
        logMessage(`${e.message}`, 'red');
    }
    $("#loader").hide();
}

function validateSession() {
    if(!currentSession) window.location = challengeUrls.logIn
    var id_token = parseJwt(currentSession.id_token)
    var expiry = new Date(id_token.exp * 1000)
    logMessage(`Session will end at ${expiry.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`)
    if(new Date().getTime() > expiry) {
        logMessage('Session Expired!')
        var theUrl = `${apiGatewzayHost}/${lambdaEndpoint}?refresh_token=${currentSession.refresh_token}&authType=refresh`
        xmlHttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200) {
                sessionStorage.setItem('currentSession', xmlHttp.responseText)
                currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
                logMessage('Session renewed!', 'blue')
            }
        };
        xmlHttp.open( "GET", theUrl, false );
        xmlHttp.setRequestHeader('host', apiGatewzayHost)
        xmlHttp.setRequestHeader('Date', new Date().toISOString()) 
        xmlHttp.send();
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function logMessage(message, color){
    $('#log').append(`<span style='color: ${color}'>${message}</span></br>`);
}