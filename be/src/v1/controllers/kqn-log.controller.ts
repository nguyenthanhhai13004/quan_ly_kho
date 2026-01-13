import { NextFunction, Request, Response } from "express";
import { OK } from "../cores/success.response";
import KQNLogService from "../services/log.service";
import LogFilterPaginationDto from "../dtos/kqn-logs/log-filter-pagination";

class KqnLogController {
  getAllLogs = async (req: Request, res: Response, next: NextFunction) => {
    const query = {
      page: req.query.page || 1,
      size: req.query.size || 10,
      username:req.query.username || "",
      endDate:req.query.endDate || "",
      startDate:req.query.startDate ||""
    } as LogFilterPaginationDto;
    return new OK({
      message: "lấy logs thành công",
      data: await KQNLogService.getLogs(query),
    }).send(res);
  };
}
export default new KqnLogController();
