import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../models';

export const authRouter = Router();

export const signUp = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const savedUser = await User.create<IUser>({
      username,
      password: hashedPassword,
      role,
    });

    res.send({ user: savedUser._id });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).send('Username or password is wrong');

  const validPass = await bcrypt.compare(password, user.password);
  if (!validPass) return res.status(400).send('Invalid password');

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('The JWT_SECRET environment variable is not defined.');
  }

  const token = jwt.sign({ _id: user._id, role: user.role }, jwtSecret);

  res.header('auth-token', token).send({ token });
};

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
