import User from '../models/UserModel.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../routes/error.js';

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  //HASH PASSWORD
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // CREATE NEW USER
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    //SAVE NEW USER TO DATABASE
    await newUser.save();
    res.status(201).json('User created succesfully');
  } catch (error) {
    // next(errorHandler(550, 'error from the function'));
    next(error);
  }
};
