# ServerlessDocs
ServerlessDocs is a Serverless Document Management System I created to showcase the usage of different AWS Services like Cognito, S3, Lambda, API Gateway, etc. 

# Docs
Please refer to the full documentation [here](https://dhaval-b-nagar.gitbook.io/serverless-cognito-s3). 

# Caveats
- MFA is by default enabled
- Google SignIn is optional and by default disabled
- Frontend needs to be manually pushed with `npm run deploy` command
- Some UI glitches :)

# Deployment 
We have put two deployment setup, 1) Serverless Framework and 2) SAM. Serverless framework is already pushed in the repo and SAM will be pushed in sometime.

## ServerlessDocs Backend - Serverless Framework
`serverless-docs-backend` folder contains the Serverless backend code and configurations. 

Deploy the backend with `sls deploy --stage ` and use the output variables in `serverless-docs-frontend/app-config.js` file.

## ServerlessDocs Backend - SAM
Updating Soon