import express from "express";

import cors from 'cors';

import bodyParser from "body-parser";

import usersRoutes from "./handlers/Users";

import dotenv from 'dotenv';

import cookieSession from 'cookie-session';

dotenv.config();

const app: express.Application = express();

const address: string = "0.0.0.:3000";

const corsOption = {
  // origin: 'https://ziadaboalmajd.github.io',
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST']
};

app.use(cors(corsOption));

const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'usrc',
  keys: ['key1', 'key2'],
  maxAge: 24 * 60 * 60 * 1000 * 30 * 12,
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 30 * 12),
  secure: true,
  httpOnly: false,
  sameSite: 'none',
}));

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