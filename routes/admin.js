const route = require("express").Router();
const auth = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
// services
const AdminAuthService = require("../service/AdminAuthService");
const AdminService = require("../service/AdminService");
const MessageService = require("../service/externalService/MessageService");
const MailService = require("../service/externalService/MailService");
// models
const AdminModel = require("../models/Admin");
const WorkerModel = require("../models/Worker");

const adminAuthService = new AdminAuthService({
  AdminModel,
  MailService: new MailService(),
});
const adminService = new AdminService({
  WorkerModel,
  MessageService: new MessageService(),
});

// authentication

route.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const { fname, lname, email, password } = req.body;
    const { admin, token } = await adminAuthService.register(
      fname,
      lname,
      email,
      password
    );
    res.status(200).json({ admin, token });
  })
);

route.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const { admin, token } = await adminAuthService.login(email, password);
    res.status(200).json({ admin, token });
  })
);

route.post(
  "/forgotpassword",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const { admin, token } = await adminAuthService.login(email, password);
    res.status(200).json({ admin, token });
  })
);

route.put(
  "/updatepassword/:id/:token",
  asyncHandler(async (req, res, next) => {
    const { id, token } = req.params;
    const response = await adminAuthService.resetpassword(id,token, req.body.password);
    res.status(200).json(response);
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

// worker

route.post(
  "/addworker",
  auth,
  asyncHandler(async (req, res, next) => {
    const response = await adminService.addWorker(req.body);
    res.status(200).json({ response });
  })
);

route.get(
  "/oneWorker/:id",
  auth,
  asyncHandler(async (req, res, next) => {
    const {id}=req.params
    const response = await adminService.OneWorker(id);
    res.status(200).json({ response });
  })
);


route.get(
  "/allworker",
  auth,
  asyncHandler(async (req, res, next) => {
    const response = await adminService.getAllWorker();
    res.status(200).json({ response });
  })
);

route.delete(
  "/deleteOneworker",
  auth,
  asyncHandler(async (req, res, next) => {
    const response = await adminService.deleteById(req.body.id);
    res.status(200).json({ response });
  })
);

route.post(
  "/deleteSelectedworkers",
  auth,
  asyncHandler(async (req, res, next) => {
    console.log(req.body,"req.body.workers")
    const response = await adminService.deleteSelectedId(req.body.workers);
    res.status(200).json({ response });
  })
);

route.put(
  "/updateworker",
  auth,
  asyncHandler(async (req, res, next) => {
    const response = await adminService.editById(req.body.id, req.body.worker);
    res.status(200).json({ response });
  })
);

route.post(
  "/search_worker",
  auth,
  asyncHandler(async (req, res, next) => {
    console.log(req.body.query,req.body.perameter);
    const response = await adminService.search(req.body.query,req.body.perameter);
    res.status(200).json({ response });
  })
);
// sms

route.post(
  "/sms/test",
  asyncHandler(async (req, res, next) => {
    const message = await adminService.sentMessage(req.body);
    res.status(200).json({ message });
  })
);

module.exports = route;
