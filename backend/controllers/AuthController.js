import User from '../models/UserModel.js';
import bcryptjs from 'bcryptjs';

export const register = async (req, res) => {
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
    res.status(500).json(error.message);
  }
};
