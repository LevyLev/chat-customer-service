import { Schema, model } from 'mongoose';

export interface ITopic {
  title: string;
  subTopics: string[] | ITopic[];
}

const subTopicSchema = new Schema<ITopic>({
  title: { type: String, required: true },
  subTopics: [
    {
      type: Schema.Types.Mixed, //strings + nested objects
      required: false,
    },
  ],
});

const topic = new Schema<ITopic>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  subTopics: [subTopicSchema],
});

export const Topic = model<ITopic>('Topic', topic);
