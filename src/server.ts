// import express, { Request, Response} from "express";
import express, { Application } from "express";

import cors from 'cors';

import bodyParser from "body-parser";

import usersRoutes from "./handlers/Users";

import session, { SessionOptions } from 'express-session';

import dotenv from 'dotenv';

dotenv.config();

const {
  COOKIE_SECRET,
  ENVIRONMENT,
} = process.env;

const app: express.Application = express();

const address: string = "0.0.0.:3000";

// app.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
const corsOption = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));

const port = 4000;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(session({
  secret: COOKIE_SECRET,
  credentials: true,
  name: "usr",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: ENVIRONMENT === "production" ? "true" : "auto",
    httpOnly: true,
    expires: 1000 * 60 * 60 * 24 * 7 as any,
    sameSite: ENVIRONMENT === "production" ? "none" : "lax",
  }
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