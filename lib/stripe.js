import Stripe from "stripe";
import { auth } from '@clerk/nextjs/server'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover'
})