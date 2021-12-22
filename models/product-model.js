const mongoose = require("mongoose")

//local
// mongoose.connect("mongodb://localhost:27017/productsdb", {
//   useNewUrlParser: true
// });

//cloud
mongoose.connect("mongodb+srv://admin-farzan:test1234@cluster0.vkw29.mongodb.net/productsdb?retryWrites=true&w=majority", {
  useNewUrlParser: true
});
//connection url
// mongodb+srv://admin-farzan:<password>@cluster0.vkw29.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const productsSchema = {
  title: String,
  price: Number,
  description: String
};

module.exports = mongoose.model("Product", productsSchema);
