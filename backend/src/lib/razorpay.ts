import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance: Razorpay | null = null;

export function getRazorpay(): Razorpay {
 if (razorpayInstance) return razorpayInstance;

 const keyId = process.env.RAZORPAY_KEY_ID;
 const keySecret = process.env.RAZORPAY_KEY_SECRET;

 if (!keyId || !keySecret) {
 throw new Error("Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
 }

 razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
 return razorpayInstance;
}

export function verifyRazorpaySignature(
 body: string,
 signature: string,
 secret: string
): boolean {
 const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
 return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
