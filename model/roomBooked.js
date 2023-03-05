const mongoose = require("mongoose");

const roomBooked = new mongoose.Schema(
  {
    type: String,
    sdate: Date,
    edate: Date,
    adults: Number,
    children: Number,
  },
  {
    collection: "room_booked",
  }
);

mongoose.model("room_booked", roomBooked);
