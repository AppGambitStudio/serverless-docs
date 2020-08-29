//text-boxes
const userNameInput = document.getElementById('userNameInput')
const emailInput = document.getElementById('emailInput')
const passwordInput = document.getElementById('passwordInput')
const confirmPasswordInput = document.getElementById('confirmPasswordInput')
const verificationCodeInput = document.getElementById('verificationCodeInput')
const codeInput = document.getElementById('codeInput')
const currentPassword = document.getElementById('currentPassword')
const newPassword = document.getElementById('newPassword')
//buttons
const logInButton = document.getElementById('logInButton')
const registerMFAButton = document.getElementById('registerMFA')
const verifyMFAButton = document.getElementById('verifyMFA')
const registerButton = document.getElementById('registerButton')
const verifyCodeButton = document.getElementById('verifyCodeButton')
const reSendConfirmCodeButton = document.getElementById('reSendConfirmCodeButton')
const hostedUiButton = document.getElementById('hostedUiButton')
const forgotPasswordButton = document.getElementById('forgotPasswordButton')
const loginbackButton = document.getElementById('loginback')
const googleButton = document.getElementById('googleButton')
const changePasswordButton = document.getElementById('changePassword')
const updatePasswordButton = document.getElementById('updatePasswordButton')
//divs
const usernameBox = document.getElementById('userNameBox')
const homeViewTitle = document.getElementById('home-view-title')
const loginPageDropDownMenu = document.getElementById('dropdown-content-login-form')
const homePageDropDown = document.getElementById('dropdown-constent-home-view')
const loginForm = document.getElementById('login-form')
const loginPageLogMessage = document.getElementById('logDiv-login')
const logUpdatePassword = document.getElementById('log-updatePassword')
//before login div elements to show
const loginViewDivs = [loginPageDropDownMenu, loginPageLogMessage, loginForm]
//after login div elements to show 
const homeViewDivs = [homeViewTitle, homePageDropDown]




//login view, textBoxes buttons, login view render method
const loginViewTextBoxes = [userNameInput, passwordInput, codeInput]
const loginViewButtons = [logInButton, registerMFAButton, verifyMFAButton, registerButton]
const loginView = [...loginViewTextBoxes, ...loginViewButtons]
const switchToLogInView = () => {
    //div elemts hide
    $("#homeView").hide();
    $("#dropdown-constent-home-view").hide();
    $("#home-view-title").hide();
    $("#logDiv-updatePassword").hide()
    $("#logDiv").hide()

    //textBoxes hide
    $("#emailInput").hide();
    $("#confirmPasswordInput").hide();
    $("#verificationCodeInput").hide();
    $("#codeInput").hide();

    // buttons hide
    $("#verifyCodeButton").hide();
    $("#reSendConfirmCodeButton").hide();
    $("#forgotPasswordButton").hide();
    $("#changePassword").hide();
    $("#registerMFA").hide();
    $("#verifyMFA").hide();
    $("#loginback").hide();

    //div elements show
    $("#login-form").show();
    $("#dropdown-content-login-form").show();
    $("#logDiv-login").show();

    //textBoxes show
    $("#userNameInput").show();
    $("#passwordInput").show();

    //buttons show
    $("#logInButton").show();
    $("#registerButton").show();
    $("#forgot-password").show();

    //clearLogDivs
    $('#log').empty()
    $('#log-login').empty()

    //hide loaders
    $("#loader-home").hide();
    $("#loader").hide();

    //placeholder change
    $("#passwordInput").attr('placeholder', 'Password')
    $("#userNameBox").attr('innerTEXT', 'Login with')
    emptyTextBoxes([...loginViewTextBoxes, ...registerViewTextBoxes, ...forgotPasswordViewTextBoxes])
    userNameInput.focus()
    // $("#userNameInput").focus()
}


//register view
const registerViewTextBoxes = [emailInput, userNameInput, passwordInput, confirmPasswordInput]
const registerViewButtons = [registerButton, verifyCodeButton]
const registerView = [...registerViewTextBoxes, ...registerViewButtons]
const switchToRegisterView = () => {
    //div hide
    $("#homeView").hide();
    $("#dropdown-constent-home-view").hide();
    $("#home-view-title").hide();

    //textBoxes hide
    $("#verificationCodeInput").hide();

    //buttons hide
    $("#logInButton").hide();
    $("#reSendConfirmCodeButton").hide();
    $("#forgot-password").hide();
    $("#changePassword").hide();
    $("#forgotPasswordButton").hide()

    //div show
    $("#login-form").show();
    $("#dropdown-content-login-form").show();
    $("#logDiv-login").show();

    //textBoxes show
    $("#emailInput").show();
    $("#userNameInput").show();
    $("#passwordInput").show();
    $("#confirmPasswordInput").show();

    //buttons show
    $("#registerButton").show();
    $("#verifyCodeButton").show();
    $("#loginback").show();
    emailInput.focus()

}

//verification registration (confirm sign up) view
const verificationViewTextBoxes = [userNameInput, verificationCodeInput]
const verificationViewButtons = [verifyCodeButton, reSendConfirmCodeButton]
const verificationView = [...verificationViewTextBoxes, ...verificationViewButtons]
const switchToVerificationCodeView = (directVerification = false) => {
    //div hide
    $("#homeView").hide();
    $("#dropdown-constent-home-view").hide();
    $("#home-view-title").hide();

    //textBoxes hide
    $("#emailInput").hide();
    $("#passwordInput").hide();
    $("#confirmPasswordInput").hide();

    //buttons hide
    $("#logInButton").hide();
    $("#registerButton").hide();
    $("#forgot-password").hide();
    $("#changePassword").hide();
    $("#forgotPasswordButton").hide()

    //div show
    $("#login-form").show();
    $("#dropdown-content-login-form").show();
    $("#logDiv-login").show();

    //textBoxes show
    $("#verificationCodeInput").show();

    //buttons show
    $("#verifyCodeButton").show();
    $("#reSendConfirmCodeButton").show();
    $("#loginback").show();


    if (!directVerification) {
        $("#userNameInput").show()
        userNameInput.focus()
    } else {
        $("#userNameInput").hide();
        verificationCodeInput.focus()
    }
    // !directVerification ? $("#verificationCodeInput").hide() : $("#verificationCodeInput").show(); 
}

//forgot password view
const forgotPasswordViewTextBoxes = [userNameInput, passwordInput, confirmPasswordInput, verificationCodeInput]
const forgotPasswordViewButtons = [forgotPasswordButton]
const forgotPasswordView = [...forgotPasswordViewTextBoxes, ...forgotPasswordViewButtons]
const switchToForgotPasswordCodeView = () => {
    //div hide
    $("#homeView").hide();
    $("#dropdown-constent-home-view").hide();
    $("#home-view-title").hide();

    //textBoxes hide
    $("#passwordInput").hide();
    $("#confirmPasswordInput").hide();
    $("#emailInput").hide();
    $("#verificationCodeInput").hide();

    //buttons hide
    $("#logInButton").hide();
    $("#registerButton").hide();
    $("#reSendConfirmCodeButton").hide();
    $("#forgot-password").hide()
    $("#changePassword").hide();

    //div show
    $("#login-form").show();
    $("#dropdown-content-login-form").show();
    $("#logDiv-login").show();

    //textBoxes show
    $("#userNameInput").show();

    //buttons show
    $("#loginback").show();
    $("#forgotPasswordButton").show()

    //placeHolder change
    $('passwordInput').attr('placeholder', 'New Password')
    userNameInput.focus()
    emptyTextBoxes([userNameInput])

}

const switchToLoggedInView = () => {
    //div show
    $("#homeView").show();
    $("#file-upload-ctl").css('display', 'inline-block');
    $("#dropdown-constent-home-view").show();
    $("#home-view-title").show();
    $("#my-files").show()
    $("#public-files").show()

    //textBoxes show
    //no textBoxes to show

    //buttons show
    $("#logOutButton").show();
    $("#updatePasswordButton").show();

    //div hide
    $("#login-form").hide();
    $("#updatePasswordDiv").hide()
    $("#dropdown-content-login-form").hide();
    $("#logDiv-login").hide();
    $("#logDiv-updatePassword").hide()

    //textBoxClear
    emptyTextBoxes(updatePassowrdViewTextBoxes)
    logHandler()
}

const updatePassowrdViewTextBoxes = [currentPassword, newPassword]
const switchToUpdatePasswordView = () => {
    //div hide
    $("login-form").hide()
    $("#dropdown-content-login-form").hide();
    $("#logDiv-login").hide();
    $("#public-files").hide();
    $("#my-files").hide();

    //buttons hide
    $('#listPublicFiles').hide();
    $('#listMyFiles').hide();
    $('#setnewPassword').hide();
    $('#file-upload-ctl').hide();

    //textBoxes show
    $('#currentPassword').show();
    $('#newPassword').show();

    //div show
    $("#updatePasswordDiv").show();
    // $("#public-files").show();
    // $("#my-files").show();
    currentPassword.focus()

}


//Ui level functions to manage DOM elements

const emptyTextBoxes = (controls) => {
    controls.map(e => {
        e.value = ''
    })
}

const updateToolTip = (element, newToolTipMessage, oldToolTipMessage, timeout = 5000) => {
    document.getElementById(element).setAttribute('data-tooltip', newToolTipMessage)
    setTimeout(function () {
        document.getElementById(element).setAttribute('data-tooltip', oldToolTipMessage)
    }, timeout);
}

const checkEmptyFileControls = (control) => {
    if (!document.getElementById(control).files.length) {
        return false
    } else {
        return true
    }
}

const fetchFileControlValues = (fileControl) => {
    return document.getElementById(fileControl).files
}

const showTableData = (data, id, hasDelete) => {

    const table = $(`#${id}`);
    table.show();
    table.find('tbody').html("");
    data.Contents.forEach(element => {
        console.log(element)
        const file = element.Key.split('/')[element.Key.split('/').length - 1];
        console.log(file)
        if (file) {
            downloadBtn = `<button class="button is-small is-success m-b-5" data-tooltip="Download" onclick="downloadFile('${element.Key}')"><i class="fa fa-download"></i></button>`
            shareBtn = `<button id="${element.Key}" class="button is-small is-info m-b-5"  data-tooltip="Share" onclick="shareFile('${element.Key}')"> <i class="fa fa-share-alt"></i> </button>`
            deleteBtn = ''
            if (idTokenPayLoad['cognito:groups'] || hasDelete) {
                deleteBtn = `<button class="button is-small m-b-5 is-danger" data-tooltip="Delete" onclick="deleteFile('${element.Key}')"><i class="fa fa-trash"></i></button>`
            }

            table.find('tbody')
                .append(`<tr>
        <td>${file}</td>
        <td>${bytesToSize(element.Size)}</td>
        <td>${element.LastModified.toDateString() + ' ' + element.LastModified.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
        <td class="text-right-pad-right">
            ${downloadBtn}
            ${deleteBtn}
            ${shareBtn}
        </td>                        
        </tr>`)
        }
    });
}


const checkEmptyTextBoxes = (textBoxes, validateAll = true) => {
    let emptyTextBoxes = textBoxes.filter(textBox => $(`#${textBox}`).val() === '')
    if (validateAll) {
        return textBoxes.length === emptyTextBoxes.length ? false : true;
    } else {
        return emptyTextBoxes.length > 0 ? false : true
    }
}

const clearLogs = (loginLogs = false) => {
    if (!loginLogs) $('#log').empty();
    else {
        $('#log-login').empty()
        $('#messages').empty()
    }
}


//logs handler
function logHandler() {
    var anchorText = document.getElementById('enableLogsButton')
    // localStorage.setItem('logSetting', true)
    if (anchorText.innerText === 'Enable Logs') {
        $("#logDiv").show();
        $("#clearLogsButton").show();
        anchorText.innerText = 'Disable Logs'
    } else {
        $("#logDiv").hide();
        $("#clearLogsButton").hide();
        anchorText.innerText = 'Enable Logs'
    }
}

//handle update password div
const showUpdatePasswordDiv = () => {
    var element = document.getElementById('updatePasswordDiv')
    // var homeElement = document.getElementById('homeView')
    var publicFilesDiv = document.getElementById('public-files')
    var myFilesDiv = document.getElementById('my-files')
    var logDiv = document.getElementById('logDiv')
    if (element.style.display === 'block') {
        element.style.display = 'none'
        publicFilesDiv.style.display = 'block'
        myFilesDiv.style.display = 'block'
        // homeElement.style.display = 'block'
    } else {
        element.style.display = 'block'
        publicFilesDiv.style.display = 'none'
        myFilesDiv.style.display = 'none'
        // homeElement.style.display = 'none'
        logDiv.style.display = 'none'
        currentPassword.focus()
    }
}

const fetchTextBoxValues = (textBoxes) => {
    let values = new Object()
    textBoxes.map(textBox => {
      values[`${textBox}Value`] = $(`#${textBox}`).val()
    })
    return values
  }
  
  const handleElements = (elements, state) => {
    elements.map(e => {
      state ? $(`#${e}`).show() : $(`#${e}`).hide();
    })
  }
  
  const handleElementsProperty = (element, propertyType, propertyValue) => {
    $(`#${element}`).attr(propertyType, propertyValue)
  }
  
  const clearElements = (elements) => {
    elements.map(e=>{
      $(`#${e}`).empty()
    })
  }