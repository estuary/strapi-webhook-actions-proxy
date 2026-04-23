# What is different here?

No real logic changes or anything was made. Just versioning changing and trying to reduce the surface area for security issues.

1. Updated the Docker image for `node` to 19.5. We need to get this to `lts` but as long as it is above `16` that is better.
1. Remove `isomorphic-fetch`. The default `fetch` seems fine to use and this is just another thing we'd need to keep an eye on.
1. Update all packages as much as possible without needing to make any large changes.
1. Removed the `.github` settings. Since we will not be using those I took them out.

---

---

# Deployment

Merging to `master` automatically builds and deploys to production via GitHub Actions (`.github/workflows/deploy.yml`). The workflow:

1. Runs ESLint and Prettier checks
2. Builds a `linux/amd64` Docker image from `Dockerfile`
3. Pushes to Artifact Registry as both `:latest` and `:<7-char-sha>`
4. Deploys the new revision to the `webhook-proxy` Cloud Run service

To roll back to a previous revision, find the SHA tag in Artifact Registry and run:

```bash
gcloud run deploy webhook-proxy \
  --image us-central1-docker.pkg.dev/estuary-marketing/strapi/webhook-proxy:<sha> \
  --region us-central1 \
  --project estuary-marketing
```

---

# Strapi Webhook GitHub Actions Proxy

A super simple & lightweight Node.js proxy to send `repository_dispatch` events to GitHub from a Strapi Webhook.

Useful when you want to run a GitHub Actions workflow when changes are made in Strapi.

## Usage

1 - Ensure your GitHub Actions workflow file handles the "repository_dispatch" event with your custom type:

```yml
name: Deploy
on:
  repository_dispatch:
    types: [strapi_updated]
```

2 - Create a GitHub Personal access token with `repo` scope

3 - Deploy the service to your server, for example:

4 - Create a new Webhook in Strapi that points to the service with the following query params:

- `event_type`: Any string. This value must match the `repository_dispatch` type specified in your GitHub Actions workflow file.

For example:

```
http://actions-proxy:5000/api?event_type=strapi_updated&repo=username/awesome-website
```

## Background

You can't point Strapi webhooks to the [repository dispatch event endpoint](https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event) as the webook request body is not compatible with the dispatches endpoint, thus a proxy is required.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

See [LICENSE.md](./LICENSE.md)
