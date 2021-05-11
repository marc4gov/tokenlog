import * as dotenv from 'dotenv';

dotenv.config();

export const DbConfig = {
  DB_CONNECTIONSTRING: process.env.REACT_APP_DB_CONNECTIONSTRING || 'mongodb://127.0.0.1/my_database',
};
