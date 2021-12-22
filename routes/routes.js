module.exports = (app) => {
  const {
    body,
    validationResult
  } = require('express-validator');


  const Product = require('../models/product-model.js');
  let {
    postLimit,
    totalProducts
  } = require('../middlewares/middleware.js');
  console.log(totalProducts);

  app.get("/", (req, res) => {
    res.send(`
          <div>
          <h3>simple - rest - api task</h3>
          <br>
          <h4>Farzan Khan at CodeFreaks</h4>
          <br><br>
          <p>API is able to handle requests below: -
          <br><br>
          GET: localhost:3000/products
          <br><br>
          GET: localhost:3000/products?limit="limit"
          <br><br>
          GET: localhost:3000/products?title="title of product you want to search"
          <br><br>
          POST: localhost:3000/products/add-new-product (body must carry keys and values, for title, price)
          <br><br>
          PUT: localhost:3000/update?title="title of record/product you want to update" (body must carry keys and values, for title, price)
          <br><br>
          DELETE: localhost:3000/delete?title="title of record/product you want to delete"
          </p>
          </div>
        `)
  })


  app.get("/products", (req, res) => {

    //dealing with limit
    if (req.query.limit != null) {
      var limit = Number(req.query.limit);
      Product.find((err, foundProducts) => {
          if (!err) {
            //just adding it for the sack of corection until new loic is developed, total count being problem
            Product.find().count(function(err, count) {
              if (!err) {
                res.send({
                  data: foundProducts,
                  total: count
                });
              }
            });
            // console.log("value of total in get: ",totalProducts);
            // res.send({
            //   data: foundProducts,
            //   total: totalProducts
            // });
          } else {
            res.status(502).send({
              Error: 502,
              Message: "Bad Gateway",
              Description: "Couldnot connect to database"
            })
          }
        })
        .limit(limit)
      //finally return if limit is applied in params
      return;
    } else if (req.query.title != null) {
      //dealing with title being searched

      var queryTitle = String(req.query.title)
      Product.findOne({
        title: queryTitle
      }, (err, foundProduct) => {
        if (foundProduct) {
          res.send(foundProduct);
        } else {
          res.send("No such product fonund: " + req.params.productTitle);
        }
      });
      //finally return if titled is searched in params
      return;
    }

    // in case there is no limit or no title is being searched
    Product.find((err, foundProducts) => {
      if (!err) {
        res.send({
          data: foundProducts,
          total: foundProducts.length
        });
      } else {
        res.status(404).send('Not Found');
      }
    })
  })

  app.post("/add-new-product",
    body('title').exists({
      checkFalsy: true
    }),
    body('price').exists({
      checkFalsy: true
    }),
    postLimit,
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
      const newProduct = new Product({
        title: req.body.title,
        price: req.body.price,
        description: req.body.description
      });

      newProduct.save((err) => {
        if (!err) {
          console.log("New Record Added")
          // console.log(req.body);
          res.send("Successfully added the new product");
        } else {
          return res.status(502).send({
            Error: 502,
            Message: "Bad Gateway",
            Description: "Couldnot connect to database"
          })
          // res.send(err);
        }
      });
    }
  )

  app.put("/update", body('title').exists({
      checkFalsy: true
    }),
    body('price').exists({
      checkFalsy: true
    }),
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
      if (req.query.title != null) {
        var queryTitle = req.query.title
        const query = {
          title: queryTitle
        };
        const update = {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description
        };

        Product.findOneAndUpdate(query, update, {
          new: true
        }, function(err, modified) {
          if (err) {
            res.send(500, {
              error: err,
            });
          } else if (modified == null) {
            res.status(404).send({
              error: "Not Found",
              msg: "No document is found with the name=" + queryTitle + " to update, check params"
            });
          } else {
            res.send('Succesfully Updated.');
            console.log(req.body);
          }
        })
      } else {
        res.status(400).send({
          err: "Missing parameter",
          msg: "Parameter title is missing for the intended product"
        })
      }
    })

  app.delete("/delete", (req, res) => {
    console.log("Deleting...");
    if (req.query.title != null) {
      var queryTitle = req.query.title
      const query = {
        title: queryTitle
      };
      Product.deleteOne({
          title: queryTitle
        },
        function(err, result) {
          if (err) {
            res.status(502).send({
              Error: 502,
              Message: "Bad Gateway",
              Description: "Couldnot connect to database"
            })
          } else if (result.deletedCount == 0) {
            res.status(404).send({
              error: "Not Found",
              msg: "No document is found with the name=" + queryTitle + " to delete, check params"
            });
          } else {
            console.log(result);
            res.send("Deleted successfully");
          }
        });
    } else {
      res.status(400).send({
        err: "Missing parameter",
        msg: "Parameter title is missing for the intended product"
      })
    }
  })

}
