const whitelistedDomains = process.env.WHITE_LISTED_DOMAINS.split(',');
const whitelistedEmails = process.env.WHITE_LISTED_EMAIL.split(',');

exports.handler = async (event, context, callback) => {
    console.log('Validate signup request', event);
    console.log('wd', whitelistedDomains)
    console.log('we', whitelistedEmails)

    // Split the email address so we can compare domains
    const userEmail = event.request.userAttributes.email;
    const userDomain = userEmail.split("@")[1];
    console.log(`Validating domain ${userDomain} and email ${userEmail}`);
    if (whitelistedEmails.indexOf(userEmail) < 0) {
        if (whitelistedDomains.indexOf(userDomain) < 0) {
            throw new Error('EMAIL_DOMAIN_ERR')
        }
    }

    // Return to Amazon Cognito
    return event;
};