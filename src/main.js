import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { proccessTextMessage, proccessVoiceMessage } from "./logic.js";
import { INITIAL_SESSION } from "./helpers.js";
import dotenv from 'dotenv'
dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_BOT)

await bot
  .use(session())
  .command('new', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('Жду новой темы для беседы')
  })
  .command('start', (ctx) => {
    ctx.reply('Привет, меня зовут Джарвис. Я буду помогать тебе искать информацию, но основе твоих голосовых или текстовых сообщений.')
  })
  .on(message('voice'), async (ctx) => proccessVoiceMessage)
  .on(message('text'), async (ctx) => proccessTextMessage)
  .launch()

// signals of process interrupt
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
