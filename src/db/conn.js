const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/friendsList", {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected with database");
  })
  .catch((err) => {
    console.log(err);
  });
