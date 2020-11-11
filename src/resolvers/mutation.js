const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError,
} = require('apollo-server-express');
require('dotenv').config();
const gravatar = require('../utils/gravatar');
const mongoose = require('mongoose');

module.exports = {
  newNote: async (parent, args, { models, user }) => {
    if (!user) {
      throw new AuthenticationError(
        'Debes de iniciar sesión para publicar una nota'
      );
    }
    return await models.Nota.create({
      content: args.content,
      autor: mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    //Si no hay un usuario throw el error
    if (!user) {
      throw new AuthenticationError(
        'Necesitas iniciar sesion para eliminar una nota.'
      );
    }
    //Encontrar la nota
    const nota = await models.Nota.findById(id);
    // Si el dueño de la nota y el usuario actual no es igual tira un ForbiddenError
    if (nota && String(nota.autor) !== user.id) {
      throw new ForbiddenError('No tienes permisos para eliminar esta nota.');
    }
    try {
      await nota.remove();
      return true;
    } catch (err) {
      return false;
    }
  },
  updateNote: async (parent, { content, id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError(
        'Debes iniciar sesion para actualizar una nota.'
      );
    }
    const nota = await models.Nota.findById(id);
    if (nota && String(nota.autor) !== user.id) {
      throw new ForbiddenError('No tienes permisos para actualizar esta nota.');
    }

    return await models.Nota.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          content,
        },
      },
      {
        new: true,
      }
    );
  },
  signUp: async (parent, { username, email, password }, { models }) => {
    //Nos encargamos de normalizar el correo
    email = email.trim().toLowerCase();
    //Hash la contraseña
    const hashed = await bcrypt.hash(password, 10);
    //Creamos el gravatar img url
    const avatar = gravatar(email);
    try {
      const user = await models.User.create({
        username,
        email,
        avatar,
        password: hashed,
      });

      //Crear y retornar el json web token
      return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    } catch (err) {
      console.error(err);
      throw new Error('Error creando la cuenta!');
    }
  },
  signIn: async (parent, { username, email, password }, { models }) => {
    if (email) {
      email = email.trim().toLowerCase();
    }

    const user = await models.User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      throw new AuthenticationError('Error al iniciar sesión');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AuthenticationError('Error al iniciar sesión (Contraseña)');
    }
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  },
  toggleFavorite: async (parent, { id }, { models, user }) => {
    if (!user) {
      throw new AuthenticationError('');
    }
    // Chequear si el usuario ya tiene una nota agregada a favoritos
    let notaCheck = await models.Nota.findById(id);
    const hasUser = notaCheck.favoritedBy.indexOf(user.id);
    if (hasUser >= 0) {
      return await models.Nota.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: -1,
          },
        },
        {
          new: true,
        }
      );
    } else {
      return await models.Nota.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id),
          },
          $inc: {
            favoriteCount: 1,
          },
        },
        {
          new: true,
        }
      );
    }
  },
};
