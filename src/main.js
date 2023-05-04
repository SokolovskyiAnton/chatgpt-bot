import { Telegraf, session } from "telegraf";
import { message } from "telegraf/filters";
import { proccessTextMessage, proccessVoiceMessage } from "./logic.js";
import { INITIAL_SESSION } from "./helpers.js";
import dotenv from 'dotenv'
dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_BOT)

bot.use(session())
bot.command('new', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('Жду новой темы для беседы')
  })
bot.command('start', (ctx) => {
    ctx.reply('Привет, меня зовут Джарвис. Я буду помогать тебе искать информацию, но основе твоих голосовых или текстовых сообщений.')
  })
bot.on(message('voice'), async (ctx) => await proccessVoiceMessage)
bot.on(message('text'), async (ctx) => await proccessTextMessage)

// signals of process interrupt

await bot.launch()
