require('dotenv').config({ path: '.env' });
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// TODO use express middleware to handle cookies (JWT)
server.express.use(cookieParser());
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

// TODO use express middleware to populate current user

const { FRONTEND_URL } = process.env;

server.start(
  {
    cors: {
      credentials: true,
      origin: FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server now running on port http://localhost:${deets.port}`);
  }
);
