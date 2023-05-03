import {unlink} from 'fs/promises'

export async function removeFile(filepath) {
  try {
    await unlink(filepath)
  } catch (e) {
    console.log(`Error while unlinking file: `, e.message)
  }
}

export function getRandomText(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);

  return arr[randomIndex];
}

export const responseTexts = ['Сообщение принял. Думаю...',
  'Секундочку.', 'Принял.', 'Сек.', 'Хм...']