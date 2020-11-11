const Query = require('./query');
const Mutation = require('./mutation');
const Nota = require('./nota');
const User = require('./user');
const { GraphQLDateTime } = require('graphql-iso-date');
module.exports = {
  Query,
  Mutation,
  Nota,
  User,
  DateTime: GraphQLDateTime,
};
