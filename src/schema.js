const { gql } = require('apollo-server-express');

// Este es un Schema en GraphQL
module.exports = gql`
  scalar DateTime
  type Query {
    notas: [Nota!]
    nota(id: ID!): Nota!
    user(username: String!): User
    users: [User!]!
    me: User!
    noteFeed(cursor: String): NoteFeed
  }
  type Nota {
    id: ID!
    content: String!
    autor: User!
    createdAt: DateTime!
    updatedAt: DateTime!
    favoriteCount: Int!
    favoritedBy: [User!]!
  }
  type User {
    id: ID!
    username: String!
    email: String!
    avatar: String!
    notas: [Nota!]!
    favorites: [Nota!]!
  }
  type Mutation {
    newNote(content: String!): Nota!
    updateNote(id: ID!, content: String!): Nota!
    deleteNote(id: ID!): Boolean!
    signUp(username: String!, email: String!, password: String!): String!
    signIn(username: String!, email: String!, password: String!): String!
    toggleFavorite(id: ID!): Nota!

  }
  type NoteFeed{
    notas:[Nota]!
    cursor: String!
    hasNextPage: Boolean!
  }
`;
