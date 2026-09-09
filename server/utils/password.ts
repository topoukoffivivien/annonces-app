import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

const scrypt = promisify(scryptCb)
const KEY_LENGTH = 64

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derived = (await scrypt(plain, salt, KEY_LENGTH)) as Buffer
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  const [salt, key] = hash.split(':')
  if (!salt || !key) return false
  const derived = (await scrypt(plain, salt, KEY_LENGTH)) as Buffer
  const keyBuffer = Buffer.from(key, 'hex')
  if (keyBuffer.length !== derived.length) return false
  return timingSafeEqual(keyBuffer, derived)
}
