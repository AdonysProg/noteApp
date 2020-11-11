module.exports = {
  // Cuando una nota es solicitada retorna al Autor tambien.
  autor: async (nota, args, { models }) => {
    return await models.User.findById(nota.autor);
  },
  // Cuando una nota es solicitada retorna el favoritedBy
  favoritedBy: async (nota, args, { models }) => {
    return await models.User.find({ _id: { $in: nota.favoritedBy } });
  },
};
