import { z } from 'zod';
import User from '../Models/UserModel';

export const emailValidate = z
  .string()
  .trim()
  .email('Invalid Email Address')
  .min(1)
  .max(255);

export const passwordValidate = z
  .string()
  .trim()
  .min(8, 'Password must be atleast 8 character')
  .max(128, 'Password must be less then 128 characters')
  .regex(/[A-Z]/, 'Password must contain atleast one uppercase letter')
  .regex(/[a-z]/, 'Password must contain atleast one lowercase letter')
  .regex(/[0-9]/, 'Password must contain atleast one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain atleast one special Character');

export const Username = z
  .string()
  .trim()
  .min(3, 'username must have minimun of 3 character')
  .max(40, 'username must have maximun of 40 character');

export const registorValidate = z.object({
  name: Username,
  userName: Username,
  email: emailValidate,
  password: passwordValidate,
});

export const loginValidate = z.object({
  email: emailValidate,
  password: passwordValidate,
});
