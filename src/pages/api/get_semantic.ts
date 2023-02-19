import { InvokeCommand, LambdaClient, LogType } from "@aws-sdk/client-lambda";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

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
		console.log("data", data);
		return data;
	};

	invoke("dewey-parse", {
			"s3_file_name": "attention.pdf",
			"isIndex": "false",
			"query_to_embed": "what's a transformer?",
			"isEmbed": "true",
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
