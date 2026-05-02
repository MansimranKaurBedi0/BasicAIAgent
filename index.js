import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import readlineSync from "readline-sync";
dotenv.config();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

//it my tool for my AI agent
function sum({a,b}){
  return a+b;
}
 
const sumDeclaration={
  name:"sum",
  description:"This function takes two numbers as input and returns their sum.",
  parameters:{
    type:"object",
    properties:{
      a:{
        type:"number",
        description:"The first number to be added."
      },
      b:{
        type:"number",
        description:"The second number to be added."
      }
    },
    required:["a","b"]
  }
}

async function main() {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    contents: "arrays",
    config: {
      systemInstruction: `
If user asks to add numbers, always use the sum function.
`,
      tools: [{
      functionDeclarations: [sumDeclaration],
    }],
    },
    history: [],
  });

  while (true) {
    const userProblem = readlineSync.question("What do you want to ask? ");

    if (userProblem.toLowerCase() === "exit") {
      console.log("Chat ended.");
      break;
    }

    const response = await chat.sendMessage({
      message: userProblem,
    });
    if (response.functionCalls && response.functionCalls.length > 0) {
  const functionCall = response.functionCalls[0]; // Assuming one function call
  const functionName = functionCall.name;
  const functionArgs = functionCall.args;

  if (functionName === "sum") {
    // const a = functionArgs.a;
    // const b = functionArgs.b;
    const result = sum(functionArgs);
    console.log("hy");
    console.log(`Result: ${result}`);
  } else {
    console.log(`Function ${functionName} is not recognized.`);
  }
  
} else {
  // console.log("No function call found in the response.");
  console.log(response.text);
}
  }

}

await main();