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

  app.route("/products")
    .get((req, res) => {
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

  app.route("/products/add-new-product")
    .post(
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

  app.route("/products/:productTitle")
    .get(
      (req, res) => {
        queryStr = req.params.productTitle;
        keyStr = queryStr.split("=")
        if (keyStr[0] == "limit") {
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

                // res.send({
                //   data: foundProducts,
                //   total: foundProducts.length
                // });
              } else {
                res.status(502).send({
                  Error: 502,
                  Message: "Bad Gateway",
                  Description: "Couldnot connect to database"
                })
              }
            })
            .limit(Number(keyStr[1]))
          return;
        }
        Product.findOne({
          title: req.params.productTitle
        }, (err, foundProduct) => {
          if (foundProduct) {
            res.send(foundProduct);
          } else {
            res.send("No such product fonund: " + req.params.productTitle);
          }
        });
      }
    )

    .put(
      body('title').exists({
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
        const query = {
          title: req.params.productTitle
        };
        const update = {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description
        };

        Product.findOneAndUpdate(query, update, {
          new: true
        }, function(err, doc) {
          if (err) {
            res.send(500, {
              error: err
            });
          } else {
            res.send('Succesfully Updated.');
            console.log(req.body);
          }
        })
      })

    .delete(
      (req, res) => {
        console.log("Deleting...");
        Product.deleteOne({
            title: req.params.productTitle
          },
          function(err) {
            if (!err) {
              res.send("Deleted successfully");
            } else {
              res.status(502).send({
                Error: 502,
                Message: "Bad Gateway",
                Description: "Couldnot connect to database"
              })
            }
          });
      }
    )
}
