const { gql } = require('apollo-server-express'); 

const typeDefs = gql`

  type Book {
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInfo {
    authors: [String]
    description: String
    title: String
    bookId: ID
    image: String
    link: String
  }
  
  type Query {
    me: User
  }

  
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(newEntry: BookInfo!): User
    removeBook(bookId: ID!): User
  }
`;


module.exports = typeDefs;