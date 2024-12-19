/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
/* eslint-disable object-curly-spacing */
// eslint-disable-next-line import/no-unresolved
import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import { Request } from 'express'; // eslint-disable-next-line object-curly-spacing
// prettier-ignore
import { uuid } from 'uuidv4';
import { Client } from '@googlemaps/google-maps-services-js';
import { haversineDistance } from "./utils/distance"
import requestInputSchema from "./schemas/request.schema"
import userInptSchema from './schemas/user.schema';
import requestApprovalInputSchema from './schemas/donationRequest.schema';

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const client = new Client({});


exports.createUser = onRequest(async (req, res) => {
  try {
    const data = req.body;
    const validatedData = userInptSchema.safeParse(req.body);
    if (validatedData.success) {

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
});

exports.getUsers = onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    const usersSnapshot = await db.collection('users').get();
    const data = usersSnapshot.docs.map((doc) => doc.data());

    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});
exports.getUserInfo = onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    const usersSnapshot = await db.collection('users').get();
    const data = usersSnapshot.docs.map((doc) => doc.data());

    res.status(200).send(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});
exports.createRequest = onRequest(async (req, res) => {
  try {
    const token = req.get('authToken');
    if (!token) {
      throw new Error('No auth token detected: Unauthorized');
    }
    const validatedData = requestInputSchema.safeParse(req.body);
    const user = await auth.verifyIdToken(token as string);
    if (validatedData.success) {
      const data = validatedData.data;

      const id = uuid(); // Replace with your ID generation logic
      let location: any = {};
      location = await client
        .geocode({
          params: {
            address: data.place,
            key: 'AIzaSyAgJ4jtf-vFn_Qd_W4kWJEKLmw2KFUeL0Y',
          },
        })
        .then((result: any) => {
          const location = result.data.results[0].geometry;
          return location;
        })
        .catch((e) => {
          res.status(400).send('Error the address is not valid');
        });

      console.log(location);

      const docRef = db.collection('requests').doc();
      await docRef.set({
        ...data,
        id,
        userId: user.uid,
        location: location.location ?? '',
        status: 'active',
      });

      res.status(200).send('Data inserted successfully');
    } else {
      res.status(400).send(validatedData.error);
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

exports.getRequests = onRequest(async (req, res) => {
  try {
    const db = admin.firestore();
    const usersSnapshot = await db.collection('requests').get();
    const usersData = usersSnapshot.docs.map((doc) => doc.data());

    res.status(200).send(usersData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

exports.getRequestsByUser = onRequest(
  async (req: Request, res): Promise<any> => {
    try {
      const token = req.get('authToken');
      if (!token) {
        throw new Error('No auth token detected: Unauthorized');
      }
      const user = await auth.verifyIdToken(token as string);
      const db = admin.firestore();
      const docRef = await db.collection('requests');
      const docSnapshot = await docRef.where('userId', '==', user.uid).get();

      if (docSnapshot.empty) {
        res.status(404).send('Request not found');
      }
      const result: any = [];
      docSnapshot.forEach((collection) => {
        result.push(collection.data());
      });
      res.status(200).send(result);
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

exports.getRequestById = onRequest(async (req: Request, res): Promise<any> => {
  try {
    const requestId: any = req.query.id;

    if (!requestId) {
      return res.status(400).send('Missing request ID in request URL');
    }

    const db = admin.firestore();
    const docRef = await db.collection('requests');
    const docSnapshot = await docRef.where('id', '==', requestId).get();

    if (docSnapshot.empty) {
      res.status(404).send('Request not found');
    }
    let requests: any = docSnapshot.docs.map((doc) => doc.data());

    const donationRef = await db.collection('donationsRequests');
    const usersRef = await db.collection('users');

    const donationSnapshot = await donationRef
      .where('requestId', '==', requests[0].id)
      .get();

    const donations = donationSnapshot.docs.map((doc) => doc.data());
    // Resolve user data for each donation
    const donationsInfo = await Promise.all(
      donations.map(async (donation) => {
        const usersSnapshot = await usersRef
          .where('userId', '==', donation.userId.uid ?? '')
          .get();
        const user = usersSnapshot.docs.map((doc) => doc.data());

        donation.userInfo = user?.[0] ?? null;
        return donation;
      })
    );
    const result = requests[0];
    result.donations = donationsInfo;

    res.status(200).send(result);
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).send('Internal Server Error');
  }
});

exports.editRequest = onRequest(async (req, res): Promise<any> => {
  try {
    const documentId: any = req.query.documentId;

    const validatedData = requestInputSchema.safeParse(req.body);

    if (validatedData.success) {
      const data = validatedData.data;

      if (!documentId) {
        return res.status(400).send('Missing document ID or updated data');
      }

      const db = admin.firestore();
      /* eslint-disable indent */
      const querySnapshot = await db
        /* eslint-disable indent */
        .collection('requests')
        /* eslint-disable indent */
        .where('id', '==', documentId)
        /* eslint-disable indent */
        .get();

      if (querySnapshot.empty) {
        return res.status(404).send('Document not found');
      }
      const docRef = querySnapshot.docs[0].ref;
      await docRef.update(data);
      res.status(200).send('Data inserted successfully yedd==eaaah');
    } else {
      res.status(400).send(validatedData.error);
    }
  } catch (error) {
    console.error('Error editing document:', error);
    res.status(500).send('Internal server error');
  }
});

exports.getRequestByBloodTypeAndLocation = onRequest(
  async (req: Request, res): Promise<any> => {
    try {
      const bloodType: any = req.query.bloodType;
      const lng: any = req.query.lng;
      const lat: any = req.query.lat;
      const rateLimit = 8;
      if (!bloodType) {
        return res.status(400).send('Missing bloodType in request URL');
      }

      const db = admin.firestore();
      const docRef = await db.collection('requests');
      const docSnapshot = await docRef
        .where('bloodType', '==', bloodType)
        .get();

      if (docSnapshot.empty) {
        res.status(404).send('Request not found');
      }
      const todayDate = new Date();
      const result: any = [];
      docSnapshot.forEach(async (collection) => {
        const collectionData = collection.data();

        const deadlineDate = new Date(collectionData.dueDate);
        if (deadlineDate < todayDate) {
          return;
        }
        if (!collectionData?.location) {
          return;
        }
        if (lat && lng) {
          const distance = haversineDistance(
            lat,
            lng,
            collectionData?.location?.lat,
            collectionData?.location.lng
          );
          if (distance > rateLimit) {
            return;
          }
        }

        result.push(collection.data());
      });
      res.status(200).send(result);
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

exports.createDonationApprovalRequest = onRequest(
  async (req: Request, res): Promise<any> => {
    const requestId = req.body.requestId;

    if (!requestId) {
      return res.status(400).send('Missing request ID in request URL');
    }
    const token = req.get('authToken');
    if (!token) {
      throw new Error('No auth token detected: Unauthorized');
    }
    const id = uuid();
    const user = await auth.verifyIdToken(token as string);
    const docRef = db.collection('donationsRequests').doc();
    await docRef.set({ requestId, userId: user, status: 'pending', id });
    res.status(200).send('Data inserted successfully');
  }
);

exports.updateDonationApprovalRequest = onRequest(
  async (req: Request, res): Promise<any> => {
    try {
      const documentId: any = req.query.requestId;

      const validatedData = requestApprovalInputSchema.safeParse(req.body);

      if (validatedData.success) {
        const data = validatedData.data;
        if (!documentId) {
          return res.status(400).send('Missing document ID or updated data');
        }

        const db = admin.firestore();
        /* eslint-disable indent */
        const querySnapshot = await db
          /* eslint-disable indent */
          .collection('donationRequests')
          /* eslint-disable indent */
          .where('id', '==', documentId)
          /* eslint-disable indent */
          .get();

        if (querySnapshot.empty) {
          return res.status(404).send('Document not found');
        }
        const docRef = querySnapshot.docs[0].ref;
        await docRef.update(data);
        res.status(200).send('Data inserted successfully');
      } else {
        res.status(400).send(validatedData.error);
      }
    } catch (error) {
      console.error('Error editing document:', error);
      res.status(500).send('Internal server error');
    }
  }
);

exports.deleteDonationRequest = onRequest(
  async (req: Request, res): Promise<any> => { }
);

exports.getDonationApprovalRequestsByUser = onRequest(
  async (req: Request, res): Promise<any> => {
    try {
      const token = req.get('authToken');
      if (!token) {
        throw new Error('No auth token detected: Unauthorized');
      }
      const user = await auth.verifyIdToken(token as string);
      const db = admin.firestore();
      const docRef = await db.collection('donationRequests');
      const docSnapshot = await docRef.where('userId', '==', user.uid).get();

      if (docSnapshot.empty) {
        res.status(404).send('Request not found');
      }
      const result: any = [];
      docSnapshot.forEach((collection) => {
        result.push(collection.data());
      });
      res.status(200).send(result);
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

exports.getdonationApprovalRequestsByRequest = onRequest(
  async (req: Request, res): Promise<any> => {
    try {
      const requestId: any = req.query.requestId;

      if (!requestId) {
        return res.status(400).send('Missing requestId in request URL');
      }

      const db = admin.firestore();
      const docRef = await db.collection('requests');
      const docSnapshot = await docRef
        .where('requestId', '==', requestId)
        .get();

      if (docSnapshot.empty) {
        res.status(404).send('Request not found');
      }
      const result: any = [];
      docSnapshot.forEach(async (collection) => {
        result.push(collection.data());
      });
      res.status(200).send(result);
    } catch (error) {
      console.error('Error fetching request:', error);
      res.status(500).send('Internal Server Error');
    }
  }
);

exports.addUserFilesInfo = onRequest(
  async (req: Request, res): Promise<any> => {
    const bucket = admin.storage().bucket();
    const fileBuffer = req.body.fileBuffer;
    const fileName = req.body.fileName;

    const file = bucket.file(fileName);
    await file.save(fileBuffer);

    res.send('File uploaded successfully!');
  }
);

exports.deleteUserFilesInfo = onRequest(
  async (req: Request, res): Promise<any> => { }
);

