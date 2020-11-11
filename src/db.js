// Mongoose para la base de datos
const mongoose = require('mongoose');

module.exports = {
  connect: (DB_HOST) => {

    // NOTA: Esto se hace porque en mongoose existen algunas funciones que no son optimas y existen estas que son mejores y cumplen sus funciones.
    // Usar el Driver de mongo para actualizar el URL string parser
    mongoose.set('useNewUrlParser', true);
    // Usar findOneAndModify en vez de findAndModify 
    mongoose.set('useFindAndModify', false);
    // Usar createIndex en vez de ensureIndex
    mongoose.set('useCreateIndex', true);
    // Usar el nuevo engine de discovery and monitoring para el server
    mongoose.set('useUnifiedTopology', true);
    // Conectarse a la base de datos
    mongoose.connect(DB_HOST);
    // Si ocurre un error al conectarse dar un Log
    mongoose.connection.on('error', (err) => {
      console.error(err);
      console.log(
        'Ha ocurrido un error con la conexion de MongoDB. Asegurate de que esta corriendo.'
      );
      process.exit();
    });
  },
  // Cerrar el servidor
  close: () => {
    mongoose.connection.close();
  },
};
