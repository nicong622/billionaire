const fastify = require('fastify')();
const path = require('path');
const page = require('./route/index')
const logic = require('./route/logic')

fastify.register(require('fastify-formbody'))

// static
fastify.register(require('fastify-static'), {
  root: path.join(__dirname, '../dist'),
});

// index routes
fastify.register(page);

fastify.register(logic)

// Run the server!
fastify.listen(3000, (err) => {
  if (err) throw err;
  console.info(`server listening on ${fastify.server.address().port}`)
});
