const { Book } = require('../models')

const resolvers = {
    Query: {
        books: () => {
            return Book.find().sort({ bookId: -1 });
        }
    }
}


module.exports = resolvers;