// models/Link.js
const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    ip: String,
    userAgent: String,
    referrer: String,
  },
  { _id: false }
);

const LinkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, required: true, index: true, unique: true },
  clicks: { type: Number, default: 0 },
  clicksData: { type: [ClickSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
  lastAccessedAt: { type: Date },
});

module.exports = mongoose.model("LINK", LinkSchema);
