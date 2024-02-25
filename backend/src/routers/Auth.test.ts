import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { signUp, login } from '.';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/User');

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.header = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('Auth Router', () => {
  describe('signUp', () => {
    it('should create a new user and return the user id', async () => {
      const req = {
        body: {
          username: 'testUser',
          password: 'password123',
          role: 'user',
        },
      } as Request;
      const res = mockResponse();

      (bcrypt.genSalt as jest.Mock).mockResolvedValue('someSalt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.create as jest.Mock).mockResolvedValue({ _id: 'userId' });

      await signUp(req, res);

      expect(res.send).toHaveBeenCalledWith({ user: 'userId' });
    });

    it('should handle errors and send a 400 status', async () => {
      const req = {
        body: {
          username: 'testUser',
          password: 'password123',
          role: 'user',
        },
      } as Request;
      const res = mockResponse();

      (User.create as jest.Mock).mockRejectedValue('error');

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should return a token when login is successful', async () => {
      process.env.JWT_SECRET = 'jwtSecret';
      const req = {
        body: {
          username: 'testUser',
          password: 'password123',
        },
      } as Request;
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'userId',
        password: 'hashedPassword',
        role: 'user',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      await login(req, res);

      expect(res.header).toHaveBeenCalledWith('auth-token', 'token');
      expect(res.send).toHaveBeenCalledWith({ token: 'token' });
    });

    it('should send a 400 status if username is not found', async () => {
      const req = {
        body: {
          username: 'wrongUser',
          password: 'password123',
        },
      } as Request;
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Username or password is wrong');
    });

    it('should send a 400 status if password is wrong', async () => {
      const req = {
        body: {
          username: 'testUser',
          password: 'wrongPassword',
        },
      } as Request;
      const res = mockResponse();

      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'userId',
        password: 'hashedPassword',
        role: 'user',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith('Invalid password');
    });
  });
});
