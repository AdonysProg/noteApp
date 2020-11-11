// Necesitamos la libreria de mongoose
const mongoose = require('mongoose');
// Definir el schema de la tabla
const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    autor: {
      type: String,
      required: true,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    favoritedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Definir el modelo de la Nota con el Schema
const Nota = mongoose.model('Nota', noteSchema);

// Exportamos el modulo
module.exports = Nota;
