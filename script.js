const yargs = require('yargs');
const Jimp = require('jimp');
const fs = require('fs').promises; // promises para ocupar await async
const http = require('http');
const url = require('url');

const PORT = 3002;
const KEY_SERVER = 123;

const loadServer = () => { // se creo funcion para que no se ejecute antes de yargs
  http
  .createServer(async (req, res) =>{
    const urlCase = req.url.split('?')[0]

    switch(urlCase) {
      case '/style.css':
        await StaticFiles(req, res, './style.css');
        break;
      case '/':
        await HomePage(req, res);
        break;
      case '/new-image':
        await ImagePage(req, res);
        break;
      default: 
        await ErrorPage(req, res);
    }
  })
  .listen(PORT, () =>
    console.log(`servidor corriendo http://localhost:${PORT}`)
  );
}


const argv = yargs
  .command('acceso' , 'Contraseña', {
    key: {
      describe: 'Clave para iniciar la app',
      demand: true,
      alias: 'k'
    }
  }, ({ key }) => {
    if (key === KEY_SERVER) loadServer()
    else console.log('Debe ingresar la clave valida')
  })
  .help().argv

//lee archivo html
const HomePage = async (req, res) => {
  const pageHTML = await fs.readFile('./index.html');
  res.writeHeader(200, {"Content-Type": "text/html"});  
  res.write(pageHTML);  
  res.end(); 
}

//error
const ErrorPage = async (req, res) => {
  res.writeHeader(404, {"Content-Type": "text/html"});  
  res.write(`<h1>Pagina no encontrada</h1>`);  
  res.end(); 
}

//estilo estatico .css
const StaticFiles = async (req, res, pathFile) => {
  const file = await fs.readFile(pathFile);
  res.writeHeader(200);  
  res.write(file);  
  res.end(); 
}

//funcion recibe imagen del form. procesa con jip, y la muestra
const ImagePage = async (req, res) => {
  const params = url.parse(req.url,true).query; // aca recibe los parametros

  if (req.method !== 'GET' || (!params || !params.fname)) { // valida los parametros
    res.writeHeader(200, {"Content-Type": "text/html"});  
    res.write(`<h1>Debe enviar la url de la imagen desde el formulario para procesarla</h1>`);  
    return res.end();
  }

  const nameImg = 'newImg.jpg' // proceso
  const newImg = await Jimp.read(params.fname);
  await newImg
    .resize(350, 'auto')
    .quality(60)
    .greyscale()
    .writeAsync(nameImg);

  const localImage = await fs.readFile(nameImg); // devuelve
  res.writeHeader(200, {"Content-Type": newImg.getMIME()});  // getmime formato del archico que devuelve 
  res.write(localImage);  
  res.end(); 
}