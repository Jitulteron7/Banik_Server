const route = require("express").Router();
const auth = require("../middleware/auth");
const asyncHandler = require("express-async-handler");
const moment = require("moment");
const {fromTo}=require("../utils/fromTo");
// services
const AdminAuthService = require("../service/AdminAuthService");
const AdminService = require("../service/AdminService");
const MessageService = require("../service/externalService/MessageService");
const MailService = require("../service/externalService/MailService");
// models
const AdminModel = require("../models/Admin");
const WorkerModel = require("../models/Worker");
const MessageModel = require("../models/Message");
const MessageSendModel = require("../models/MessageSend");

const adminAuthService = new AdminAuthService({
  AdminModel,
  MailService: new MailService(),
});
const adminService = new AdminService({
  WorkerModel,
  MessageService: new MessageService(),
  AdminModel,
  MessageModel,
  MessageSendModel,
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
    const { msgdata, msgSendData } = await adminService.getMessageData(
      admin._id
    );

    res
      .status(200)
      .json({ admin, token, msgData: msgdata, msgSendData: msgSendData });
  })
);

// route.post(
//   "/forgotpassword",
//   asyncHandler(async (req, res, next) => {
//     const { email, password } = req.body;
//     const { admin, token } = await adminAuthService.login(email, password);
//     res.status(200).json({ admin, token });
//   })
// );

route.put(
  "/updatepassword/:id/:token",
  asyncHandler(async (req, res, next) => {
    const { id, token } = req.params;
    const response = await adminAuthService.resetpassword(
      id,
      token,
      req.body.password
    );
    res.status(200).json(response);
  })
);


route.put(
  "/update_profile",
  auth,
  asyncHandler(async (req, res, next) => {
    let id=req.admin._id;
    const response = await adminAuthService.updateAdminPorfile(req.body,id);
    res.status(200).json({response});
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
    console.log(response, "add");
    res.status(200).json({ response });
  })
);

route.get(
  "/oneWorker/:id",
  auth,
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
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
    console.log(req.body, "req.body.workers");
    const response = await adminService.deleteSelectedId(req.body.workers);
    res.status(200).json({ response });
  })
);

route.put(
  "/updateworker",
  auth,
  asyncHandler(async (req, res, next) => {
    const {details}=req.body
    const response = await adminService.editById(details);
  
    res.status(200).json({ response });
  })
);

route.post(
  "/search_worker",
  auth,
  asyncHandler(async (req, res, next) => {
    console.log(req.body.query, req.body.perameter);
    const response = await adminService.search(
      req.body.query,
      req.body.perameter
    );
    res.status(200).json({ response });
  })
);

route.post(
  "/search_payment",
  auth,
  asyncHandler(async (req, res, next) => {
    const response = await adminService.searchPay(req.body.query);
    res.status(200).json({ response });
  })
);

route.put(
  "/update_password",
  auth,
  asyncHandler(async (req, res, next) => {
    const response = await adminAuthService.updatepassword(
      req.admin._id,
      req.body.password
    );
    res.status(200).json({ response });
  })
);
// sms

route.post(
  "/sms",
  auth,
  asyncHandler(async (req, res, next) => {
    let response = await adminService.sentMessage(req.body, req.admin._id);
    res.status(200).json({ response });
  })
);

route.put(
  "/save_sms",
  auth,
  asyncHandler(async (req, res, next) => {
    const { message, amount, commision } = req.body;
    let response = await MessageModel.findOneAndUpdate(
      { admin: req.admin._id },
      {
        message,
        amount,
        commision
      },
      {
        new: true,
      }
    );

    res.status(200).json({ response });
  })
);

route.post(
  "/test_create_msg",
  asyncHandler(async (req, res, next) => {
    const { message, workerRecent } = req.body;
    let data = await MessageModel.create({
      message,
      dateRecent: moment(),
      workerRecent,
    });
    res.status(200).json({ data });
  })
);


route.get(
  "/getMessageSend",
  auth,
  asyncHandler(async (req, res, next) => {
    const {  msgSendData } = await adminService.getMessageData(req.admin._id);
    res.status(200).json({response :msgSendData})
  })
);


route.post(
  "/forgotpassword",
  asyncHandler(async (req, res, next) => {
    const response = await adminAuthService.forgotpassword(req.body);
    res.status(200).json({response})
  })
);

route.post(
  "/newgotpassword/:id/:token",
  asyncHandler(async (req, res, next) => {
    const {id,token}=req.params;
    const response = await adminAuthService.resetpassword(id,token,req.body);
    res.status(200).json({response})
  })
);


route.get(
  "/getChartdata",
  auth,
  async (req, res, next) => {
      try{
        let {from,to}=fromTo("year");

       let data= await  MessageSendModel.find({
          messageDate:{
            $gte:to,
            $lt:from
          }
         }) 
        res.status(200).json({data})
      } 
      catch(error){
        console.log(error)
        res.status(400).json({error})
      }  
  }
);


module.exports = route;
