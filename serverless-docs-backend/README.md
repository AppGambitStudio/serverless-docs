## Deployment

The `config.json.sample` file has all the variables that are required during serverless deployment.

- Copy the file content and create a new `config.json` file with updated values before deployment.
- The sample config file has only one stage `dev` for the development purpose.

```
{
  "dev": {
    "region": "us-west-1",
    "memorySize": "128",
    "userPoolName": "serverless-docs-userpool",
    "normalWebClient": "client1",
    "hostedWebClient": "client2",
    "identityPoolName": "serverless_docs_idp",
    "authenticationProviders": {
      "googleAppId": "",
      "googleAppSecret": "",
      "googleAuthScopes": "email openid"
    },
    "serverlessdocs-website-bucket": "serverless-docs-frontend",
    "cognito-signin-domain": "serverless-docs-mydomain",
    "adminGroupName": "Admin",
    "pinpointAppName": "serverless-docs-pinpoint",
    "emailConfig": {
      "verifiedEmailAddress": "hello@mycompany.com",
      "verifiedEmailArn": ""
    },
    "whiteListedDomains": "mycompany1.com,mycompany2.com",
    "whiteListedEmails": "test1@test.com,test2@test.com" 
  }  
}
```

- Use latest Serverless Framework and deploy using the `sls deploy --stage <stage name>`
- Once deployed, go to the CloudFormation stage in AWS console and copy the Output Variables.
- Output variables will be required in the `serverless-docs-frontend/app-config.js` file.
