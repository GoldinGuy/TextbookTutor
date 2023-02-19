import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
// Create S3 instance
const s3 = new S3({
	region: "eu-central-1",
	accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
	signatureVersion: "v4",
});
export const config = {
	api: {
		bodyParser: {
			sizeLimit: "8mb", // Set desired value here
		},
	},
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST method
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    // Retrieving name and type from the body of request
    let { name, type } = req.body;
    // Setting parameters - ACL will allow us to see a file
    const fileParams = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: name,
      Expires: 600,
      ContentType: type,
      ACL: "public-read"
    };
    // Generating a signed URL which we'll use to upload a file
    const url = await s3.getSignedUrlPromise("putObject", fileParams);
    res.status(200).json({ url });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}