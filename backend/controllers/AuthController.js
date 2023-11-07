import User from '../models/UserModel.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

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

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Wrong Credentials'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_KEY);

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('access_token', token, {
        httpOnly: true,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
