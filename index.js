const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemp = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORAGANIC%}/g, "not-organic");
  }
  return output;
};

const tempOver = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// CREATING SERVER //

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url, true));

  const { query, pathname } = url.parse(req.url, true);
  //OVERVIEW
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const cardsHtml = dataObj.map((el) => replaceTemp(tempCard, el));
    const output = tempOver.replace("{%product_cards%}", cardsHtml);
    res.end(output);
  }
  //PRODUCT
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    res.end(output);
  }

  //API
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  }
  //NOT FOUND
  else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>Page not Found!!!</h1>");
  }
});

server.listen(8002, "127.0.0.1", () => {
  console.log("listening to the port");
});

//********synchronus way*******//

// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");

// console.log(textIn);

// const textOut = `the text we get is ${textIn} \n created on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);

//********Asynchronus way!!!!!!]*******//

// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(
//         "./txt/final.txt",
//         `your final is ${data3}\n${data3}`,
//         "utf-8",
//         (err) => {
//           console.log("printed");
//         }
//       );
//     });
//   });
// });
// console.log("reading data");
