const mongoose = require("mongoose");
const app = require("../../app");
const dotenv = require("dotenv");

dotenv.config();

const port = 5000;

const mongoURI = "mongodb://localhost:27017/" + "authTesting";

//connect to DB before running tests
before((done) => {
  // start the server
  app.listen(port, () => {
    console.log(`App Listening at ${port}....`);
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    mongoose.connection
      .once("open", () => {
        console.log("Connected to database.....");
        done();
      })
      .on("connectionError", (err) => {
        console.log(err);
      });
  });
});

//drop the databsae
after((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose
      .disconnect()
      .then(() => done())
      .catch((err) => console.log(err));
  });
});
