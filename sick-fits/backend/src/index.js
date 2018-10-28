require('dotenv').config({ path: '.env' })
const createServer = require('./createServer')
const db = require('./db')

const server = createServer()

// TODO use express middleware to handle cookies (JWT)
// TODO use express middleware to populate current user

const { FRONTEND_URL } = process.env

server.start({
  cors: {
    credentials: true,
    origin: FRONTEND_URL,
  },
}, deets => {
  console.log(`Server now running on port http://localhost:${deets.port}`)
})