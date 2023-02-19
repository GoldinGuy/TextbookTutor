import { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Allow only POST method
  if (req.method != "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    // Retrieving name and type from the body of request
    let { prechain, context, prompt } = req.body;
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Prechain:\n${prechain}\nContext: ${context}\nPrompt: ${prompt}\nAnswer: `,
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.status(200).json(response.data.choices[0].text);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
  }
}

export default handler;