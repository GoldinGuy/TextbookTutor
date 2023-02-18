import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
	region: "us-west-1",
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	signatureVersion: "v4",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (process.env.AWS_BUCKET_NAME) {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        MaxKeys: 3,
      };
      const data = await s3.listObjectsV2(params).promise();
      res.status(200).json(data.Contents);
    }
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Unable to retrieve S3 objects" });
	}
};
export default handler;

