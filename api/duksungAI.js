import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY})
export default async function handler(req, res) {
  const allowedOrigin = "https://hayunjong2025.github.io/duksung-fortune/"

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if(req.method === "OPTIONS"){
    return res.status(200).end();
  }
  
  const {name, birth} = req.body;
  if (!name || !birth) {
    return res.status(400).json({error:"이름(name)과 생년월일(birth)이 필요합니다."});
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const prompt = `이름: ${name}, 생년월일: ${birth}, 오늘 날짜: ${today}
    이 사람의 오늘의 운세를 사주풀이 형식으로 알려줘.`;

    const result = await ai.models.generateContent({
      model : "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 60년 경력의 사주풀이 전문가입니다. 사람들의 오늘 운세를 200글자 이내로 전해주세요. 운세는 정확하기보다는 읽었을 때, 즐거울 수 있도록 부정적인 내용은 없어야 합니다. 마지막에는 희망을 전하는 짧은 격언을 덧붙여 주세요.",
      },
    });

    res.status(200).json({answer: result.text});
  } catch(err) {
    console.log(err);
    res.status(500).json({error: "Gemini API 오류 발생"});
  }
}
