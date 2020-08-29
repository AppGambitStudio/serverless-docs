var cognitoUser;
var idTokenPayLoad
var accessToken
var accessTokenPayLoad
var userPool;
var currentSession = JSON.parse(sessionStorage.getItem('currentSession')) || new Object()
var xmlHttp = new XMLHttpRequest();

var cidp;

function getCognitoIdentityServiceProvider(){
    if(cidp === undefined)
        cidp = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' })
    return cidp;
}

//Functions related with cognito-identity and cognito-idp
//all the functions on this file, use cognito-identity-service-provider.
//congnito identity js is removed

//check User session when page loads
function checkUserSession(){
    getCurrentLoggedInSession()
    .then((res) => {
        if(res.status){
            switchToLoggedInView();
            showUserName()
            checkUserGroup()
            listPublicFiles();
            listMyFiles();
            checkLoginProvider()
        }else{
            switchToLogInView();
            getAccessSecretKeys();
        }
    });
}

//registration related functions
//render register view
function register() {
    if((checkEmptyTextBoxes(['emailInput', 'confirmPasswordInput']) === false) && (!checkEmptyTextBoxes(['userNameInput', 'passwordInput'], false)) === false) {
        emptyTextBoxes(registerViewTextBoxes)
    }
    switchToRegisterView();
    if (checkEmptyTextBoxes(['emailInput', 'userNameInput', 'passwordInput', 'confirmPasswordInput'], false) === false) {
        logMessage('Please fill all the fields!', 'red', true);
    } else {
        if (validatePassowrds(['passwordInput', 'confirmPasswordInput'])) {
            let { emailInputValue, userNameInputValue, passwordInputValue } = fetchTextBoxValues(['emailInput', 'userNameInput', 'passwordInput'])
            registerUser(emailInputValue, userNameInputValue, passwordInputValue);
        } else {
            emptyTextBoxes([confirmPasswordInput, passwordInput])
            logMessage('Confirm password failed!', 'red', true);
            passwordInput.focus()
        }

    }
}


//registration function with cognito-identity-service-provider
async function registerUser(email, username, password) {
    handleElements(['loader'], true)
    var attributeList = [];

    attributeList.push({
        Name: 'email',
        Value: email
    });

    return getCognitoIdentityServiceProvider().signUp({
        ClientId: normalClientId,
        Password: password,
        Username: username,
        UserAttributes: attributeList
    })
    .promise()
    .then(res => {
        switchToVerificationCodeView(true)
        logMessage('Verification code is sent to your given email, confirm your account with code!', 'blue', true)
    })
    .catch(err => {
        emptyTextBoxes([confirmPasswordInput, passwordInput])
        logMessage(err.message, 'red', true)
    })
    .finally(() => {
        handleElements(['loader'],false)
    })
}


//verification functions - confirmSignUp, resendConfirmationCode


//verification and confirm sign up function emptyTextBoxes(registerViewTextBoxes)
//confirm sign up with code received on given email
function confirmSignUp() {
    switchToVerificationCodeView()
    if (checkEmptyTextBoxes(['verificationCodeInput', 'userNameInput'], false) === false) {
        logMessage('Please fill all the fields!', 'rgb(255 0 0 / 1)', true);
    } else {
        handleElements(['loader'],true)
        let { verificationCodeInputValue, userNameInputValue } = fetchTextBoxValues(['verificationCodeInput', 'userNameInput'])
        return getCognitoIdentityServiceProvider().confirmSignUp({
            ClientId: normalClientId,
            ConfirmationCode: verificationCodeInputValue,
            Username: userNameInputValue
        })
        .promise()
        .then(() => {
            emptyTextBoxes([...verificationViewTextBoxes, ...registerViewTextBoxes])
            switchToLogInView()
            logMessage('Verification completed!', 'blue', true)
            
        })
        .catch(err => {
            emptyTextBoxes([verificationCodeInput])
            logMessage(err.message, 'red', true)
            verificationCodeInput.focus()
        })
        .finally(() => {
            handleElements(['loader'],false)
        })
    }
}


//function for regenerating signUp verification code using cognito-identity-service-provider
function resendConfirmationCode() {
    if (checkEmptyTextBoxes(['userNameInput'], false) === false) {
        logMessage('Please fill Username field!', 'rgb(255 0 0 / 1)', true);
    } else {
        handleElements(['loader'],true)
        let { userNameInputValue } = fetchTextBoxValues(['userNameInput'])
        return getCognitoIdentityServiceProvider().resendConfirmationCode({
            ClientId: normalClientId,
            Username: userNameInputValue
        })
        .promise()
        .then(() => {
            logMessage('New Verification code is sent to your email address!', 'blue', true)
        })
        .catch(err => {
            logMessage(err.message, 'red', true)
        })
        .finally(() => {
            handleElements(['loader'],false)
        })
    }
}


//forgot password functions - forgotPassword, confirmForgotPassword

//Initiate forgot password request with cognito-identity-service-provider
function forgotPassword() {
    if (checkEmptyTextBoxes(['userNameInput'], false) === false) {
        logMessage('Please fill username value!', 'rgb(255 0 0 / 1)', true);
    } else {
        handleElements(['loader'],true)
        let { userNameInputValue } = fetchTextBoxValues(['userNameInput'])
        return getCognitoIdentityServiceProvider().forgotPassword({
            ClientId: normalClientId,
            Username: userNameInputValue
        })
        .promise()
        .then(() => {
            logMessage('Enter Verification code to change password, email with verification code is sent to your email address.', 'blue', true);
            handleElements(['userNameInput', 'forgot-password', 'forgotPasswordButton'], false)
            handleElements(['verificationCodeInput', 'passwordInput', 'changePassword'], true)
            handleElementsProperty('passwordInput', 'placeholder', 'New Passowrd')
        })
        .catch(err => {
            logMessage(err.message, 'red', true)
            switchToForgotPasswordCodeView()
        })
        .finally(() => {
            handleElements(['loader'],false)
        })
    }
}


//confirm forgot password action with cognito-identity-service-provider
function confirmForgotPassword() {
    if (checkEmptyTextBoxes(['userNameInput', 'passwordInput', 'verificationCodeInput'], false) === false) {
        logMessage('Please fill all the values!', 'rgb(255 0 0 / 1)', true);
    } else {
        handleElements(['loader'],true)
        let { userNameInputValue, passwordInputValue, verificationCodeInputValue } = fetchTextBoxValues(['userNameInput', 'passwordInput', 'verificationCodeInput'])
        return getCognitoIdentityServiceProvider().confirmForgotPassword({
            ClientId: normalClientId,
            Username: userNameInputValue,
            Password: passwordInputValue,
            ConfirmationCode: verificationCodeInputValue
        })
        .promise()
        .then(() => {
            switchToLogInView()
            logMessage('Password changed successfully!', 'blue', true)
        })
        .catch(err => {
            logMessage(err.message, 'red', true)
            emptyTextBoxes([passwordInput, verificationCodeInput])

        })
        .finally(() => {
            handleElements(['loader'], false)
        })
    }
}



//login function, MFA support for TOTP
async function logIn() {
    clearLogs();
    if (checkEmptyTextBoxes(['userNameInput', 'passwordInput'], false) === false) {
        logMessage('Please enter Username and Password!', 'rgb(255 0 0 / 1)', true);
    } else {
        handleElements(['loader'], true)
        return getCognitoIdentityServiceProvider().initiateAuth({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: normalClientId,
            AuthParameters: {
                USERNAME: userNameInput.value,
                PASSWORD: passwordInput.value
            }
        })
        .promise()
        .then(async d => {
            handleElements(['codeInput'], true)
            handleElements(['logInButton', 'registerButton', 'forgot-password', 'userNameInput', 'passwordInput'], false)
            codeInput.focus()
            if (d.ChallengeName === 'MFA_SETUP') {
                handleElements(['registerMFA'], true)
                return generateSecretMFA(d.Session)

            } else {
                session = d.Session
                handleElements(['verifyMFA'], true)
                logMessage('Enter TOTP to login!', 'blue', true)
            }
        })
        .catch(err => {
            logMessage(err.message, 'red', true)
            passwordInput.value = ''
        })
        .finally(() => {
            handleElements(['loader'],false)
        })
    }
}



//generate secretCode and Session for registering authenticator service with cognito user pools
function generateSecretMFA(Session) {
    return getCognitoIdentityServiceProvider().associateSoftwareToken({
        Session
    })
    .promise()
    .then((res) => {
        session = res.Session
        copyToClipBoard(res.SecretCode)
        clearLogs(true)
        return $('#log-login').html(`
        <span>MFA is enabled on all the accounts. You will need to complete the following steps to continue.<br> - Download and install virtual device if you don't have it already. You can use either Google Authenticator or Microsoft Authenticator.<br> - Copy this MFA Key <b>${res.SecretCode}</b> into your Virtual Device and save with your ${$('#userNameInput').val()}@serverlessdocs.<br> - Use the code generated in the device to continue.</span>`);
    })
    .catch(err => {
        logMessage(err.message, 'red', true)
    })
    .finally(() => {
        handleElements(['loader'],false)
    })
}



//function to register and validate the totp authenticator and totp code
function verifyTotp(challengeType) {
    if (checkEmptyTextBoxes(['codeInput'], false) === false) {
        logMessage('Please fill value first!', 'rgb(255 0 0 / 1)', true)
    } else {
        if (challengeType === 'MFA_SETUP') {
            return getCognitoIdentityServiceProvider().verifySoftwareToken({
                Session: session,
                UserCode: codeInput.value
            })
            .promise()
            .then(d => {
                session = d.session
                switchToLogInView()
                return logMessage('Your Authenticator app is registered succesfully, login to continue!', 'blue', true)
            })
            .catch(err => {
                switchToLogInView()
                logMessage(`${err.message}<br>Your authenticator app registration is failed. Please login again to get new secret!`, 'red', true)
            })
            .finally(() => {
                handleElements(['loader'],false)
            })
        } else {
            return getCognitoIdentityServiceProvider().respondToAuthChallenge({
                ChallengeName: "SOFTWARE_TOKEN_MFA",
                ChallengeResponses: {
                    SOFTWARE_TOKEN_MFA_CODE: $('#codeInput').val(),
                    USERNAME: userNameInput.value
                },
                ClientId: normalClientId,
                Session: session
            })
            .promise()
            .then(async d => {
                idToken = d.AuthenticationResult.IdToken;
                idTokenPayLoad = parseJwt(idToken)
                accessToken = d.AuthenticationResult.AccessToken;
                sessionStorage.setItem('currentSession', JSON.stringify(d.AuthenticationResult))
                getCognitoIdentityCredentials()
                .then(() => {
                    checkUserGroup()
                    listPublicFiles()
                    listMyFiles()
                    showUserName()
                    emptyTextBoxes([...loginViewTextBoxes, ...registerViewTextBoxes, ...verificationViewTextBoxes])
                    clearElements(['public-files-table tbody', 'my-files-table tbody'])
                    switchToLoggedInView();
                    checkLoginProvider()
                    return logMessage(`${idTokenPayLoad['cognito:username']} logged in !`)
                })
            })
            .catch(err => {
                switchToLogInView()
                logMessage(err.message, 'red', true)
                codeInput.value = ''
            })
            .finally(() => {
                handleElements(['loader'],false)
            })
        }
    }
}

 
//If user has logged in before, get the previous session so user doesn't need to log in again.
function getCurrentLoggedInSession() {
    var url = new URL(window.location.href)
    return new Promise((resolve, reject) => {
        handleElements(['loader'],true)
        try {
            if (sessionStorage.getItem('currentSession')) {
                // console.log('if eners')
                currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
                accessToken = currentSession.AccessToken
                // accessTokenPayLoad = parseJwt(accessToken)
                idToken = currentSession.IdToken
                idTokenPayLoad = parseJwt(idToken)
                logMessage(`Session found! ${parseJwt(accessToken).username} logged-in.`, 'blue')
                getCognitoIdentityCredentials()
                    .then(res => {
                        if (res.status) {
                            const expiry = new Date(0)
                            expiry.setUTCSeconds(idTokenPayLoad.exp)
                            logMessage(`This session will expire at ${expiry}`, 'red')
                        }
                        resolve({ status: res.status });
                    })
            } else if (!sessionStorage.getItem('currentSession') && url.searchParams.get('code')) {
                hostedUiSession()
            } else {
                logMessage('Session expired. Please log in again.', 'orange', true);
                handleElements(['loader'],false)
                resolve({ status: false, message: 'Session expired.' });
            }
        } catch (e) {
            handleElements(['loader'],false)
            logMessage(`${e.message} here`, 'rgb(255 0 0 / 1)');
            resolve({ status: false, message: e.message });
        }
    });
}



//function returns the unauthenticated role access keys 
function getAccessSecretKeys() {
    return new Promise((resolve, reject) => {
        AWS.config.region = region;

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: identityPoolId,
        });

        AWS.config.credentials.clearCachedId();
        AWS.config.credentials.refresh((err) => {
            if (err) console.log(err)
            else resolve()
        })
    })
}



//This method will get temporary credentials for AWS using the IdentityPoolId and the Id Token recieved from AWS Cognito authentication provider.
function getCognitoIdentityCredentials() {
    AWS.config.region = region;

    var loginMap = {};
    loginMap[getTokenIssuer(idTokenPayLoad)] = idToken;

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
        Logins: loginMap
    });

    AWS.config.credentials.clearCachedId();

    return new Promise((resolve, reject) => {
        AWS.config.credentials.get(function (err) {
            if (err) {
                logMessage(err.message, 'rgb(255 0 0 / 1)');
                resolve({ success: false, err: err.message });
            }
            else {
                console.log(`AWS Config`, AWS.config);
                logMessage('AWS Access Key: ' + AWS.config.credentials.accessKeyId);
                logMessage('AWS Secret Key: ' + AWS.config.credentials.secretAccessKey);
                logMessage('AWS Session Token: ' + AWS.config.credentials.sessionToken);
                resolve({ status: true });
            }
        });
    });
}


//Function returns the Issuer of token. which will be used to get keys from identity pool
function getTokenIssuer(payLoad) {
    return payLoad["iss"].split('https://').length > 1 ? payLoad["iss"].split('https://')[1] : payLoad.iss
}



//log out function
function logOut() {
    clearLogs();
    sessionStorage.clear()
    idToken = null
    accessToken = null
    idTokenPayLoad = null
    accessTokenPayLoad = null

    if (currentSession.hostedUi && currentSession.hostedUi === true) {
        window.location = challengeUrls.logOut

    } else if (currentSession.googleUser && currentSession.googleUser === true) {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }
    currentSession = new Object()
    handleElementsProperty('userNameBox', 'innerText', 'Login with')
    switchToLogInView()
}






//function checks user group, and detect admin users
function checkUserGroup() {
    if (idTokenPayLoad['cognito:groups']) {
        if (idTokenPayLoad['cognito:groups'][0] === adminGroupName) {
            handleElements(['public-file-upload-ctl'], true)
        } else {
            handleElements(['public-file-upload-ctl'], false)
        }
    } else {
        handleElements(['public-file-upload-ctl'], false)
    }
}



//change user password, with current session access token
async function changeUserPassword() {
    switchToUpdatePasswordView();

    if (checkEmptyTextBoxes(['currentPassword', 'newPassword'], false) === false) {
        logMessage('Please fill all the fields!', 'rgb(255 0 0 / 1)');
        handleElements(['logDiv-updatePassword'], true)
        logUpdatePassword.innerHTML = `<span style="color:red">Please fill all the fields!</span>`
    
    } else {
        handleElements(['loader-updatePassword'], true)
        logUpdatePassword.innerHTML = `<span style="color:red"></span>`
        getCognitoIdentityCredentials()
        .then(() => {
            return getCognitoIdentityServiceProvider().changePassword({
                AccessToken: accessToken, 
                PreviousPassword: currentPassword.value,
                ProposedPassword: newPassword.value 
            })
            .promise()
            .then(d => {
                logMessage('Successfully Change Password!', 'blue');
                handleElements(['loader-updatePassword'], false)
                logOut();
                logMessage('Password successfully updated, you need to login again!', 'blue', true)
            })
            .catch(err => {
                logMessage(err.message)
                handleElements(['logDiv-updatePassword'], true)
                logUpdatePassword.innerHTML = `<span style="color:red">${err.message}</span>`
            })
            .finally(() => {
                emptyTextBoxes(updatePassowrdViewTextBoxes)
                handleElements(['loader-updatePassword'], false)
            })
        })
    }
}



//function returns unique device id associated with current logged in user
function getUserId() {
    var loginMap = {};
    loginMap[getTokenIssuer(idTokenPayLoad)] = idToken

    var params = {
        IdentityPoolId: identityPoolId, /* required */
        AccountId: '609906240783',
        Logins: loginMap
    };

    var cognitoidentity = new AWS.CognitoIdentity()
    return cognitoidentity.getId(params).promise()
        .then(d => {
            console.log(d.IdentityId)
            return d.IdentityId
        })
}

//show username on dropdown
function showUserName () {
    usernameBox.innerHTML = idTokenPayLoad['cognito:username'] || idTokenPayLoad['name']
}


//JWT tokens decoder
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}




//function checks login provider and enable and disable update password control
function checkLoginProvider() {
    if(idTokenPayLoad["iss"] === 'accounts.google.com') {
        updatePasswordButton.disabled = true
        handleElements(['updatePasswordDivHandler'], false)
    } else {
        updatePasswordButton.disabled = false
        handleElements(['updatePasswordDivHandler'], true)
    }
}

//cognito-hosted-ui functions
//function launches hosted ui

function launchHostedUI() {
    window.location.href = challengeUrls.logIn
  }
  
  
  //cognito hosted ui sign in function
  function hostedUiSession() {
    handleElements(['loader'], true)
    try {
      if (!sessionStorage.getItem(currentSession)) {
        var authCode = window.location.href.split('=')[1]
        window.history.pushState({}, document.title, loggedInRedirectUrl);
        var theUrl = `${apiEndpoint}/${oauthPath}?authCode=${authCode}&authType=code`
        xmlHttp.onreadystatechange = function () {
          let newObject = new Object()
          if (this.readyState == 4 && this.status == 200) {
            newObject = JSON.parse(xmlHttp.responseText)
            currentSession.AccessToken = newObject.access_token
            currentSession.IdToken = newObject.id_token
            currentSession.RefreshToken = newObject.refresh_token
            currentSession.hostedUi = true
            sessionStorage.setItem('currentSession', JSON.stringify(currentSession))
            idToken = newObject.id_token
            idTokenPayLoad = parseJwt(idToken)
            accessToken = newObject.access_token
          }
        };
        xmlHttp.open("GET", theUrl, false);
        xmlHttp.setRequestHeader('host', apiEndpoint)
        xmlHttp.setRequestHeader('Date', new Date().toISOString())
        xmlHttp.send();
      }
      currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
      validateSession()
      getCognitoIdentityCredentials()
      .then(() => {
        getCognitoIdentityServiceProvider().getUser({ AccessToken: currentSession.AccessToken })
          .promise()
          .then(d => {
            if (!d.UserMFASettingList) {
              switchToLogInView()
              logMessage('Registration completed, You need to set up MFA before login!', 'blue', true)
              sessionStorage.clear()
              currentSession = new Object()
            } else {
              checkUserGroup()
              showUserName()
              listPublicFiles()
              listMyFiles()
              emptyTextBoxes([...loginViewTextBoxes, ...registerViewTextBoxes, ...verificationViewTextBoxes])
              clearElements(['public-files-table tbody', 'my-files-table tbody'])
              switchToLoggedInView()
            }
          })
      })
    } catch (e) {
      handleElements(['loader'], false)
      logMessage(`${e.message}`, 'rgb(255 0 0 / 1)');
    }
    handleElements(['loader'], false)
  }
  
  //validate or refresh cognito hosted ui session with lambda endpoint
  function validateSession() {
    currentSession = JSON.parse(sessionStorage.getItem('currentSession'))
    if (!currentSession) window.location = challengeUrls.logIn
    var id_token = parseJwt(currentSession.IdToken)
    var expiry = new Date(id_token.exp * 1000)
    logMessage(`Session will end at ${expiry.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`)
    if (new Date().getTime() > expiry) {
      logMessage('Session Expired!')
      var theUrl = `${apiEndpoint}/${oauthPath}?refresh_token=${currentSession.refresh_token}&authType=refresh`
      xmlHttp.onreadystatechange = function () {
        let newObject = new Object()
        if (this.readyState == 4 && this.status == 200) {
          newObject = JSON.parse(xmlHttp.responseText)
          currentSession.AccessToken = newObject.access_token
          currentSession.IdToken = newObject.id_token
          currentSession.RefreshToken = newObject.refresh_token
          currentSession.hostedUi = true
          sessionStorage.setItem('currentSession', JSON.stringify(currentSession))
          logMessage('Session renewed!', 'blue')
        }
      };
      xmlHttp.open("GET", theUrl, false);
      xmlHttp.setRequestHeader('host', apiEndpoint)
      xmlHttp.setRequestHeader('Date', new Date().toISOString())
      xmlHttp.send();
    }
  }
  


//function handles google sign in
function onSignIn(googleUser) {
    console.log('invoked')
    var profile = googleUser.getBasicProfile();
    
    currentSession.IdToken = googleUser.wc.id_token
    idToken = googleUser.wc.id_token
    idTokenPayLoad = parseJwt(idToken)
    
    currentSession.AccessToken = googleUser.wc.access_token
    accessToken = googleUser.wc.access_token
    // accessTokenPayLoad = parseJwt(accessToken)
    
    currentSession.googleUser = true
    sessionStorage.setItem('currentSession', JSON.stringify(currentSession)) 
    
    getCognitoIdentityCredentials()
    .then(() => {
        checkLoginProvider()
        showUserName()
        listPublicFiles()
        listMyFiles()
        emptyTextBoxes([...loginViewTextBoxes, ...registerViewTextBoxes, ...verificationViewTextBoxes])
        clearElements(['public-files-table tbody', 'my-files-table tbody'])
        switchToLoggedInView()
    })
    
  }
  