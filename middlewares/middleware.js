const Product = require('../models/product-model.js');
var totalProducts = 0;
function getTotal(){
  return totalProducts;
}

// var query = Product.find().count((err, count)=>{
//   if(!err){
//     console.log(count);
//   }
// })
// console.log(query);

var query = Product.find()
query.count(function(err, count) {
  if (err) {
    console.log(err)
  } else {
    console.log("Total Records Found: " + count);
    totalProducts = count;
  }
});

function postLimit(req, res, next) {
  if (getTotal() < 6) {
    console.log(req.body);
    next();
  } else {
    console.log("Total products reached 5, cant add anymore: \n" + req.body);
    res.status(429).send({
      Error: 429,
      Message: "Too Many Requests"
    })
  }
}

module.exports.postLimit = postLimit;
module.exports.totalProducts = totalProducts;
