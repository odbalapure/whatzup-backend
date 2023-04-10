const redis = require("redis");

const client = redis.createClient({
  url: process.env.REDIS_URL,
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

client.on("connect", () => {
  console.log(`Redis started on PORT: ${process.env.REDIS_PORT}`);
});

client.connect();

module.exports = client;
