const AWS = require('aws-sdk');
import { v4 } from 'uuid';
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function handler(event) {
  const data = JSON.parse(event.body);

  const params = {
    TableName: 'ticket-dev-ghaieth-events',

    Item: {
      id: v4(),
      name: data.name,
      description: data.description,
      image: data.image,
      date: data.date,
      price: data.price,
      category: data.category,
      capacity: data.capacity,
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Event created successfully', event: params.Item }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error creating event', error: error.message }),
    };
  }
}