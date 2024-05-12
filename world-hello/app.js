const express = require('express');
const amqp = require('amqplib');
const redis = require('redis');

const app = express();
const PORT = process.env.PORT || 3001;

const RABBITMQ_URL = 'amqp://test:test@localhost';
const QUEUE_NAME = 'messaging';

// Подключение к Redis
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

async function initRedis() {
    await redisClient.connect();
}

// Подключение к RabbitMQ и получение сообщения из очереди
async function receiveFromQueue() {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, { durable: false });

        return new Promise((resolve) => {
            channel.consume(QUEUE_NAME, async (msg) => {
                if (msg !== null) {
                    const message = JSON.parse(msg.content.toString());
                    console.log(`[x] Received ${msg.content.toString()}`);
                    await channel.ack(msg);
                    await channel.close();
                    await connection.close();
                    resolve(message);
                } else {
                    resolve(null);
                }
            });
        });
    } catch (error) {
        console.error('Error in RabbitMQ:', error);
        return null;
    }
}

async function saveToRedis(key, value) {
    try {
        await redisClient.set(key, value);
        console.log(`Saved to Redis: { ${key}: ${value} }`);
    } catch (error) {
        console.error('Redis Save Error:', error);
    }
}

app.get('/', async (req, res) => {
    await initRedis();

    const message = await receiveFromQueue();
    if (message) {
        const key = Object.keys(message)[0];
        const value = message[key];
        await saveToRedis(`hello-${key}`, `world-${value}`);
        res.send(message);
    } else {
        res.status(404).send('No messages found');
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`World Hello app is running on port ${PORT}`);
    });
}

module.exports = { app, receiveFromQueue, saveToRedis };
