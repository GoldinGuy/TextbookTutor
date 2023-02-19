import { InvokeCommand, LambdaClient, LogType } from "@aws-sdk/client-lambda";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { NextApiRequest, NextApiResponse } from "next";
import { PineconeClient } from "@pinecone-database/pinecone";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	const textbookName = req.query.file;
	const query = req.query.query;

	if (!textbookName || Array.isArray(textbookName)) {
		return res.status(500).json({ error: "Textbook name was not defined" });
	}
	const pinecone = new PineconeClient();
	await pinecone.init({
		environment: "us-east1-gcp",
		apiKey: "f2a726aa-57e8-46bc-b9ef-0376b7c7ad32",
	});

	const invoke = async (funcName, payload) => {
		const client = new LambdaClient({
			region: "us-west-1",
			credentials: fromCognitoIdentityPool({
				client: new CognitoIdentityClient({ region: "us-east-1" }),
				identityPoolId: "us-east-1:fa374a4c-4f1f-48b8-a50d-7c9851db6350",
			}),
		});

		const command = new InvokeCommand({
			FunctionName: funcName,
			// @ts-ignore
			Payload: JSON.stringify(payload),
			LogType: LogType.Tail,
    });
		console.log("cmd", payload);

    const response = await client.send(command);
		console.log("successfully did embeddings", response);

		return res.status(200).json({ status: "successfully uploaded embeddings" });
	};

	invoke("dewey-parse", {
		s3_file_name: textbookName,
		isIndex: "true",
		query_to_embed: "",
		isEmbed: "false",
	});
};
export default handler;

