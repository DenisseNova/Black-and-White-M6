const yargs = require('yargs');
const Jimp = require('jimp');
const fs = require('fs');
const http = require('http');


http
  .createServer((req, res) =>{
    res.writeHead(200, { "Content-Type": "text/html" })
    res.end(`<img src="https://www.google.com/search?q=marihuana&client=opera&hs=5jg&sxsrf=AOaemvK_MuqPX5SkktYvqWfEcGA6-N-YCQ:1633093873723&source=lnms&tbm=isch&sa=X&ved=2ahUKEwig-ujhpKnzAhW0G7kGHflHBd8Q_AUoAXoECAIQAw&biw=1240&bih=614&dpr=1#imgrc=ukelEu24Bgb16M" style="style="width:600px"`)
  })
  .listen(3002, () =>
    console.log("servidor corriendo")
  );

const argv = yargs
  .command( 'imagen' , 'descripción', 'constructor', 'callback')