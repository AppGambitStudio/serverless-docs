## Deployment

- Deploy the backend first.
- Copy the `app-config.js.sample` file and create a new `app-config.js` file to keep all the front-end configurations.
```
const userPoolId = ''; 
const normalClientId = '';
const region = '';
const identityPoolId = '';
const S3FilesBucket = '';
//=============== Cognito Group Name ===================
const adminGroupName = ''
//===============AWS Cognito Hosted Ui References==================
const domainName = ''
const hosteduiClientId = ''
const loggedInRedirectUrl = ''
const loggedOutRedirectUrl = ''
const apiEndpoint = ''
const oauthPath = ''
//===============OAuth Cognito Identity ChallengeUrls
const challengeUrls = {
    logIn: `${domainName}.auth.${region}.amazoncognito.com/login?client_id=${hosteduiClientId}&response_type=code&scope=openid+aws.cognito.signin.user.admin&redirect_uri=${loggedInRedirectUrl}`,
    userInfo: `${domainName}.auth.${region}.amazoncognito.com/oauth2/userInfo`,
    logOut: `${domainName}.auth.${region}.amazoncognito.com/logout?client_id=${hosteduiClientId}&logout_uri=${loggedOutRedirectUrl}`
}
```
- Use the `npm run deploy` command to deploy (move) the frontend changes to the S3 Website Hosting bucket. Replace the S3 bucket name in `package.json` file.

```
"deploy": "aws s3 sync . s3://<your web hosting S3 bucket name>"
```