// import express, { Request, Response} from "express";
import express from "express";

import cors from 'cors';

import bodyParser from "body-parser";

import usersRoutes from "./handlers/Users";

import session, { SessionOptions } from 'express-session';

import genFunc from 'connect-pg-simple';

import dotenv from 'dotenv';

dotenv.config();

const {
  COOKIE_SECRET,
  POSTGRES_HOST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_NAME,
  POSTGRES_PORT,
} = process.env;

const app: express.Application = express();

const address: string = "0.0.0.:3000";

// app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
const corsOption = {
  origin: 'https://ziadaboalmajd.github.io',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
  methods: ['GET', 'POST']
};

app.use(cors(corsOption));

const port = 4000;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PostgresqlStore = genFunc(session);
const sessionStore = new PostgresqlStore({
  conString: "postgres://" + POSTGRES_USER + ":" + POSTGRES_PASSWORD + "@" + POSTGRES_HOST + ":" + POSTGRES_PORT + "/" + POSTGRES_NAME,
});

app.use(session({
  secret: COOKIE_SECRET,
  credentials: true,
  name: 'usr',
  // resave: true,
  resave: false,
  proxy: true,
  // saveUninitialized: false,
  saveUninitialized: false,
  cookie: {
    // secure: ENVIRONMENT === "production" ? true : "auto",
    secure: true,
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 24 * 7 * 4 as any,
    expires: 1000 * 60 * 60 * 24 * 7 * 4 as any,
    sameSite: 'none',
  },
  store: sessionStore
} as SessionOptions
));

usersRoutes(app);

// listen port
app.listen(port, () => {
  console.log(`server started at localhost:${port}`);
});

export default app;











































// app.get('/test-cors', cors(CorsOptions), function (req, res, next)  {
//   res.json({msg: "this is cors enabled"});
// });
// app.get('/book', (_req: Request, res: Response) => {
//   try {
//       res.send('this is the INDEX route');
//   } catch (err) {
//       res.status(400);
//       res.json(err);
//   }
// });

// app.get('/book/:id', (_req: Request, res: Response) => {
//   try {
//      res.send('this is the SHOW route');
//   } catch (err) {
//      res.status(400);
//      res.json(err);
//   }
// });

// app.post('/book', (req: Request, res: Response) => {
//   const book: Book = {
//     id: req.body.id,
//     title: req.body.title,
//     author: req.body.author,
//     totalPages: req.body.totalPages,
//     summary: req.body.summary
//   };
//   try {
//      res.send('this is the CREATE route');
//   } catch (err) {
//      res.status(400);
//      res.json(err);
//   }
// });

// app.put('/book/:id', (req: Request, res: Response) => {
//   const book: Book = {
//     id: req.body.id,
//     title: req.body.title,
//     author: req.body.author,
//     totalPages: req.body.totalPages,
//     summary: req.body.summary
//   };
//   try {
//      res.send('this is the EDIT route');
//   } catch (err) {
//      res.status(400);
//      res.json(err);
//   }
// });

// app.delete('/book/:id', (_req: Request, res: Response) => {
//   try {
//      res.send('this is the DELETE route');
//   } catch (err) {
//      res.status(400);
//      res.json(err);
//   }
// })
// ;