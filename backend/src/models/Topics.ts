import { Schema, model } from 'mongoose';

export interface ITopic {
  title: string;
  subTopics: string[] | ITopic[];
}

const topic = new Schema<ITopic>({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  subTopics: [
    {
      type: Schema.Types.Mixed, //strings + nested objects
      required: false,
      validate: {
        validator: function (v: any) {
          if (typeof v === 'string') return true;
          if (v && typeof v === 'object' && v.title) return true;
          return false;
        },
        message: (props) => `${props.value} is not a valid subtopic`,
      },
    },
  ],
});

export const Topic = model<ITopic>('Topic', topic);
