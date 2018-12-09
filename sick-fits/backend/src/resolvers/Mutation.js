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
  }
};

module.exports = Mutations;
