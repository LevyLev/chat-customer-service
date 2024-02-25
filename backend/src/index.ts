import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { customerServiceRouter } from './routers/CustomerService';
import { topicRouter } from './routers/Topics';

const app = express();
const port = process.env.PORT || 4000;
dotenv.config();

const db = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.aoz95g5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(db).then(() => console.log('Connected to db'));

app.use(express.json());

app.use('/customer-service', customerServiceRouter);
app.use('/topics', topicRouter);

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
