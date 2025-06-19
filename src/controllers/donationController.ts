import { Request, Response } from "express";
import donationApprovalRequestInputSchema from "../schemas/donationRequest.schema";
import { db,auth } from "../utils/db";

export const createDonationApprovalRequest = async (
  req: Request,
  res: Response
) => {
  const validatedData = donationApprovalRequestInputSchema.safeParse(req.body);

  if (!validatedData.success) {
    return res.status(400).json(validatedData.error);
  }

  try {
    const { requestId, ...data } = validatedData.data;
    const docRef = db.collection("donationsRequests").doc();
    await docRef.set({ requestId, ...data, status: "pending" });

    res
      .status(201)
      .json({ message: "Donation approval request created successfully" });
  } catch (error) {
    console.error("Error creating donation approval request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDonationApprovalRequest = async (
  req: Request,
  res: Response
) => {
  const documentId = req.params.id; // Assuming the ID is passed as a URL parameter
  const validatedData = donationApprovalRequestInputSchema.safeParse(req.body);

  if (!validatedData.success) {
    return res.status(400).json(validatedData.error);
  }

  try {
    const docRef = db.collection("donationsRequests").doc(documentId);
    await docRef.update(validatedData.data);

    res
      .status(200)
      .json({ message: "Donation approval request updated successfully" });
  } catch (error) {
    console.error("Error updating donation approval request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDonationRequest = async (req: Request, res:Response): Promise<any> => {};

export const getDonationApprovalRequestsByUser = 
  async (req: Request, res:Response): Promise<any> => {
    try {
      const token = req.get("authToken");
      if (!token) {
        throw new Error("No auth token detected: Unauthorized");
      }
      const user = await auth.verifyIdToken(token as string);
      const docRef = await db.collection("donationRequests");
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
  }
;

export const getdonationApprovalRequestsByRequest = 
  async (req: Request, res:Response): Promise<any> => {
    try {
      const requestId: any = req.query.requestId;

      if (!requestId) {
        return res.status(400).send("Missing requestId in request URL");
      }
      const docRef = await db.collection("requests");
      const docSnapshot = await docRef
        .where("requestId", "==", requestId)
        .get();

      if (docSnapshot.empty) {
        res.status(404).send("Request not found");
      }
      const result: any = [];
      docSnapshot.forEach(async (collection) => {
        result.push(collection.data());
      });
      res.status(200).send(result);
    } catch (error) {
      console.error("Error fetching request:", error);
      res.status(500).send("Internal Server Error");
    }
  }
;