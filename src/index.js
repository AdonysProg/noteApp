const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet'); // Helmet es un package de seguridad que se implementa en el middleware.
const cors = require('cors');
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
require('dotenv').config();

// Imports locales
const db = require('./db');
const models = require('./models');
//GraphQL consiste en Schemas y Resolvers.
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Ponemos el puerto que esta en el .env o usamos el puerto 4000.
const port = process.env.PORT || 4000;
// Guardamos el DB_HOST que esta en .env en una variable.
const DB_HOST = process.env.DB_HOST;

const app = express();
app.use(helmet());
app.use(cors());

// Conexion de la db
db.connect(DB_HOST);

// get the user info from a JWT
const getUser = (token) => {
  if (token) {
    try {
      // return the user information from the token
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // if there's a problem with the token, throw an error
      throw new Error('Session invalid');
    }
  }
};

//Setup al server de Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  context: ({ req }) => {
    // Coger el token que esta en los headers (Este viene de jwt.sign)
    const token = req.headers.authorization;
    // getUser usando el token obtenido
    const user = getUser(token);
    // Agregar el db models y user al contexto
    return { models, user };
  },
});

server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Holis'));

app.listen(port, () =>
  console.log(
    `El server de GraphQL esta corriendo en el puerto ${port}${server.graphqlPath}`
  )
);
