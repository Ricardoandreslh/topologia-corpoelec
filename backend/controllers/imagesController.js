const Images = require('../models/images');
const path = require('path');
const fs = require('fs');

async function uploadImage(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Archivo requerido' });
    const file = req.file;
    const data = {
      file_name: file.originalname,
      mime_type: file.mimetype,
      size_bytes: file.size,
      path: file.path.replace(/\\/g, '/') // Normalizar path
    };
    const result = await Images.createImage(data);
    return res.status(201).json({ id: result.id, ...data });
  } catch (err) {
    console.error('images.upload error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function getImage(req, res) {
  try {
    const id = req.params.id;
    const image = await Images.getImageById(id);
    if (!image) return res.status(404).json({ error: 'Imagen no encontrada' });
    const filePath = path.resolve(image.path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'Archivo no existe' });
    res.setHeader('Content-Type', image.mime_type);
    res.sendFile(filePath);
  } catch (err) {
    console.error('images.get error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

async function deleteImage(req, res) {
  try {
    const id = req.params.id;
    const image = await Images.getImageById(id);
    if (!image) return res.status(404).json({ error: 'No encontrada' });
    fs.unlinkSync(image.path); // Borrar archivo físico
    await Images.deleteImage(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error('images.delete error', err);
    return res.status(500).json({ error: 'Error interno' });
  }
}

module.exports = { uploadImage, getImage, deleteImage };
