require('dotenv').config();
import * as http from 'http';
import TelegramBot from './src/TelegramBot';

const PORT = process.env.PORT || 3000;

const server = http.createServer(() => {});

server.listen(PORT, () => {
  TelegramBot();
  console.log(`Real Currency Exchange Rate Bot was be started on port - ${PORT}`);
});

if (process.env.NODE_ENV === 'production') {
  // For heroku. Stop idle application hack.
  require('newrelic');
}
