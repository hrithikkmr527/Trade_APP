const mongoose = require("mongoose");

const { MONGO_URI } = process.env;
mongoose.set("strictQuery", false);
exports.connect = () => {
  //connecting to the Database

  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("succesfully connected to the Database");
    })
    .catch((error) => {
      console.log("database connection failed. Exiting...");
      console.error(error);
      process.exit(1);
    });
};
