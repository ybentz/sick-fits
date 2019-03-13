const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const { transport, makeNoiceEmail } = require('../mail');
const { hasPermission } = require('../utils');

// These are the mutation resolvers - the implementation of the mutations on the BE
const Mutations = {
  async createItem(parent, args, ctx, info) {
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args,
          // this is how we create a relationship between an item and a user in the DB
          user: {
            connect: {
              id: ctx.request.userId
            }
          }
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
    const item = await ctx.db.query.item({ where }, `{id title user { id }}`);
    // 2. check if they own the item or have the permissions
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    const isOwner = item.user.id === ctx.request.userId;
    const hasPermission = ctx.request.user.permissions.some(p => {
      return ['ADMIN', 'ITEMDELETE'].includes(p);
    });
    if (!isOwner && !hasPermission) {
      throw new Error('You must be the owner of this item!');
    }
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
  },

  async requestPasswordReset(parent, args, ctx, info) {
    const { email } = args;
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error('No such user');
    }
    // create reset token
    const promisifiedRandomBytes = promisify(randomBytes);
    const resetToken = (await promisifiedRandomBytes(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 1000 * 60 * 60; // 1hr from now
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });
    const resetUrl = `${
      process.env.FRONTEND_URL
    }/reset?resetToken=${resetToken}&email=${encodeURIComponent(email)}`;
    const mailRes = transport.sendMail({
      from: 'ybentzur7@gmail.com',
      to: user.email,
      subject: 'Your password reset link!',
      html: makeNoiceEmail(
        `Your password reset link is here!
        \n\n
        <a href="${resetUrl}">Click here to reset your password</a>`
      )
    });
    return { message: `success! token: ${resetToken}` };
  },

  async resetPassword(parent, args, ctx, info) {
    const { password, confirmPassword, resetToken, email } = args;
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match!');
    }
    const [user] = await ctx.db.query.users({
      where: {
        email,
        resetToken,
        resetTokenExpiry_gte: Date.now() - 1000 * 60 * 60
      }
    });
    if (!user) {
      throw new Error('No such user');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: {
        password: passwordHash,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    generateToken(user.id, ctx);
    return user;
  },
  async updatePermissions(parent, args, ctx, info) {
    // check that user is logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in to do that!');
    }
    const currentUser = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );
    // make sure user has permission to do this
    const { permissions, userId } = args;
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.mutation.updateUser(
      {
        where: { id: userId },
        data: {
          permissions: {
            // set has to be used since permissions are a prisma/graphQL enum
            set: permissions
          }
        }
      },
      info
    );
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
