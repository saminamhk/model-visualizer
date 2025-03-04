# Kontent.ai Model Visualizer

### Quick Deploy on Netlify

Clicking on the below button will guide you through the deployment process and also create a copy of the repository in your account.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/kontent-ai/model-visualizer#NODE_VERSION=20&AWS_LAMBDA_JS_RUNTIME=nodejs20.x)

Make sure to set the `MAPI_KEY` environment variable in the Netlify UI once the repository is deployed. `Manage content model` permission needs to be granted to the API key.

The tool makes use of Netlify functions to invoke SDK methods. Deployment on other platforms requires adjustment to the API layer.