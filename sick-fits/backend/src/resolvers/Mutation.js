const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// These are the mutation resolvers - the implementation of the mutations on the BE
const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO - check if logged in

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },

  updateItem(parent, args, ctx, info) {
    // TODO - check if logged in

    const updates = {
      ...args
    };
    delete updates.id;
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. find the item
    const item = await ctx.db.query.item({ where }, `{id title}`);
    // 2. check if they own the item or have the permissions
    // TODO
    // 3. delete the item!
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );
    generateToken(user.id, ctx);
    return user;
  },

  async signin(parent, args, ctx, info) {
    const { email, password } = args;
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error('No such user');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Wrong password');
    }
    generateToken(user.id, ctx);
    return user;
  },

  async signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token', {
      httpOnly: true
    });
    return { message: 'Yalla Bye' };
  }
};

const generateToken = (userId, ctx) => {
  const token = jwt.sign({ userId }, process.env.APP_SECRET);
  ctx.response.cookie('token', token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
  });
};

module.exports = Mutations;
