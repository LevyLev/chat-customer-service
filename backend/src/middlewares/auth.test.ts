import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, authorizeAdmin } from '.';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('auth', () => {
  const mockSend = jest.fn();
  const mockJson = jest.fn();
  const mockStatus = jest.fn(() => ({ send: mockSend, json: mockJson }));
  const res = {
    json: mockJson,
    status: mockStatus,
    send: mockSend,
  } as unknown as Response;
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should send 401 if no token is provided', () => {
      const req = {
        headers: {
          authorization: '',
        },
      } as Request;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith(
        'Access Denied: No Token Provided!'
      );
    });
    it('should send 400 if token is invalid', () => {
      const req = {
        headers: {
          authorization: 'Bearer TOKEN',
        },
      } as Request;

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid Token');
    });
    it('should send 400 if verify throws an error', () => {
      const req = {
        headers: {
          authorization: 'Bearer TOKEN',
        },
      } as Request;
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });

      authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid Token');
    });
    it('should set req.user and call next if token is valid', () => {
      const req = {
        headers: {
          authorization: 'Bearer TOKEN',
        },
      } as Request;
      const decoded = {
        _id: 'id',
        role: 'role',
      };
      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      authenticate(req, res, next);

      expect(req.user).toEqual(decoded);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorizeAdmin', () => {
    it('should call next if user is admin', () => {
      const decoded = {
        _id: 'id',
        role: 'admin',
      };
      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const req = {
        headers: {
          authorization: 'Bearer TOKEN',
        },
        user: {
          role: 'admin',
        },
      } as Request;

      authorizeAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should send 403 if user is not admin', () => {
      const decoded = {
        _id: 'id',
        role: 'user',
      };
      (jwt.verify as jest.Mock).mockReturnValue(decoded);

      const req = {
        headers: {
          authorization: 'Bearer TOKEN',
        },
        user: {
          role: 'user',
        },
      } as Request;

      authorizeAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith(
        'Access denied. You do not have the correct privileges.'
      );
    });
  });
});
