
import { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
	region: "us-west-1",
	accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
	signatureVersion: "v4",
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	try {
		let { name, type } = req.body;

		const fileParams = {
			Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
			Key: name,
			Expires: 600,
			ContentType: type,
		};

		const url = await s3.getSignedUrlPromise("putObject", fileParams);

		res.status(200).json({ url });
	} catch (err) {
		console.log(err);
		res.status(400).json({ message: err });
	}
};
export default handler;

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "8mb", // Set desired value here
		},
	},
};
