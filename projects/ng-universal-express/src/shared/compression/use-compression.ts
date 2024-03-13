import compressionModule from 'compression';
import { Express } from 'express';

export function useCompression(server: Express) {
  server.use(compressionModule());
}
