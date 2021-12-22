const express = require("express")
const bodyParser = require("body-parser")
// const mongoose = require("mongoose")
const app = express();
// app.use(express.json());

app.use(bodyParser.json({
  limit: "50mb",
  extended: true
}));
app.use(express.static("public"));


require('./routes/routes.js')(app);


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
// app.listen(port);
app.listen(port, function() {
  console.log("Server Started successfully.. on heroku/local Port: " + port)
});
