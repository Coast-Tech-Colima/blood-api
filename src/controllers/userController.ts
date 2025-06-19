import { Request, Response } from 'express';
import admin from 'firebase-admin';
import userInptSchema from '../schemas/user.schema';
import {db} from '../utils/db';;

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = userInptSchema.safeParse(req.body);
    if (validatedData.success) {
      const data = validatedData.data;
      const docRef = db.collection('users').doc();
      await docRef.set(data);
      res.status(200).send('Data inserted successfully');
    } else {
      res.status(400).send(validatedData.error);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send(error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const data = usersSnapshot.docs.map((doc) => doc.data());
    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const data = usersSnapshot.docs.map((doc) => doc.data());
    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
};