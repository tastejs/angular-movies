// @ts-ignore
import {Express} from 'express';
import serverTiming from 'server-timing';

export function useTiming(server: Express) {
  server.use(serverTiming());
}
