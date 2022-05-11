// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const path = require('path')
const fs = require('fs/promises');
const publicPathName = 'public';
const publicImagePathName = "img-upload";

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, publicPathName),
    prefix: `/${publicPathName}/`,
});

// VIEWs
// Index
fastify.get('/', async (request, reply) => {
    return reply.sendFile('index.html');
});

// APIs
// Get Images
fastify.get('/api/img', async(request, reply) => {
    const publicImagePath = path.join(publicPathName, publicImagePathName);
    const privateImagePath = path.join(__dirname, publicImagePath);
    const result = [];
    const dir = await fs.opendir(privateImagePath);

    for await (const file of dir) {
        const parsedFileName = file.name.split('_');
        const displayPath = path.join(publicImagePath, file.name);
        let year = null, month = null, day= null, time = null;
 
        if (parsedFileName.length === 4) {
            year = parseInt(parsedFileName[0]);
            month = parseInt(parsedFileName[1]);
            day = parseInt(parsedFileName[2]);
            time = parseInt(parsedFileName[3].split('.')[0]);
        }

        result.push({
            year,
            month,
            day,
            time,
            displayPath
        });
    }

    return result;
});

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
};

start();