# Strapi Webhook Actions Proxy

A super simple & lightweight Node.js proxy to send `repository_dispatch` events to GitHub from a Strapi Webhook.

Useful when you want to run a GitHub Actions workflow when changes are made in strapi.

## Background

You can't point strapi webhooks to the [repository dispatch event endpoint](https://docs.github.com/en/rest/reference/repos#create-a-repository-dispatch-event) as the webook request body is not compatible with the dispatches endpoint, thus a proxy is required.

## Usage

Ensure your GitHub Actions workflow file handles the "repository_dispatch" event with your custom type:

```yml
name: Deploy
on:
  repository_dispatch:
    types: [strapi_updated]
```

Deploy the service to your server, for example:

```bash
docker run --publish 5000:5000 --env GITHUB_TOKEN=YOURTOKEN ghcr.io/badsyntax/strapi-webhook-actions-proxy:latest
```

TODO: env

Create a new Webhook in strapi that points to the service with the following query params:

- `event_type`: Any string. This value must match the `repository_dispatch` type specified in your GitHub Actions workflow file.
- `repo`: GitHub `username/repo`

For example:

```
http://strapi-webhook-actions-proxy.example.com/api?event_type=strapi_updated&repo=badsyntax/awesome-website
```
