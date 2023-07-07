import compressionModule from 'compression';
import {Express} from "express";
import serverTiming from "server-timing";

export function addServerTiming(fn: (req: any, res: any, next: any) => Promise<any>, cfg: { name: string, label?: string }) {

  return async (req: any, res: any, next: any) => {
    res.startTime(cfg.name, cfg.label || cfg.name);
    const result = await fn(req, res, next);
    res.endTime(cfg.name);
    return result;
  }
}

export function useCompression(server: Express) {
  // **🚀 Perf Tip:**
  // Serve gzip for faster load
  server.use(compressionModule());
}

export function useTiming(server: Express) {
  server.use(serverTiming());
}

