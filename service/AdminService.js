const moment = require("moment");
let {v4:uuid} =require("uuid")
class adminService {
  constructor({
    WorkerModel,
    MessageService,
    AdminModel,
    MessageModel,
    MessageSendModel,
  }) {
    this.WorkerModel = WorkerModel;
    this.MessageService = MessageService;
    this.AdminModel = AdminModel;
    this.MessageModel = MessageModel;
    this.MessageSendModel = MessageSendModel;
  }

  _toJSON(worker) {
    const workerObj = worker.toObject();
    return workerObj;
  }

  async getAllWorker() {
    const allWorker = await this.WorkerModel.find({});
    return { allWorker: allWorker };
  }

  async addWorker({
    fname,
    lname,
    email,
    phone,
    state,
    country,
    pin,
    city_village,
    work_type,
    exp,
    start,
    addressarea,
    houseno,
    specialization,
  }) {
    const workersave = await this.WorkerModel.create({
      fname,
      lname,
      email,
      phone,
      work_type,
      specialization,
      working_status: {
        start: start,
        exp: exp,
      },
      address: {
        country: country,
        state: state,
        city_village: city_village,
        pin: pin,
        houseno: houseno,
        addressarea: addressarea,
      },
    });

    return { worker: this._toJSON(workersave) };
  }

  async OneWorker(id) {
    const worker = await this.WorkerModel.findById(id);
    const data = await this.MessageSendModel.find({});
    const worker_history = data.filter((x) => x.sendTo._id == id);
    worker.password = undefined;
    return { worker: worker, worker_history: worker_history };
  }

  async deleteById(id) {
    const workerdelete = await this.WorkerModel.findByIdAndDelete(id);

    return { workerdelete: workerdelete };
  }

  async deleteSelectedId(ids) {
    const workersdelete = await this.WorkerModel.deleteMany({ _id: ids });
    const workers = await this.WorkerModel.find({});
    return { workersdelete, workers };
  }

  async editById(
    {
      fname,
      lname,
      email,
      phone,
      work_type,
      specialization,
      exp,
      country,
      state,
      city_village,
      pin,
      houseno,
      addressarea,
      id
    }
  ) {
    

     await this.WorkerModel.findByIdAndUpdate(
      id,
      {
        fname,
        lname,
        email,
        phone,
        work_type,
        specialization,
        working_status: {
          exp: exp,
        },
        address: {
          country: country,
          state: state,
          city_village: city_village,
          pin: pin,
          houseno: houseno,
          addressarea: addressarea,
        },
      },
      {
        new: true,
      }
    );
    const workerupdate = this.WorkerModel.findById(id)
     return workerupdate;
  }
  async search(query, parameter) {
    let searchPattern = new RegExp("^" + query);

    if (parameter === "uniqueId") {
      let result = await this.WorkerModel.find({
        uniqueId: { $regex: searchPattern, $options: "i" },
      });
      return result;
    } else if (parameter === "fname") {
      let result = await this.WorkerModel.find({
        fname: { $regex: searchPattern },
      });
      return result;
    }
  }
  async searchPay(query) {
    let searchPattern = new RegExp(query, "i");

    let result = await this.MessageSendModel.find({});
    let data = result.filter((x) => x.sendTo.fname.match(searchPattern));
    
    return data;
  }

  async sentMessage(params, admin) {
    let { worker, message, commision, amount, tot, recieved } = params;
    let { phone } = await this.WorkerModel.findById(worker);

    let res = await this.MessageService.sendMessage(message, phone);
    // let res=true
    let workerDetails = await this.WorkerModel.findById(worker);
    if (res.return) {
      let msgData = await this.MessageModel.findOneAndUpdate(
        { admin: admin },
        { workerRecent: workerDetails, dateRecent: moment() },
        { new: true }
      );
      await this.MessageSendModel.create({
        messageId: res.request_id,
        rate: commision,
        amountTot: amount,
        amountRecieved: recieved,
        messageDate: moment(),
        sendTo: workerDetails,
      });
      let msgSendData = await this.MessageSendModel.find({});

      let totProfit = tot + (amount - recieved);

      let adminnew = await this.AdminModel.findByIdAndUpdate(
        admin,
        { profit: totProfit },
        { new: true }
      );
      return { res, msgData, msgSendData, admin: adminnew };
    } else {
      const err = new Error("Unable to send message. Phone no. may be invalid or sms service error");
      err.statusCode = 400;
      err.name = "Service or phone no";
      throw err;
    }
  }

  async getMessageData(id) {
    
    let msgdata = await this.MessageModel.find({ admin: id });
    let msgSendData = await this.MessageSendModel.find({});
    
    return { msgdata, msgSendData };
  }
  
}



module.exports = adminService;
