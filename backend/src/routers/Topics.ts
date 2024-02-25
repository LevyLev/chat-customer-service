import { Request, Response, Router } from 'express';
import { Topic, ITopic } from '../models';

export const topicRouter = Router();

export const getTopics = async (_req: Request, res: Response) => {
  try {
    const topics = await Topic.find<ITopic>();
    res.json(topics);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

// export const createTopics = async (_req: Request, res: Response) => {
//   try {
//     await Topic.create<ITopic>({
//       title: 'Football',
//       subTopics: [
//         {
//           title: 'Premier League',
//           subTopics: ['Liverpool', 'Man City', 'Man United', 'Spurs'],
//         },
//         {
//           title: 'Seria A',
//           subTopics: ['Milan', 'Inter', 'Juventus', 'Roma'],
//         },
//         {
//           title: 'La Liga',
//           subTopics: ['Real Madrid', 'Barcelona', 'Atletico Madrid', 'Sevilla'],
//         },
//         {
//           title: 'Bundesliga',
//           subTopics: [
//             'Bayern Munich',
//             'Dortmund',
//             'RB Leipzig',
//             'Bayer Leverkusen',
//           ],
//         },
//       ],
//     });
//     await Topic.create<ITopic>({
//       title: 'Cars',
//       subTopics: [
//         {
//           title: 'Mercedes',
//           subTopics: ['A-Class', 'C-Class', 'E-Class', 'S-Class'],
//         },
//         {
//           title: 'Audi',
//           subTopics: ['A3', 'A4', 'A7', 'A8'],
//         },
//         {
//           title: 'BMW',
//           subTopics: ['1 Series', '3 Series', '5 Series', '7 Series'],
//         },
//         {
//           title: 'Tesla',
//           subTopics: ['Model 3', 'Model S', 'Model X', 'Model Y'],
//         },
//       ],
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal Server Error');
//   }
// };

topicRouter.get('/', getTopics);
