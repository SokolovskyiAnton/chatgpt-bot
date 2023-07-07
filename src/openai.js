import { Configuration, OpenAIApi } from 'openai'
import { createReadStream  } from "fs";
import dotenv from 'dotenv'
dotenv.config()

const CHAT_GPT_MODEL = 'gpt-4'
class Openai {
  roles = {
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    USER: 'user',
  }
  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey: apiKey,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async chat(messages) {
    try {
      const response = await this.openai.createChatCompletion({
        model: CHAT_GPT_MODEL,
        messages
      })

      return response.data.choices[0].message
    } catch (e) {
      console.log(e.message)
    }
  }

  async transcription(filepath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filepath),
        'whisper-1'
      )
      return response.data.text
    } catch (e) {
      console.log(e.message)
    }
  }
}

export const openai = new Openai(process.env.OPENAI_KEY);