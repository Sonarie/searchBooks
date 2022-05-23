const { AuthenticationError } = require('apollo-server-express');
// import user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        async getSingleUser(parent, args, context) {
            const me = await User.findOne({
                _id:context.user._id
            });
        
            if (!me) {
             throw new AuthenticationError ( 'Cannot find a user with this id!');
            }
        
            return me
          },
    },
    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { Book }, context) => {
            console.log(context);
            if (context.user) {
                const save = new Save({ Book });

                await User.findByIdAndUpdate(context.user._id, { $push: { Book: Book } });

                return save;
            }
        },

        removeBook: async (parent, { Book }, context) => {
            if (context.Book) {
                return await User.findByIdAndDelete(context.user._id, Book, { new: true });
            }

            throw new AuthenticationError('Cannot find a book with this id!');
        },


    }
};

module.exports = resolvers;
