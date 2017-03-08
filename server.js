var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    }
  })
  .listen(3000, '0.0.0.0', function (err, result) {
    if (err) {
      console.log(err);
    }

    console.log('Running at http://0.0.0.0:3000');
  });

// server.js

const express = require('express');
const SocketServer = require('ws').Server;

// Set the port to 4000
const PORT = 4000;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const WebSocket = require('ws');
const wss = new SocketServer({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  let connCount = 0;
  wss.clients.forEach(function each(client) {
    connCount++;
    console.log('connCount: ' + connCount)
  });
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log('connCount on send: ' + connCount)
      client.send(`{"type":"incomingConnection","clientsConnected":${connCount}}`);
    }
  });
  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    switch(data.type){
      case 'postMessage':
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            data.type = 'incomingMessage';
            client.send(JSON.stringify(data));
          }
        });
        break;
      case 'postNotification':
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            data.type = 'incomingNotification';
            client.send(JSON.stringify(data));
          }
        });
        break;
      default:
        throw new Error("Unknown event type " + data.type);
    }
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    let connCount2 = 0;
    wss.clients.forEach(function each(client) {
      connCount2++;
    });
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`{"type":"incomingDisconnection","clientsConnected":${connCount2}}`)
      }
    });
  });
});


