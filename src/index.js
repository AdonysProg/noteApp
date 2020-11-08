const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const app = express();
const port = process.env.PORT || 4000;

//GraphQL consiste en Schemas y Resolvers.
//Static data
let notes = [
  { id: '1', content: 'Esto es una nota', autor: 'AdonysM' },
  { id: '2', content: 'Esto es una nota', autor: 'JoseM' },
  { id: '3', content: 'Esto es una nota', autor: 'Lmao' },
];
// Este es un Schema en GraphQL
const typeDefs = gql`
  type Query {
    notas: [Nota!]
    nota(id: ID!): Nota!
  }
  type Nota {
    id: ID!
    content: String!
    autor: String!
  }
  type Mutation {
    newNote(content: String!): Nota!
  }
`;

const resolvers = {
  Query: {
    notas: () => notes,
    nota: (parent, args) => {
      return notes.find((note) => note.id === args.id);
    },
  },
  Mutation: {
    newNote: (parent, args) => {
      let noteValue = {
        id: String(notes.length + 1),
        content: args.content,
        autor: 'Adonys M',
      };
      notes.push(noteValue);
      return noteValue;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/api' });

app.get('/', (req, res) => res.send('Holis'));

app.listen(port, () =>
  console.log(
    `El server de GraphQL esta corriendo en el puerto ${port}${server.graphqlPath}`
  )
);
