import { Request, Response, NextFunction } from 'express';
import admin from '../config/firebase-config';
import { auth as firebaseAuth } from 'firebase-admin';


export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.sendStatus(401);
    }
    //decoded will fail into Internal Error if auth fails
    const decoded = await admin.auth().verifyIdToken(token)

    if (decoded) {
      res.locals.jwtToken = decoded;
      return next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
}

export const createUser = async(email: string, password: string) => {

  try{
    const superAdminUid = await admin.auth().createUser({email: email,  password: password,})
    return superAdminUid.uid
  }
  catch(err: any)  {
    console.log('Error creating new user:', err.errorInfo.message);
    console.log('Retrieving pre-existing user info instead');
    if (err.errorInfo.code == "auth/email-already-exists") {
      const user = await firebaseAuth().getUserByEmail(email)
      return user.uid
    }
  }
}