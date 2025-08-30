
import { GoogleGenAI } from "@google/genai";

export default async function solveDoubt(data){
        const ai = new GoogleGenAI({ apiKey:'AIzaSyCmvNtMTU5XT07zzt8RSBdA1-r6zP6dpB4'});
       
        async function main() {
            
        const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: data,
        });
        return response.text;
       
    }

    const result =  main();

    
    return result;
}









