simple-rest-api task

Farzan Khan at CodeFreaks

API is able to handle requests below:-


GET: localhost:3000/products

GET: localhost:3000/products?limit="limit"

GET: localhost:3000/products?title="title of product you want to search"

POST: localhost:3000/products/add-new-product (body must carry keys and values, for title, price)

PUT: localhost:3000/update?title="title of record/product you want to update" (body must carry keys and values, for title, price)

DELETE: localhost:3000/delete?title="title of record/product you want to delete"
