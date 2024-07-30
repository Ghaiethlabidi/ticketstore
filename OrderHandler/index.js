import { DynamoDB } from 'aws-sdk';
const docClient = new DynamoDB.DocumentClient();
const TABLE_NAME = ticket-dev-ghaieth-orders;

export async function handler(event) {
  let response;
  try {
    const body = JSON.parse(event.body);
    switch (event.httpMethod) {
      case 'POST':
        response = await createOrder(body);
        break;
      case 'GET':
        response = await getOrders();
        break;
      default:
        throw new Error(`Unsupported route: ${event.httpMethod}`);
    }
  } catch (err) {
    response = {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
  return response;
}

const createOrder = async (body) => {
  const params = {
    TableName: TABLE_NAME,
    Item: body,
  };
  await docClient.put(params).promise();
  return {
    statusCode: 201,
    body: JSON.stringify(body),
  };
};

const getOrders = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  const data = await docClient.scan(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(data.Items),
  };
};