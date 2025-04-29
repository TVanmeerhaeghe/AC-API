const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js', './routes/*.js'];

const doc = {
  info: {
    title: 'AC Brocante API',
    version: '1.0.0',
    description: 'Documentation API pour la solution AC Brocante',
  },
  servers: [
    { url: 'http://diawd.fr/acbrocante', description: 'Serveur privé' },
  ],
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('⚡️ Swagger spec créée dans', outputFile);
});
