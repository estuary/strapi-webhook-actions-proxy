## Getting Started

1. Install Node.js 16.x
2. Install dependencies: `npm install`
3. Create a file called `.env` in the root of the application with the following contents:
   ```bash
   GH_APP_ID="YOUR_GH_APP_ID"
   GH_APP_PRIVATE_KEY="YOUR_BASE64_ENCODED_PEM"
   GH_APP_INSTALLATION_ID="YOUR_INSTALLATION_ID"
   ```
   - **App ID**: found on the GitHub App's settings page under the app name
   - **Private key**: generate one on the app's settings page, then base64-encode the downloaded PEM: `base64 -w0 your-app.private-key.pem`
   - **Installation ID**: visible in the URL when you view the app's installation (`/organizations/estuary/settings/installations/<ID>`)
4. Start the app: `DEBUG=strapi-webhook-actions-proxy:* npm start`

## Testing Locally

```json
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"event":"entry.create","created_at":"2020-01-10T08:47:36.649Z","model":"example","entry":{}}' \
  "http://localhost:5000/api?event_type=strapi_updated"
```

## Build, Run, Publish Docker Image

```bash
docker buildx build --no-cache --platform linux/amd64 -t us-central1-docker.pkg.dev/estuary-marketing/strapi/webhook-proxy:latest .
docker run --publish 5000:5000 --env-file .env us-central1-docker.pkg.dev/estuary-marketing/strapi/webhook-proxy:latest
docker push us-central1-docker.pkg.dev/estuary-marketing/strapi/webhook-proxy:latest
```
