module.exports = {
  // Cuando una nota es requested desde un User
  notas: async (user, args, { models }) => {
    return await models.Nota.find({ autor: user._id }).sort({ _id: -1 });
  },
  favorites: async (user, args, { models }) => {
    return await models.Nota.find({ favoritedBy: user._id }).sort({ _id: -1 });
  },
};
