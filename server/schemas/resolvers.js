const {User } = require('../models')
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth');



const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    .select('-__v -password')
                    .populate('books')
                    console.log("User data",userData)
                return userData;
            }

            throw new AuthenticationError(`You're not logged in!`);
        },
    },

    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Not found');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { newEntry }, context) => {
            console.log(context,context.user, context.data, "Saved Book")
            if (context) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.data.user._id },
                    { $addToSet: { savedBooks: newEntry } },
                    { new: true }
                    );
                    return updatedUser;
                }
            throw new AuthenticationError(`You're not logged in!`);
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.data.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError(`You're not logged in!`);
        },
    },

}


module.exports = resolvers;