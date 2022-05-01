//paquetes externos

const express = require("express")
const multer = require("multer")

//creación de variable app con express

const app = express()

//Seteo la plantilla

app.set('views', './view');
app.set('view engine', 'pug');

//Storage multer

const storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, "uploads")
  },
  filename:(req, file, cb)=>{
    cb(null, file)
  }
})

let upload = multer({storage})

//número de puerto

const PORT = process.env.PORT || 8080

//rutas

const tiendaRutas = require("./routes/tienda")
const carritoRutas = require("./routes/carrito")
const informacionRutas = require("./routes/informacion");

//JSON

app.use(express.json())
app.use(express.urlencoded({decode:false}))

//ruta estática

app.use("/api/productosinicio", express.static("public")) 

//declarando las rutas correspondientes

app.use("/api", tiendaRutas);
app.use("/api", carritoRutas);
app.use("/api", informacionRutas);

//rutas principales

try {
  app.listen(PORT, ()=>{
    console.log("en funcionamiento.")
  })
} catch (error) {
  console.log("Se produjo el error:" + error);
}


app.get("/api/productosinicio", (req, res) => {
    res.render("index");
  })


//tienda
const Contenedor = require("./classes/contenedor.class");  
const nuevoArchivo = new Contenedor("./productos.json");

//todos los productos

app.get("/api/productosinicio/getAll", (req, res)=>{
  res.render("productsPage", {data: nuevoArchivo.getAll()});
}) 
  
//guardar productos

app.get("/api/productosinicio/formulario", (req, res)=>{
  res.render("formPage", {guardado: false, data: nuevoArchivo.getAll(), eliminar: nuevoArchivo.deleteById()})
})

app.post("/api/productosinicio/formulario", (req, res)=>{
  nuevoArchivo.save(req.body)
  res.render("formPage", {guardado: true, data: nuevoArchivo.getAll(), eliminar: nuevoArchivo.deleteById()})
})
