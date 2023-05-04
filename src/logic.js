import { code } from "telegraf/format";
import { getRandomText, responseTexts } from "./utils.js";
import { ogg } from "./ogg.js";
import { openai } from "./openai.js";
import { INITIAL_SESSION } from "./helpers.js";

export async function proccessVoiceMessage(ctx) {
  ctx.session ??= INITIAL_SESSION
  try {
    await ctx.reply(code(getRandomText(responseTexts)))
    const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
    const userId = String(ctx.message.from.id)
    const oggPath = await ogg.create(link.href, userId)
    const mp3Path = await ogg.toMP3(oggPath, userId)

    const text = await openai.transcription(mp3Path)
    await ctx.reply(code(`Ваш запрос: ${text}`))
    ctx.session.messages.push({ role: openai.roles.USER, content: text })
    const response = await openai.chat(ctx.session.messages)
    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content
    })
    ctx.reply(response.content)
  } catch (e) {
    console.log(`Error voice message ${e.message}`)
  }
}

export async function proccessTextMessage(ctx) {
  ctx.session ??= INITIAL_SESSION
  try {
    const text = ctx.message.text
    await ctx.reply(code(getRandomText(responseTexts)))
    await ctx.reply(code(`Ваш запрос: ${text}`))
    ctx.session.messages.push({ role: openai.roles.USER, content: text })
    const response = await openai.chat(ctx.session.messages)
    ctx.session.messages.push({
      role: openai.roles.ASSISTANT,
      content: response.content
    })
    ctx.reply(response.content)
  } catch (e) {
    console.log(`Error voice message ${e.message}`)
  }
}