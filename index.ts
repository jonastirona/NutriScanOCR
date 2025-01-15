import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import app from './src/app';
import serverless from 'serverless-http';

const handler = serverless(app);

export const lambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: any
): Promise<any> => {
  return await handler(event, context);
};