const route = require("express").Router();
const auth = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const AdminAuthService = require("../service/AdminAuthService");
const AdminService = require("../service/AdminService");
const WorkerModel = require("../models/Worker");
const MessageService = require("../service/externalService/MessageService");

const adminAuthService = new AdminAuthService();
const adminService = new AdminService({
  WorkerModel,
  MessageService: new MessageService(),
});

route.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const { admin, token } = await adminAuthService.login(email, password);
    res.status(200).json({ user, token });
  })
);

route.get(
  "/logout",
  auth,
  asyncHandler(async (req, res, next) => {
    const message = await adminAuthService.logout();
    res.status(200).json({ message });
  })
);

route.get(
  "/allworker",
  auth,
  asyncHandler(async (req, res, next) => {
    const message = await adminService.getAllWorker();
    res.status(200).json({ message });
  })
);

route.get(
  "/allworker",
  auth,
  asyncHandler(async (req, res, next) => {
    const message = await adminService.getAllWorker();
    res.status(200).json({ message });
  })
);

route.post(
  "/sms/test",
  asyncHandler(async (req, res, next) => {
    const message = await adminService.sentMessage(req.body);
    res.status(200).json({ message });
  })
);

module.exports = route;
