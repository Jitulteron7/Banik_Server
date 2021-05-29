let mongoose = require("mongoose");

let WorkerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
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
    city: { type: String },
    pin: { type: Number },
  },
  accout_id: { type: String },

  work_type: String,

  specialization: String,

  working_status: {
    start: {
      type: Date,
    },
    exp: {
      type: Date,
    },
  },
  photo:{
      type:Buffer
  }
});

const WorkerModel = mongoose.model("Worker", WorkerSchema);

module.exports = WorkerModel;
