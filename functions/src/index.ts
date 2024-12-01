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
import { z } from 'zod';
import { uuid } from 'uuidv4';
import { Client } from '@googlemaps/google-maps-services-js';

admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const client = new Client({});

const requestInputSchema = z.object({
  name: z.string().trim().min(1, { message: 'Required' }),
  lastName: z.string().trim().min(1, { message: 'Required' }),
  motherSurname: z.string().trim().min(1, { message: 'Required' }),
  bloodType: z.string().trim().min(1, { message: 'Required' }),
  unitsRequired: z.number().positive().min(1),
  dueDate: z.string().date().trim().min(1, { message: 'Required' }),
  reason: z.string().trim().min(1, { message: 'Required' }),
  place: z.string().trim().min(1, { message: 'Required' }),
  phone: z.string().trim().min(1, { message: 'Required' }),
  email: z.string().email(),
  folio: z.string().trim().min(1, { message: 'Required' }),
  preferedContact: z.string().trim().min(1, { message: 'Required' }),
  img: z.string().optional(), // Assuming img is optional
});

exports.createUser = onRequest(async (req, res) => {
  try {
    const data = req.body; // Assuming data is sent in the request body

    // Replace 'yourCollectionName' with the actual collection name
    const docRef = db.collection('users').doc();
    await docRef.set(data);

    res.status(200).send('Data inserted successfully');
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

exports.createDonationRequest = onRequest(
  async (req: Request, res): Promise<any> => {
    const requestId = req.body.requestId;

    if (!requestId) {
      return res.status(400).send('Missing request ID in request URL');
    }
    const token = req.get('authToken');
    if (!token) {
      throw new Error('No auth token detected: Unauthorized');
    }
    const user = await auth.verifyIdToken(token as string);
    const docRef = db.collection('donationsRequests').doc();
    await docRef.set({ requestId, userId: user, status: 'pending' });
    res.status(200).send('Data inserted successfully');
  }
);

exports.updateDonationRequest = onRequest(
  async (req: Request, res): Promise<any> => {}
);

exports.deleteDonationRequest = onRequest(
  async (req: Request, res): Promise<any> => {}
);

exports.donationRequestsCounter = onRequest(
  async (req: Request, res): Promise<any> => {}
);

exports.donationRequestsCounter = onRequest(
  async (req: Request, res): Promise<any> => {}
);

/**
 * Calculates the great-circle distance between two points on the E
 * arth's surface
 * using the Haversine formula.
 *
 * @param {number} lat1 - Latitude of the first point in degrees.
 * @param {number} lon1 - Longitude of the first point in degrees.
 * @param {number} lat2 - Latitude of the second point in degrees.
 * @param {number} lon2 - Longitude of the second point in degrees.
 * @return {number} The distance between the two points in kilometers.
 */
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  lat1 = degreesToRadians(lat1);
  lon1 = degreesToRadians(lon1);
  lat2 = degreesToRadians(lat2);
  lon2 = degreesToRadians(lon2);

  const RADIO_TIERRA_EN_KILOMETROS = 6371;
  const diferenciaEntreLongitudes = lon2 - lon1;
  const diferenciaEntreLatitudes = lat2 - lat1;
  const a =
    Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return RADIO_TIERRA_EN_KILOMETROS * c;
}

/**
 * Converts degrees to radians.
 *
 * @param {number} degrees - The angle in degrees.
 * @return {number} The angle in radians.
 */
function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/* exports.getRequestByUser = onRequest(async (req, res) => {
  try {
    const validatedData = requestInputSchema.safeParse(req.body);

    if (validatedData.success) {
      const data = validatedData.data;

      const docRef = db.collection('requests').doc();
      await docRef.set(data);

      res.status(200).send('Data inserted successfullyaaa');
    } else {
      res.status(400).send(validatedData.error);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
 */