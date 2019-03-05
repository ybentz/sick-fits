require('dotenv').config({ path: '.env' });
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

server.express.use(cookieParser());

// This adds the user id data to every request (available via the context object in query/mutations)
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});

// This adds the current user to every single request. I'm not sure this is a great idea since it goes to the DB
// to fetch the user data even if it's not needed at all (e.g. when fetching the items list)
server.express.use(async (req, res, next) => {
  if (!req.userId) return next();
  const { userId } = req;
  const user = await db.query.user(
    { where: { id: req.userId } },
    '{ id, name, email, permissions }'
  );
  req.user = user;
  next();
});

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
