const pinpointClient = require('aws-sdk/clients/pinpoint');
const cognitoClient = require('aws-sdk/clients/cognitoidentityserviceprovider')

const pinpoint = new pinpointClient();
const cidp = new cognitoClient()

let appId = process.env.PINPOINT_APPID;
let from = process.env.EMAIL;
let subject = 'ServerlessDocs - New User Signup';
let text = `{{email}} has completed the signup.`;
let temp = [];

function setUserPoolMFA(userPoolId) {
  var params = {
    UserPoolId: userPoolId,
    MfaConfiguration: 'ON',
    SoftwareTokenMfaConfiguration: {
      Enabled: true
    }
  };
  return cidp.setUserPoolMfaConfig(params).promise();
}

// const setUserMfa = (userPoolId, username) => {
//   var params = {
//     UserPoolId: userPoolId,
//     Username: username,
//     SoftwareTokenMfaSettings: {
//       Enabled: true,
//       PreferredMfa: true
//     }
//   };
//   return cidp.adminSetUserMFAPreference(params).promise();
// }

const generateEmailParam = (appId, from, to, subject, text) => {
  return {
    ApplicationId: appId,
    MessageRequest: {
      MessageConfiguration: {
        EmailMessage: {
          FromAddress: from,
          SimpleEmail: {
            TextPart: {
              Data: text,
            }, Subject: {
              Data: subject,
            },
          },
        }
      },
      Addresses: {
        [to]: {
          ChannelType: 'EMAIL'
        },
      }
    }
  };
}


exports.handler = async (event) => {
  console.log(event);

  await setUserPoolMFA(event.userPoolId)

  var params = {
    GroupName: process.env.ADMIN_GROUP,
    UserPoolId: event.userPoolId,
  };

  let emails = await cidp.listUsersInGroup(params).promise();
  temp = emails.Users.map(x => (x.Attributes.filter(y => y.Name === 'email'))[0].Value);  

  await Promise.all(temp.map(async e => {
    const emailParams = await generateEmailParam(appId, from, e, subject, text.replace('{{email}}', event.request.userAttributes.email));
    let st = await pinpoint.sendMessages(emailParams).promise();    
  }));
  return event;
};