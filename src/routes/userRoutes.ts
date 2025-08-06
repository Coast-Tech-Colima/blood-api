import { Router } from 'express';
import { createUser, getUsers } from '../controllers/userController';
import { db } from '../utils/db';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);

router.get('/:id', async (req, res) => {
  try {
    const userId = Number(req.params.id);
    const snapshot = await db
      .collection('users')
      .where('id', '==', userId)
      .get();
    if (snapshot.empty) {
      return res.status(404).send('User not found');
    }
    res.status(200).send(snapshot.docs[0].data());
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/:userId', async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const snapshot = await db
      .collection('users')
      .where('id', '==', userId)
      .get();
    if (snapshot.empty) {
      return res.status(404).send('User not found');
    }
    await snapshot.docs[0].ref.update(req.body);
    res.status(200).send('User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/documents', async (req, res) => {
  try {
    const { userId, ...fileData } = req.body;
    if (!userId) {
      return res.status(400).send('Missing userId');
    }
    const snapshot = await db
      .collection('users')
      .where('id', '==', Number(userId))
      .get();
    if (snapshot.empty) {
      return res.status(404).send('User not found');
    }
    await snapshot.docs[0].ref.update(fileData);
    res.status(200).send('File info updated');
  } catch (error) {
    console.error('Error updating file info:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/documents', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).send('Missing userId');
    }
    const snapshot = await db
      .collection('users')
      .where('id', '==', Number(userId))
      .get();
    if (snapshot.empty) {
      return res.status(404).send('User not found');
    }
    await snapshot.docs[0].ref.update({ idFile: '', profilePicture: '' });
    res.status(200).send('File info removed');
  } catch (error) {
    console.error('Error deleting file info:', error);
    res.status(500).send('Internal Server Error');
  }
});

export default router;