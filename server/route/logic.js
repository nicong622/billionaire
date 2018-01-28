module.exports = function (fastify, options, next) {
  fastify.post('/logic', function (request, reply) {
    const { cmd, building_id } = request.body
    const resData = {
      status: 'success',
      data: {
        cash: 10000000,
        total_property: 12,
        diamond: 10000,
        threat: 0,
      },
    }

    reply.send(resData)
  })

  next();
};
