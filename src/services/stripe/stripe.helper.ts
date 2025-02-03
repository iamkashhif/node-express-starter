import Stripe from "stripe";
import Users from "../../models/users.model";
import { TCreateSubscription } from "./stripe.interface";
const stripe = new Stripe(
    process.env.STRIPE_CLIENT_SECRET || ''
);

// Create a Stripe customer
export async function createStripeCustomer(email: string) {
    try {
        if (!email) {
            throw new Error('Email is required');
        }
    
        const checkUser = await Users.findOne(
            { customerId: { $eq: null }, email: email },
            { customerId: 1 }
        );
    
        if (!checkUser) {
            throw new Error('Customer is already created');
        }
    
        const customer = await stripe.customers.create({
            email,
        });
    
        return customer;
    } catch (error) {
        throw error;
    }
}

export async function createStripeSubscription(data: TCreateSubscription) {
    try {
        return await stripe.subscriptions.create({
            customer: data.customerId,
            items: [
                {
                    price: data.planId,
                },
            ],
        });
    } catch (error) {
        throw error;
    }
}