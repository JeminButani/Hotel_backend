const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

// db connection
require("./db/conn");

// schema
require("./model/bookedRooms");
require("./model/availableRooms");

const app = express();

const booked_rooms = mongoose.model("booked_rooms");
const available_rooms = mongoose.model("available_rooms");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = 5000;

// to get all the data
app.get("/totalrooms", async (req, res) => {
  try {
    const allRooms = [];
    const available = await available_rooms.find({});
    const booked = await booked_rooms.find({});
    available.forEach((e) => {
      allRooms.push(e);
    });
    booked.forEach((e) => {
      allRooms.push(e);
    });

    res.send({ status: "ok", data: allRooms });
  } catch (e) {
    console.log(e);
  }
});

// get the filtered data
app.post("/findRooms", async (req, res) => {
  const type = String(req.body.type);
  const beds = Number(req.body.beds);
  const date = new Date(req.body.date);

  const availableRooms = [];

  const booked = await booked_rooms.find({
    $or: [{ sdate: { $lte: date } }, { edate: { $gte: date } }],
    type: type,
    beds: beds,
  });

  const available = await available_rooms.find({ type: type, beds: beds });
  available.forEach((e) => {
    availableRooms.push(e);
  });
  booked.forEach((e) => {
    availableRooms.push(e);
  });

  res.send("Rooms - " + availableRooms);
});

// temp for adding data to the booked rooms for testing
// app.post("/addData", async (req, res) => {
//   const rno = Number(req.body.rno);
//   const type = String(req.body.type);
//   const beds = Number(req.body.beds);
//   const sdate = new Date(req.body.sdate);
//   const edate = new Date(req.body.edate);

//   const result = await booked_rooms.create({
//     rno: rno,
//     type: type,
//     beds: beds,
//     sdate: sdate,
//     edate: edate,
//   });

//   res.send("Room =>" + result);
// });

// temp for adding data to the available rooms for testing
// app.post("/addDataAvailable", async (req, res) => {
//   const rno = Number(req.body.rno);
//   const type = String(req.body.type);
//   const beds = Number(req.body.beds);

//   const result = await available_rooms.create({
//     rno: rno,
//     type: type,
//     beds: beds,
//   });

//   res.send("Room =>" + result);
// });

app.listen(port, () => {
  console.log(`server Is Live at http://127.0.0.1:${port}`);
});
