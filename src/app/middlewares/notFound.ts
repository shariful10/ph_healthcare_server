import { RequestHandler } from "express";
import { httpStatus } from "../utils/httpStatus";

const notFound: RequestHandler = (req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "API not found!",
    error: "",
  });
};

export default notFound;
