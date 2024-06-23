import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import Grid from 'gridfs-stream';

import authRouter from './routes/auth.router';
import reportRouter from './routes/report.router';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

const MONGO_URL: string = process.env.DATABASE_URL || 'mongodb://localhost/gemastik-ui-backend';
mongoose.connect(MONGO_URL);
const db = mongoose.connection;

let gfs: Grid.Grid;

db.once('open', () => {
  console.log('Connected to Mongoose');
  gfs = Grid(db.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/reports', reportRouter);

app.post('/upload-bukti', upload.array('files', 10), (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
  
    if (!files || files.length === 0) {
      return res.status(400).send('No files uploaded.');
    }
  
    let uploadCount = 0;
  
    files.forEach((file) => {
      const uniqueFilename = `${uuidv4()}-${file.originalname}`;
      const writestream = gfs.createWriteStream({ filename: uniqueFilename });
  
      writestream.write(file.buffer);
      writestream.end();
  
      writestream.on('finish', () => {
        uploadCount++;
        if (uploadCount === files.length) {
          res.status(201).send('Files uploaded successfully.');
        }
      });
  
      writestream.on('error', (err: Error) => {
        res.status(500).json({ error: err.message });
      });
    });
  });
  

app.get('/file/:filename', (req: Request, res: Response) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No file exists' });
    }

    const readstream = gfs.createReadStream({ filename: req.params.filename });
    readstream.pipe(res);
  });
});

app.listen(port, () => console.log(`[server]: Server is running at http://localhost:${port}`));
