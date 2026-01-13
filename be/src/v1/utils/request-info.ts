import { Request } from "express";

export const getClientIp = (req: Request): string => {
  const xForwardedFor = req.headers["x-forwarded-for"];

  let ip =
    (typeof xForwardedFor === "string" ? xForwardedFor.split(",")[0] : null) ||
    req.socket.remoteAddress ||
    "";

  // clean ::ffff:
  ip = ip.replace("::ffff:", "");

  return ip;
};

export const getRequestUrl = (req: Request): string => {
  return req.originalUrl || req.url;
};

export const getRequestMethod = (req: Request): string => {
  return req.method;
};

export const getUserAgent = (req: Request): string => {
  return req.headers["user-agent"] || "";
};

export const getRequestHost = (req: Request): string => {
  return req.headers.host || "";
};

export const getRequestInfo = (req: Request) => {
  return {
    ip: getClientIp(req),
    url: getRequestUrl(req),
    method: getRequestMethod(req),
    userAgent: getUserAgent(req),
    host: getRequestHost(req),
  };
};
