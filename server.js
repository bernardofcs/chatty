var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var uuid = require('node-uuid')

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
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`))

// Create the WebSockets server
const WebSocket = require('ws');
const wss = new SocketServer({ server })
let clients = {}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  const clientId = uuid();
  clientConnected(ws, clientId)
  ws.on('message', handlePost)
  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    clientDisconnected(clientId)
  })
})

function clientConnected(ws, clientId){
  console.log('Client connected')
  clients[clientId] = {
    id:clientId,
    color: randomColor()
  }
  const connectionMsg = {
    type: 'ownConnection',
    userId: clients[clientId].id
  }

  // console.log(connectionMsg)

  if (ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(connectionMsg))
  }

  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`{"type":"incomingConnection","clientsConnected":${Object.keys(clients).length}}`)
    }
  });
}

function clientDisconnected(clientId){
  console.log('Client disconnected');
    delete clients[clientId]
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`{"type":"incomingDisconnection","clientsConnected":${Object.keys(clients).length}}`)
      }
    })
}

function handlePost(data){
  data = JSON.parse(data);
  switch(data.type){
    case 'postMessage':
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          data.type = 'incomingMessage';
          // data.color = clients[data.userId].color;
          data.clientColor = clients[data.userId].color
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
      throw new Error("Unknown event type " + data.type)
  }
}

function randomColor() {
  const colors = ['#2e589b', '#c40707', '#7c8c13', '#2fe372', '#cc0000', '#003300', '#993333', '#6600ff']
  return colors[Math.round(Math.random() * 7)]
}



