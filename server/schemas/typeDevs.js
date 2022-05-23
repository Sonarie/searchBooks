const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    bookcount: Number
    savedBooks: [Book]
  }

  type Book{
    bookId: ID
    authors: String
    description: String
    title: String
    image: img
    link: [Link]
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    me: User

  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(authors: String!, description: String!, title: String!, image: img!, link: [Link]): User
    removeBook(bookId: ID): User
  }
`;

module.exports = typeDefs;
