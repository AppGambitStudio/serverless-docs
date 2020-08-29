
/*
This is a logging method that will be used throught the application
*/

window.logMessage = (message, color, loginLogs = false) => {
    if(!loginLogs) $('#log').append(`<span style='color: ${color}'>${message}</span></br>`);
    else $('#log-login').html(`<span style='color: ${color}'>${message}</span></br>`);
}



window.bytesToSize = (bytes) => {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

var dropdown = document.querySelector('.dropdown');
dropdown.addEventListener('click', function (event) {
    event.stopPropagation();
    dropdown.classList.toggle('is-active');
});

window.storeSession = (authenticationResult) => {
    currentSession.IdToken = authenticationResult.IdToken || authenticationResult.id_token
    currentSession.AccessToken = authenticationResult.AccessToken || authenticationResult.access_token
    currentSession.RefreshToken = authenticationResult.RefreshToken || authenticationResult.refresh_token || null
    sessionStorage.setItem('currentSession', JSON.stringify(currentSession))
    idTokenPayLoad = parseJwt(currentSession.IdToken)
}