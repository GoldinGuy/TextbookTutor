import { InvokeCommand, LambdaClient, LogType } from "@aws-sdk/client-lambda";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { NextApiRequest, NextApiResponse } from "next";
import { PineconeClient } from "@pinecone-database/pinecone";



const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const textbookName = req.query.textbookName;
  const query = req.query.query;

  if (!textbookName || Array.isArray(textbookName)) {
    res.status(500).json({ error: "Textbook name was not defined" });
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

		console.log("cmd", payload);

		const command = new InvokeCommand({
      FunctionName: funcName,
      // @ts-ignore
			Payload: JSON.stringify(payload),
			LogType: LogType.Tail,
		});

    const { Payload } = await client.send(command);
		const asciiDecoder = new TextDecoder("ascii");
    const data = asciiDecoder.decode(Payload);
    const dataJSON = JSON.parse(data);
    const cleanedJSON = JSON.parse(dataJSON.body.slice(2, dataJSON.body.length - 1));
    // console.log("cleanedJSON", cleanedJSON.vector);

    const index = pinecone.Index("dewey")
    const queryResponse = await index.query({
    
      vector: cleanedJSON.vector,
      topK: 10,
      includeValues: true,
      includeMetadata: true,
    //    filters: {
    //   "genre": {"$in": ["comedy", "documentary", "drama"]}
    // },
})

    console.log("queryResponse", queryResponse);
    
		return data;
	};

	invoke("dewey-parse", {
		s3_file_name: textbookName,
		isIndex: "false",
		query_to_embed: query,
		isEmbed: "true",
	});
};
export default handler;



// const invoke = async (funcName, payload) => {
//   const client = new LambdaClient({
//     region: "us-east-1",
//     credentials: fromCognitoIdentityPool({
//       client: new CognitoIdentityClient({ region: "us-east-1" }),
//       identityPoolId: "us-east-1:bcc5e143-a038-48bb-aef5-741819496d96",
//     }),
//   });

//   const command = new InvokeCommand({
//     FunctionName: funcName,
//     Payload: payload,
//     LogType: LogType.Tail,
//   });

//   const { Payload } = await client.send(command);
//   const asciiDecoder = new TextDecoder('ascii');
//   const data = asciiDecoder.decode(Payload);
//   return JSON.parse(data);
// }
