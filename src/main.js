import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { code } from "telegraf/format";
import { ogg } from "./ogg.js";
import { openai } from "./openai.js";
import {getRandomText, responseTexts} from "./utils.js";
import dotenv from 'dotenv'
import http from 'http'
dotenv.config()

const INITIAL_SESSION = {
  messages: []
}

const bot = new Telegraf(process.env.TELEGRAM_BOT)

bot.use(session())

bot.command('new', async (ctx) => {
  ctx.session = INITIAL_SESSION
  await ctx.reply('Жду новой темы для беседы')
})
bot.command('start', (ctx) => {
  ctx.reply('Привет, меня зовут Джарвис. Я буду помогать тебе искать информацию, но основе твоих голосовых сообщений.')
})

// get voice message from user
bot.on(message('voice'), async (ctx) => {
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
})

bot.on(message('text'), async (ctx) => {
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
})

await bot.launch()

// signals of process interrupt
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
