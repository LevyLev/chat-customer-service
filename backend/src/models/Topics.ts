import { Schema, model } from 'mongoose';

interface Topic {
  title: string;
  subTopics: string[];
}

const topic = new Schema<Topic>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  subTopics: {
    type: [String],
    required: true,
  },
});

export const Topic = model<Topic>('Topic', topic);
