const mongoose = require("mongoose");

const bookedRooms = new mongoose.Schema(
  {
    rno: Number,
    type: String,
    beds: Number,
    sdate: Date,
    edate: Date,
  },
  {
    collection: "booked_rooms",
  }
);

mongoose.model("booked_rooms", bookedRooms);
