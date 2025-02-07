import amqplib from 'amqplib';

export async function sendMessageToQueue(data) {
  if (!data) {
    throw new Error('Data is required to send a message to the queue');
  }
  const connection = await amqplib.connect(`amqp://${process.env.RABBITMQ_HOST}:5672`,{ heartbeat: 30 });
  // const connection = await amqplib.connect(`amqp://localhost:5672`,{ heartbeat: 30 });
  const channel = await connection.createChannel();

  const queue = 'queue'; // Queue name

  await channel.assertQueue(queue, { durable: true }); // Ensure the queue exists
  const message = JSON.stringify(data);
  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

  console.log('Sent message:', data);

  setTimeout(() => {
    connection.close();
  }, 100); // Close connection after a short delay
}

// Example of sending a message
sendMessageToQueue({ message: 'Send!!' }).catch(console.error);
