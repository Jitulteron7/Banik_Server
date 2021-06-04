let mongoose = require("mongoose");
let {v4:uuid} =require("uuid")

let WorkerSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname:{
    type: String,
    required: true,
  },
  uniqueId:{
    type:String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  address: {
    country: { type: String },
    state: { type: String },
    city_village: { type: String },
    pin: { type: Number },
    houseno: { type: Number },
    addressarea:{type:String}

  },
  work_type: String,

  specialization: String,

  working_status: {
    start:{
      type: Date,
    },
    exp: {
      type: String,
      deault:0,
    },
  },
  photo:{
      type:Buffer
  },
});

WorkerSchema.pre("save", async function (next) {
  var worker = this;
  if (worker.isModified("fname")) {
    worker.uniqueId = `${worker.fname[0]}${worker.lname[0]}_${uuid().substring(0,3)}`
  }
  next();
});


const WorkerModel = mongoose.model("Worker", WorkerSchema);
module.exports = WorkerModel;

