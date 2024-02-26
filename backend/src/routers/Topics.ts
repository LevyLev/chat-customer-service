import { Request, Response, Router } from 'express';
import { Topic, ITopic } from '../models';
import { authorizeAdmin } from '../middlewares';

export const topicRouter = Router();

export const getTopics = async (_req: Request, res: Response) => {
  try {
    const topics = await Topic.find<ITopic>();
    res.json(topics);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const createTopic = async (req: Request, res: Response) => {
  try {
    const { title, subTopics } = req.body;
    const createdTopic = await Topic.create<ITopic>({
      title,
      subTopics,
    });
    res.json(createdTopic);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Topic.findByIdAndDelete(id);
    res.send('Deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

topicRouter.get('/', getTopics);
topicRouter.post('/', authorizeAdmin, createTopic);
topicRouter.delete('/:id', authorizeAdmin, deleteTopic);
