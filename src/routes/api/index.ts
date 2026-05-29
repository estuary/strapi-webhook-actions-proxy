import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { ResponseBody, RequestBody, QueryParams } from './types';
export const apiRoute = Router();

async function getInstallationToken(): Promise<string> {
  const privateKey = Buffer.from(process.env.GH_APP_PRIVATE_KEY!, 'base64').toString();
  const now = Math.floor(Date.now() / 1000);
  const appJwt = jwt.sign({ iat: now - 60, exp: now + 600, iss: process.env.GH_APP_ID }, privateKey, { algorithm: 'RS256' });
  const response = await fetch(
    `https://api.github.com/app/installations/${process.env.GH_APP_INSTALLATION_ID}/access_tokens`,
    {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/vnd.github.v3+json',
        Authorization: `Bearer ${appJwt}`,
      }),
    },
  );
  if (!response.ok) {
    throw new Error(`Failed to get installation token: ${response.statusText}`);
  }
  const { token } = (await response.json()) as { token: string };
  return token;
}

apiRoute.post(
  '/',
  async (
    req: Request<null, ResponseBody, RequestBody, QueryParams>,
    res: Response<ResponseBody>,
  ) => {
    const { event_type: eventType } = req.query;
    try {
      if (!eventType) {
        throw new Error('event_type param missing');
      }
    } catch (e) {
      return res.status(400).send(e instanceof Error ? e.message : String(e));
    }

    try {
      const token = await getInstallationToken();
      const response = await fetch(
        `https://api.github.com/repos/estuary/marketing-site/dispatches`,
        {
          method: 'post',
          headers: new Headers({
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${token}`,
            ContentType: 'application/json',
          }),
          body: JSON.stringify({
            event_type: eventType,
            client_payload: req.body,
          }),
        },
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      res.status(200).send('Success');
    } catch (e) {
      const msg = 'Error calling actions endpoint';
      console.error(`${msg}:`, e instanceof Error ? e.message : String(e));
      res.status(500).send(msg);
    }
  },
);
