const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Servir archivos estáticos desde el directorio 'public'

// Ruta principal que sirve el index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta para crear un archivo
app.get("/create", (req, res) => {
  const { filename, content } = req.query;
  if (!filename || !content) {
    return res.send("Faltan parámetros: filename y content son requeridos.");
  }
  const date = new Date();
  const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
  const data = `${formattedDate}\n${content}`;

  fs.writeFile(path.join(__dirname, "public", filename), data, (err) => {
    if (err) {
      return res.send("Error al crear el archivo.");
    }
    res.send("Archivo creado con éxito.");
  });
});

// Ruta para leer el contenido de un archivo
app.get("/read", (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.send("Falta el parámetro: filename es requerido.");
  }
  fs.readFile(path.join(__dirname, "public", filename), "utf8", (err, data) => {
    if (err) {
      return res.send("Error al leer el archivo.");
    }
    res.send(data);
  });
});

// Ruta para renombrar un archivo
app.get("/rename", (req, res) => {
  const { oldFilename, newFilename } = req.query;
  if (!oldFilename || !newFilename) {
    return res.send(
      "Faltan parámetros: oldFilename y newFilename son requeridos."
    );
  }
  fs.rename(
    path.join(__dirname, "public", oldFilename),
    path.join(__dirname, "public", newFilename),
    (err) => {
      if (err) {
        return res.send("Error al renombrar el archivo.");
      }
      res.send(
        `Archivo renombrado de ${oldFilename} a ${newFilename} con éxito.`
      );
    }
  );
});

// Ruta para eliminar un archivo
app.get("/delete", (req, res) => {
  const { filename } = req.query;
  if (!filename) {
    return res.send("Falta el parámetro: filename es requerido.");
  }
  fs.unlink(path.join(__dirname, "public", filename), (err) => {
    if (err) {
      return res.send("Error al eliminar el archivo.");
    }
    res.send("Archivo eliminado con éxito.");
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
