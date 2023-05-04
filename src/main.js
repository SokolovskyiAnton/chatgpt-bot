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
bot.on(message('voice'), async (ctx) => proccessVoiceMessage)
bot.on(message('text'), async (ctx) => proccessTextMessage)

// signals of process interrupt

async function start() {
  try {
    await bot.launch()

    process.on('uncaughtException', (err) => {
      console.error('Неперехваченное исключение:', err)
      process.exit(1)
    })

    process.on('unhandledRejection', (reason) => {
      console.error('Неперехваченное отклонение промиса:', reason)
    })

    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()
