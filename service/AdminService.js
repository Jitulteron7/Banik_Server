class adminService {
  constructor({ WorkerModel, MessageService }) {
    this.WorkerModel = WorkerModel;
    this.MessageService = MessageService;
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
    work_type,
    specialization,
    working_status,
    address,
  }) {
    const workersave = await this.WorkerModel.create({
      fname,
      lname,
      email,
      phone,
      work_type,
      specialization,
      working_status: {
        ...working_status,
      },
      address: {
        ...address,
      },
    });

    return { worker: this._toJSON(workersave) };
  }

  async OneWorker(id) {
    const worker = await this.WorkerModel.findById(id);
    worker.password=undefined;
    return { worker: worker };
  }



  async deleteById(id) {
    const workerdelete = await this.WorkerModel.findByIdAndDelete(id);

    return { workerdelete: workerdelete };
  }

  async deleteSelectedId(ids) {
    const workersdelete = await this.WorkerModel.deleteMany({ _id: ids });
    const workers = await this.WorkerModel.find({});
    return {workersdelete,workers };
  }

  async editById(
    id,
    {
      fname,
      lname,
      email,
      phone,
      work_type,
      specialization,
      working_status,
      address,
    }
  ) {
    const workerupdate = await this.WorkerModel.findByIdAndUpdate(id, {
      fname,
      lname,
      email,
      phone,
      work_type,
      specialization,
      working_status: {
        ...working_status,
      },
      address: {
        ...address,
      },
    });

    // return { workerupdate: this._toJSON(workerupdate) };
    console.log(work_type, "work_type");
    console.log(id, "id");
    return workerupdate;
  }
  async search(query,parameter){
    let searchPattern=new RegExp("^"+query);

    if(parameter==="uniqueId"){
      let result =await this.WorkerModel.find({uniqueId:{$regex:searchPattern,$options:"i"}})
      return result
    }
    else if (parameter==="fname"){
      let result =await this.WorkerModel.find({fname:{$regex:searchPattern}})
      return result
    }
    
  }
  async updateMessage(message) {

  }

  async sentMessage(params) {
    let res = await this.MessageService.sendMessage(params);
    return res;
  }
}

module.exports = adminService;
