//===============Node Modules=============================
const cognitoClient = require('aws-sdk/clients/cognitoidentityserviceprovider')
const cidp = new cognitoClient() 
const qs = require('querystring')
const axios = require('axios').default
//=========================================================

//===============AWS Cognito Hosted Ui References==================
const domainName = process.env.domainName
const loggedInRedirectUrl = process.env.redirectUrl
const loggedOutRedirectUrl = process.env.redirectUrl
const clientId = process.env.clientId;
console.log('cid', clientId)
const region = process.env.region;
const UserPoolId = process.env.userPoolId
// const clientSecret = process.env.clientSecret
const grant_type = ['authorization_code', 'refresh_token']
//=================================================================

const getClientSecret = async (ClientId, UserPoolId) => {
    var params = {
      ClientId, 
      UserPoolId
    };
    return cidp.describeUserPoolClient(params).promise();
}

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
    
    
    let response
    try {

        return getClientSecret(clientId, UserPoolId).then(async success => {
            console.log(JSON.stringify(success))
            let options = {
                method: 'POST',
                headers: { "Content-Type":'application/x-www-form-urlencoded', "Authorization":`Basic ${Buffer.from(`${clientId}:${success.UserPoolClient.ClientSecret}`).toString('base64')}`},
                data: qs.stringify(body),
                url: `https://${domainName}.auth.${region}.amazoncognito.com/oauth2/token`
            }
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
        })
        
    
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
