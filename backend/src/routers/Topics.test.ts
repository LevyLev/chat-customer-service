import { Request, Response } from 'express';
import { Topic } from '../models/Topics';
import { createTopics, getTopics } from './Topics';

jest.mock('../models/Topics');

describe('TopicsRouter', () => {
  const mockSend = jest.fn();
  const mockJson = jest.fn();
  const mockStatus = jest.fn(() => ({ send: mockSend, json: mockJson }));
  const res = {
    json: mockJson,
    status: mockStatus,
    send: mockSend,
  } as unknown as Response;
  const req = {} as Request;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTopics', () => {
    it('should get all topics', async () => {
      const mockTopics = [
        {
          title: 'topic1',
          subTopics: [{ title: 'subTopic11', subTopics: ['lastSubTopic111'] }],
        },
        {
          title: 'topic2',
          subTopics: [{ title: 'subTopic22', subTopics: ['lastSubTopic211'] }],
        },
      ];
      (Topic.find as jest.Mock).mockResolvedValue(mockTopics);

      await getTopics(req, res);

      expect(Topic.find).toHaveBeenCalledWith();
      expect(mockJson).toHaveBeenCalledWith(mockTopics);
    });

    it('should handle errors', async () => {
      const errorMessage = 'Internal Server Error';
      (Topic.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getTopics(req, res);

      expect(Topic.find).toHaveBeenCalledWith();
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockSend).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('createTopics', () => {
    const mockTopic = {
      title: 'topic1',
      subTopics: [{ title: 'subTopic11', subTopics: ['lastSubTopic111'] }],
    };

    it('should create a new topic', async () => {
      const mockRequest = {
        body: mockTopic,
      } as unknown as Request;
      const mockSavedTopic = {
        _id: '1',
        ...mockTopic,
      };
      (Topic.create as jest.Mock).mockResolvedValue(mockSavedTopic);

      await createTopics(mockRequest, res);

      expect(Topic.create).toHaveBeenCalledWith(mockTopic);
      expect(mockJson).toHaveBeenCalledWith(mockSavedTopic);
    });

    it('should handle errors', async () => {
      const errorMessage = 'Internal Server Error';
      (Topic.create as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await createTopics(req, res);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockSend).toHaveBeenCalledWith(errorMessage);
    });
  });
});
