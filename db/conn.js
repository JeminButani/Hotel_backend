const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "vatsal",
  })
  .then(() => {
    console.log("Connection Sucessfull");
  })
  .catch((e) => {
    console.log(e);
  });
