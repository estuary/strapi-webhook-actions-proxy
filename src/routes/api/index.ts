import { Router, Request, Response } from 'express';
import { ResponseBody, RequestBody, QueryParams } from './types';
export const apiRoute = Router();

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
      const response = await fetch(
        `https://api.github.com/repos/estuary/marketing-site/dispatches`,
        {
          method: 'post',
          headers: new Headers({
            Accept: 'application/vnd.github.v3+json',
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
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
