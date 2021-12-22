const Product = require('../models/product-model.js');
var totalProducts;
async function getTotal(){
  total= await Product.countDocuments({});
  return total;
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

async function postLimit(req, res, next) {
  totalProducts =await getTotal();
  // totalProducts= total;
  if (totalProducts < 5) {
    next();
  } else {
    console.log("Total products reached 5");
    res.status(429).send({
      Error: 429,
      Message: "Too Many Requests"
    })
  }
}

module.exports.postLimit = postLimit;
module.exports.totalProducts = totalProducts;
