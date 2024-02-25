import { Request, Response } from 'express';
import { CustomerService } from '../models/CustomerService';
import {
  getAvailableCustomerServiceRepresentatives,
  toggleAvailabilityCustomerServiceRepresentative,
} from '.';

jest.mock('../models/CustomerService');

describe('CustomerServiceRouter', () => {
  const mockSend = jest.fn();
  const mockJson = jest.fn();
  const mockStatus = jest.fn(() => ({ send: mockSend, json: mockJson }));
  const res = {
    json: mockJson,
    status: mockStatus,
    send: mockSend,
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAvailableCustomerServiceRepresentatives', () => {
    it('should return a list of available reps', async () => {
      const mockReps = [{ _id: '1', name: 'John Doe', available: true }];
      (CustomerService.find as jest.Mock).mockResolvedValue(mockReps);
      const req = {} as Request;

      await getAvailableCustomerServiceRepresentatives(req, res);

      expect(CustomerService.find).toHaveBeenCalledWith({ available: true });
      expect(mockJson).toHaveBeenCalledWith(mockReps);
    });

    it('should handles errors', async () => {
      const errorMessage = 'Internal Server Error';
      (CustomerService.find as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );
      const req = {} as Request;

      await getAvailableCustomerServiceRepresentatives(req, res);

      expect(CustomerService.find).toHaveBeenCalledWith({ available: true });
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockSend).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('toggleAvailabilityCustomerServiceRepresentative', () => {
    const req = { params: { id: 'id' } } as unknown as Request;
    it('should toggle the availability of a customer service representative', async () => {
      const rep = {
        available: false,
        save: jest.fn().mockResolvedValue(true),
      };
      (CustomerService.findById as jest.Mock).mockResolvedValue(rep);

      await toggleAvailabilityCustomerServiceRepresentative(req, res);

      expect(CustomerService.findById).toHaveBeenCalledWith('id');
      expect(rep.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          available: true,
        })
      );
    });

    it('should return a 404 if the representative is not found', async () => {
      (CustomerService.findById as jest.Mock).mockResolvedValue(null);

      await toggleAvailabilityCustomerServiceRepresentative(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith(
        'Customer Service Representative not found'
      );
    });

    it('should handle errors gracefully', async () => {
      const error = new Error('An error occurred');
      (CustomerService.findById as jest.Mock).mockRejectedValue(error);

      await toggleAvailabilityCustomerServiceRepresentative(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith('Internal Server Error');
    });
  });
});
