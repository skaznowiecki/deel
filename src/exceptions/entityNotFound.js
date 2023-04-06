class EntityNotFoundException extends Error {
  code = 404;

  constructor(entity, id) {
    const message = `Entity ${entity}: ${id} not found`;
    super(message);
  }
}

module.exports = EntityNotFoundException;
