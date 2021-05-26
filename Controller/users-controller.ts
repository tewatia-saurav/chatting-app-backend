import jwt from 'jsonwebtoken';
import User from '../Model/users-schema';
import dotenv from 'dotenv';
import { Twilio } from 'twilio'

dotenv.config();

const signup = async (req: any, res: any) => {
  try {
    const newUser = await User.create(req.body);
    res.json({ users: newUser });
    res.status(200).json({
      status: 'SuccessFul',
    });
    // @ts-ignore
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
    console.log(err);
  }
};

const login = async (req: any, res: any, next: any) => {
  try {
    const { phoneNumber, password } = req.body;
    console.log('phoneNumber  ',phoneNumber);
    
    if (!phoneNumber || !password) {
      // @ts-ignore
      res.status(400).json({
        status: 'The fields are empty please enter the data',
      });
    }
    const user: any = await User.findOne({ phoneNumber });
    console.log('user  ',user);

    // @ts-ignore
    if (!user || !(await user.correctPassword(password, user.password))) {
      // @ts-ignore
      // res.status(400).json({
      //   status: 'No Users',
      // });
      res.send(400).json({
        message: 'UnSuccessFul',
      });
    } else {
      // const otp1 = await Auth(email, 'Book Management System');
      // const newOtp = await Otp.create({
      //       otp:otp1.OTP
      // });

      // const client = new Twilio(process.env.ACCOUNT_SID!, process.env.AUTH_TOKEN!);
      // client.verify.s

      // //@ts-ignore
      let token = jwt.sign({ authorization: user.email }, process.env.SECRET_KEY!, { expiresIn: '1h' });
      res.json({
        // users: newOtp,
        message: 'Login SuccessFul',
        token: token,
        //   otp:otp1
      });
      // @ts-ignore
      res.json({});
    }
    next();
  } catch (err) {
    console.log(err);

    res.json({
      message: 'UnSuccessFul',
    });
  }
};

const isAuthorize = async (req: any, res: any, next: any) => {
  try {
    console.log(req.headers);
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.slice(' ')[1];
      console.log('Token', req.headers.authorizarion);
      const decode = jwt.verify(token, `VerySecretKey`);
      console.log('Decode', decode);
      // @ts-ignore
      const requestUser = await LoginModal.findOne(decode.email);
      console.log('User', requestUser);

      try {
        if (!requestUser) {
          return res.json({ success: false, message: 'Unauthorized Access' });
        } else {
          req.user = requestUser;
          res.json({ success: true, message: ' Successful Access' });
          next();
        }
      } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          return res.json({ success: false, message: 'Unauthorized Access' });
        }
        if (err.name === 'TokenExpiredError') {
          return res.json({ success: false, message: 'Session Expire please try sign again' });
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Error in Authorization',
    });
  }
};

export { login, signup, isAuthorize };
