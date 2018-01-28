module.exports = function (fastify, options, next) {
  fastify.get('/index', function (request, reply) {
    reply.sendFile('index.html')
  })

  next();
};
