import Groq from 'groq-sdk'
import { getKey } from '../utils/keys.js';
import { strictFormat } from '../utils/text.js';

export class Mixtral {
    constructor(model_name, url) {
        this.model_name = model_name;
        this.url = url;
        this.groq = new Groq({ apiKey: getKey('GROQCLOUD_API_KEY')});
    }

    async sendRequest(turns, systemMessage, stop_seq=null) {
        let messages = [{"role": "system", "content": systemMessage}].concat(turns);
        let res = null;
        try {
            console.log("Awaiting Groq response...");
            let completion = await this.groq.chat.completions.create({
                "messages": messages,
                "model": this.model_name || "mixtral-8x7b-32768",
                "temperature": 0.2,
                "max_tokens": 2520,
                "top_p": 1,
                "stream": true,
                "stop": stop_seq // "***"
            });

            let temp_res = "";
            for await (const chunk of completion) {
                temp_res += chunk.choices[0]?.delta?.content || '';
            }

            res = temp_res;

        }
        catch(err) {
            console.log(err);
            res = "My brain just kinda stopped working. Try again.";
        }
        return res;
    }

    async embed(text) {
      console.log("There is no support for embeddings in Groq support. However, the following text was provided: " + text);
    }
}