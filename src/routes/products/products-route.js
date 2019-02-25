const url = require("url");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const getId = url => {
  const lastIndex = url.lastIndexOf("/");
  const id = Number(url.slice(lastIndex + 1));
  return id;
};

const productsRoute = (request, response) => {
  const filePath = path.join(
    __dirname,
    "../../",
    "db/products",
    "all-products.json"
  );

  const productsJson = fs.readFileSync(filePath, "utf8");
  const products = JSON.parse(productsJson);
  const parsedUrl = url.parse(request.url);
  const id = getId(parsedUrl.path);
  const qs = querystring.parse(parsedUrl.query);
  console.log(qs);
  if (qs.category) {
    const productByCategory = products.filter(
      product => product.categories[0] === qs.category
    );

    const productByCategoryJson =
      productByCategory.length !== 0
        ? JSON.stringify({
            status: "success",
            productByCategory: productByCategory
          })
        : JSON.stringify({
            status: "no categories",
            products: []
          });

    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(productByCategoryJson);
    response.end();
  } else if (qs.ids) {
    const ids = qs.ids.split(",").map(product => Number(product));
    const productsByIds = products.filter(product => ids.includes(product.id));
    const productsByIdsJson =
      productsByIds.length !== 0
        ? JSON.stringify({
            status: "success",
            productsByIds: productsByIds
          })
        : JSON.stringify({
            status: "no products",
            products: []
          });
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(productsByIdsJson);
    response.end();
  } else if (!Number.isNaN(id) && typeof id === "number") {
    const productById = products.find(product => product.id === id);
    const productByIdJson =
      productById !== undefined
        ? JSON.stringify({
            status: "success",
            productById: productById
          })
        : JSON.stringify({
            status: "no products",
            products: []
          });

    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(productByIdJson);
    response.end();
  } else {
    response.writeHead(200, {
      "Content-Type": "application/json"
    });
    response.write(
      JSON.stringify({
        status: "success",
        products: products
      })
    );
    response.end();
  }
};

module.exports = productsRoute;
