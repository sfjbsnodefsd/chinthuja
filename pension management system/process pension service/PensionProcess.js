const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PensionProcessSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = PensionProcess = mongoose.model("pensionprocess", PensionProcessSchema);