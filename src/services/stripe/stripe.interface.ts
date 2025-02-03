
import { Document, ObjectId, Schema, SchemaTimestampsConfig } from "mongoose";

export type TUserSubscriptionInfo = {
    userId: Schema.Types.ObjectId,
    isActive: Boolean
    status: "Active" | "InActive";
    stripeSubscriptionId: string;
    priceId: string;
    amount: string;
    last4: string;
    startDate?: Date;
    renewalDate?: Date;
    cancelledDate?: Date;
    cancelledBy?: string;
    endDate: Date;
    tier: string
};

export type TUserSubscriptionInfoModel = TUserSubscriptionInfo & Document & SchemaTimestampsConfig;

export type TCreateSubscription = {
    customerId: string;
    planId: string;
    paymentMethod: string;
}

export type TPaymentMethodType = "card" | "us_bank_account";