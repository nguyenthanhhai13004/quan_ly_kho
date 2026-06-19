import { Request, Response, NextFunction } from "express";
import { AsyncLocalStorage } from "async_hooks";
import KQNLogService from "../services/log.service";
import { getRequestInfo } from "../utils/request-info";

export const requestContainer = new AsyncLocalStorage<Request>();

export const requestContextMdw = (req: Request, res: Response, next: NextFunction) => {
  requestContainer.run(req, () => {
    next();
  });
};

export const logRequestMdw = (req: Request, res: Response, next: NextFunction) => {
  const isMutating = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  const isExport = req.method === "GET" && req.originalUrl.includes("export");

  if (!isMutating && !isExport) {
    return next();
  }

  const isExcluded = req.originalUrl.includes("/health") || req.originalUrl.includes("/logs");
  if (isExcluded) {
    return next();
  }

  res.on("finish", () => {
    if ((req as any).isLogged) {
      return;
    }

    if (res.statusCode >= 200 && res.statusCode < 300) {
      Promise.resolve().then(async () => {
        try {
          const username = req.user?.username || req.body?.username || "anonymous";
          const { ip, url } = getRequestInfo(req);

          let actionCode = "VIEW";
          if (req.method === "POST") {
            if (url.includes("import")) actionCode = "Import";
            else if (url.includes("login")) actionCode = "ACCOUNT";
            else actionCode = "CREATE";
          } else if (req.method === "PUT" || req.method === "PATCH") {
            if (url.includes("password") || url.includes("profile")) actionCode = "ACCOUNT";
            else actionCode = "EDIT";
          } else if (req.method === "DELETE") {
            actionCode = "DELETE";
          } else if (isExport) {
            actionCode = "Export";
          }

          const getControllerCode = (urlPath: string): string => {
            const parts = urlPath.split("?")[0].split("/");
            const v1Index = parts.indexOf("v1");
            if (v1Index !== -1 && parts[v1Index + 1]) {
              let segment = parts[v1Index + 1].toUpperCase().replace(/-/g, "_");
              if (segment.endsWith("S")) {
                segment = segment.slice(0, -1);
              }
              return segment;
            }
            return "SYSTEM";
          };

          const controllerCode = getControllerCode(url);

          const logData = { ...req.body };
          if (logData.password) logData.password = "********";
          if (logData.newPassword) logData.newPassword = "********";
          if (logData.oldPassword) logData.oldPassword = "********";

          await KQNLogService.createLog({
            username,
            action_code: actionCode,
            controller_code: controllerCode,
            ip,
            url,
            data: logData,
          });
        } catch (err) {
          console.error("Failed to write audit log:", err);
        }
      });
    }
  });

  next();
};
