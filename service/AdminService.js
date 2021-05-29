
class adminService {

  constructor({ WorkerModel, MessageService }) {
    this.WorkerModel = WorkerModel;
    this.MessageService=MessageService
  }

  _toJSON(worker) {
    const workerObj = worker.toObject();
    return workerObj;
}

async getAllWorker() {
    
  const allWorker = await this.WorkerModel.find({});
  
  return {allWorker:this._toJSON(allWorker)};
}

  async addWorker(worker) {
    const workersave = await this.WorkerModel.create({
      ...worker,
    });

    return {worker:this._toJSON(workersave)};
  }
  async deleteById(id) {
    const workerdelete = await this.WorkerModel.findByIdAndDelete(id);

    return {workerdelete:this._toJSON(workerdelete)};
  }

  async editById(id,worker) {
      
    const workerupdate = await this.WorkerModel.findByIdAndUpdate(id,{...worker});
    
    return {workerupdate:this._toJSON(workerupdate)};
  }

  async updateMessage(message){

  }
  
  async sentMessage(params){
    let res=await this.MessageService.sendMessage(params)
    return res
  }

}

module.exports=adminService;