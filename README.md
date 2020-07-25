# ServerlessDocs
ServerlessDocs is a Serverless Document Management System I created to showcase the usage of different AWS Services like Cognito, S3, Lambda, API Gateway, etc. 

# Docs
Please refer to the full documentation [here](https://dhaval-b-nagar.gitbook.io/serverless-cognito-s3). 

# hostedUI
# to enable hostedUI, 
create API Gateway GET endpoint and new lambda function, set API Gateway trigger on lambda function.

# -----------Lambda Function Code--------------------- 

//===============Node Modules=============================
const qs = require('querystring')
const axios = require('axios').default
//=========================================================

//===============AWS Cognito Hosted Ui References==================
const domainName = process.env.domainName
const loggedInRedirectUrl = process.env.redirectUrl
const loggedOutRedirectUrl = 'http://localhost:8080'
const clientId = process.env.clientId;
const region = process.env.region;
const clientSecret = process.env.clientSecret
const grant_type = ['authorization_code', 'refresh_token']
//=================================================================

exports.handler = async (event) => {
    let body
    console.log('invoked', event.queryStringParameters)
    if(event.queryStringParameters.authType === 'code') {
        body = {
            grant_type: grant_type[0],
            clientId: clientId,
            code: event.queryStringParameters.authCode,
            redirect_uri: loggedInRedirectUrl
        }    
    } else {
        body = {
            grant_type: grant_type[1],
            clientId: clientId,
            refresh_token: event.queryStringParameters.refresh_token
        }
    }
    
    let options = {
        method: 'POST',
        headers: { "Content-Type":'application/x-www-form-urlencoded', "Authorization":`Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`},
        data: qs.stringify(body),
        url: `https://${domainName}.auth.${region}.amazoncognito.com/oauth2/token`
    }
    let response
    try {
        let data = await axios(options)
        response = {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(data.data)
        };
        return response
    
    } catch(e) {
        console.log(JSON.stringify(e.response.data))
        response = {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            body: JSON.stringify(e.response.data),
        };
        return response
    }
};
# -----------------------------------------------------------------------
# add the following code to lambda function.


# Create Lambda Layer,
create directory with 'nodejs' name,
inside the 'nodejs', use npm init,
add 'axios' - npm i axios
zip the 'nodejs' directory

# On the AWS Lambda Console,
create new nodejs layer by uploading the 'nodejs.zip',
link the layer with lambda function

# In Cognito user pool,
create another app client, select the client secret option

Under the App client settings, go to the newly created client, and select the "Cognito User Pool" option for Enabled Identity Providers.

set the Callback url,
http://localhost:8080/safeHome

set the Sign out url,
http://localhost:8080

Under the OAuth 2.0

set the Allowed OAuth Flows,
select "Authorization code grant"

set the Allowed OAuth Flows,
select "openid"

# Under Domain name,
choose your domain name