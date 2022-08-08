import { Server } from 'socket.io'
import express from 'express'
import { createServer } from 'http'

const app = express()
export const server = createServer(app)

export const io = new Server(server, {
  serveClient: false,
  cors: {
    origin: '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  },
})
