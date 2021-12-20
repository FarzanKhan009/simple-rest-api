const express = require("express")
const bodyParser = require("body-parser")
// const mongoose = require("mongoose")
const app = express();
// app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


require('./routes/routes.js')(app);
app.listen(3000, function() {
  console.log("Server Started on Port 3000")
});
