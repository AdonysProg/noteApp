module.exports = {
  notas: async (parent, args, { models }) => {
    return await models.Nota.find().limit(100);
  },
  nota: async (parent, args, { models }) => {
    return await models.Nota.findById(args.id);
  },
  user: async (parent, { username }, { models }) => {
    return await models.User.findOne({ username });
  },
  users: async (parent, args, { models }) => {
    return await models.User.find({});
  },
  me: async (parent, args, { models, user }) => {
    return await models.User.findById(user.id);
  },
  noteFeed: async (parent, { cursor }, { models }) => {
    // Hardcode el limite de items a 10
    const limite = 10;
    // El default next page a false
    let hasNextPage = false;
    //Si no se ha pasado ningun cursor entonces este sera empty
    //Asi se pondran las notas mas recientes desde la db
    let cursorQuery = {};

    // Si hay un cursor nuestro query buscara por las notas
    // con un ObjectId menor al del cursor
    if (cursor) {
      cusrorQuery = { _id: { $lt: cursor } };
    }

    // Encontrar el limite + 1 de las notas en la db, ordenado de reciente a viejo
    let notas = await models.Nota.find(cursorQuery)
      .sort({ _id: -1 })
      .limit(limite + 1);

    // Si el numero de notas supera el limite
    // Poner hasNextPage true y hacerle slice a las notas al limite
    if (notas.length > limite) {
      hasNextPage = true;
      notas = notas.slice(0, -1);
    }


    // El nuevo cursor sera el objectId del ultimo item en el array traido desde mongodb
    const newCursor = notas[notas.length - 1]._id;

    return {
      notas,
      cursor: newCursor,
      hasNextPage,
    };
  },
};
