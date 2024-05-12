const express = require('express');
const amqp = require('amqplib');
const app = express();
const PORT = process.env.PORT || 3000;

const RABBITMQ_URL = 'amqp://test:test@localhost';

// Подключение к RabbitMQ и отправка сообщения
async function sendToQueue(message) {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'messaging';

        await channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

        console.log(`[x] Sent ${JSON.stringify(message)}`);
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error('Error in RabbitMQ:', error);
    }
}

// Функция преобразования строки в объект
function stringToObject(str) {
    const parts = str.split(' ');
    return { [parts[0]]: parts.slice(1).join(' ') };
}

// Роут для отправки сообщения
app.get('/', async (req, res) => {
    const message = stringToObject('Hello world');
    await sendToQueue(message);
    res.send('Hello World!');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { app, stringToObject };
