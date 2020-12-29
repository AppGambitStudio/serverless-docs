const pinpointClient = require('aws-sdk/clients/pinpoint');
const cognitoClient = require('aws-sdk/clients/cognitoidentityserviceprovider')
const pinpoint = new pinpointClient();
const cidp = new cognitoClient()
let appId = process.env.PINPOINT_APPID;
let from = process.env.EMAIL;
let subject = 'Notification';
let text = 'new user is registered';
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

const setUserMfa = (userPoolId, username) => {
  var params = {
    UserPoolId: userPoolId,
    Username: username,
    SoftwareTokenMfaSettings: {
      Enabled: true,
      PreferredMfa: true
    }
  };
  return cidp.adminSetUserMFAPreference(params).promise();
}

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
  console.log(JSON.stringify(event))

  // await setUserMfa(event.userPoolId, event.userName)
  await setUserPoolMFA(event.userPoolId)

  var params = {
    GroupName: 'Admin',
    UserPoolId: event.userPoolId,
  };

  let emails = await cidp.listUsersInGroup(params).promise();
  temp = emails.Users.map(x => (x.Attributes.filter(y => y.Name === 'email'))[0].Value);
  console.log('temp', temp);

  try {

    await Promise.all(temp.map(async e => {
      const emailParams = await generateEmailParam(appId, from, e, subject, text);
      let st = await pinpoint.sendMessages(emailParams).promise();
      console.log('message result', st.MessageResponse.Result);
    }));

    return event;

  } catch (e) {
    return event;
  }
};