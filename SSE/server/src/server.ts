import Fastify, { type FastifyRequest, type FastifyReply } from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: 'http://localhost:5173',
});

app.get('/events', (request: FastifyRequest, reply: FastifyReply) => {
  reply.header('Content-Type', 'text/event-stream');
  reply.header('Cache-Control', 'no-cache');
  reply.header('Connection', 'keep-alive');
  reply.raw.writeHead(reply.raw.statusCode, reply.getHeaders());

  const interval = setInterval(() => {
    const payload = JSON.stringify({ time: new Date().toISOString() });
    reply.raw.write(`data: ${payload}\n\n`);
  }, 1000);

  request.raw.on('close', () => {
    clearInterval(interval);
  });
});

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log('Server draait op http://localhost:3000');
});
