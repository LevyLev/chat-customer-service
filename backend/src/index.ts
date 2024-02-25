import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CustomerService, ICustomerServiceRep } from './models';
import { customerServiceRouter } from './routers/CustomerService';

const app = express();
const port = process.env.PORT || 4000;
dotenv.config();

const db = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASS}@cluster0.aoz95g5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.connect(db).then(() => console.log('Connected to db'));

app.use(express.json());

// Mock data
const customerServiceReps = ['John Doe', 'Jane Smith', 'Alice Johnson'];
const topics = {
  Football: {
    'Premier League': ['Liverpool', 'Man. UTD', 'Man. City'],
    'Seria A': ['Milan', 'Inter', 'Juventus'],
  },
  Books: {
    Investment: [
      'The intelligent Investor - Benjamin Graham',
      'Rich Dad, Poor Dad - Robert Kiyosaki',
    ],
    Children: ['Momo - Micheal Ende', 'BFG - Roald Dahl'],
  },
};

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/customer-service', customerServiceRouter);

// app.get('/customer-service', async (req, res) => {
//   try {
//     await CustomerService.create<ICustomerServiceRep>({
//       name: 'John',
//       available: true,
//     });
//     await CustomerService.create<ICustomerServiceRep>({
//       name: 'Anna',
//       available: true,
//     });
//     await CustomerService.create<ICustomerServiceRep>({
//       name: 'Michael',
//       available: true,
//     });
//     await CustomerService.create<ICustomerServiceRep>({
//       name: 'Jane',
//       available: true,
//     });
//     await CustomerService.create<ICustomerServiceRep>({
//       name: 'Paula',
//       available: true,
//     });
//     await CustomerService.create<ICustomerServiceRep>({
//       name: 'Paula',
//       available: true,
//     });
//   } catch (err) {
//     console.log(err);
//   }

//   res.status(200);
// });

app.get('/topics', async (req, res) => {
  res.json(topics);
});

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
