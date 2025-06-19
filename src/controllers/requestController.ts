import { Request, Response } from "express";
import { z } from "zod";
import requestInputSchema from "../schemas/request.schema";
import {db,auth} from "../utils/db";
import { haversineDistance } from "../utils/distance"


export const createRequest = async (req: Request, res: Response) => {
  try {
    const validatedData = requestInputSchema.safeParse(req.body);
    if (!validatedData.success) {
      return res.status(400).json(validatedData.error);
    }
    const data = validatedData.data;
    const docRef = db.collection("requests").doc();
    await docRef.set(data);

    res
      .status(201)
      .json({ message: "Request created successfully", id: docRef.id });
  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRequests = async (req: Request, res: Response) => {
  try {
    const requestsSnapshot = await db.collection("requests").get();
    const requests = requestsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const requestId = req.params.id;
    const docRef = db.collection("requests").doc(requestId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRequestsByUser = async (req: Request, res:Response): Promise<any> => {
  try {
    const token = req.get("authToken");
    if (!token) {
      throw new Error("No auth token detected: Unauthorized");
    }
    const user = await auth.verifyIdToken(token as string);
    const docRef = await db.collection("requests");
    const docSnapshot = await docRef.where("userId", "==", user.uid).get();

    if (docSnapshot.empty) {
      res.status(404).send("Request not found");
    }
    const result: any = [];
    docSnapshot.forEach((collection) => {
      result.push(collection.data());
    });
    res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching request:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const editRequest = async (req: Request, res: Response): Promise<any> => {
  try {
    const documentId: any = req.query.documentId;

    const validatedData = requestInputSchema.safeParse(req.body);

    if (validatedData.success) {
      const data = validatedData.data;

      if (!documentId) {
        return res.status(400).send('Missing document ID or updated data');
      }
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
};

export const getRequestByBloodTypeAndLocation = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const bloodType: any = req.query.bloodType;
    const lng: any = req.query.lng;
    const lat: any = req.query.lat;
    const rateLimit = 8;
    if (!bloodType) {
      return res.status(400).send('Missing bloodType in request URL');
    }
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
