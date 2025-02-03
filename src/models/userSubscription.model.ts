import mongoose, { Document, Schema } from "mongoose";
import { TUserSubscriptionInfo } from "../services/stripe/stripe.interface";

const userSubscriptionSchema = new Schema<TUserSubscriptionInfo>({
    userId : {
        type : Schema.Types.ObjectId,
        required : true
    },
    isActive : {
        type : Boolean,
        default : false
    },
    stripeSubscriptionId: {
        type: String,
    },
    priceId : {
        type : String
    },
    amount : {
        type: String
    },
    last4: {
        type: String
    },
    startDate: {
        type: Date,
        default: Date.now()
    },
    renewalDate: {
        type: Date,
    },
    cancelledDate: {
        type: Date,
    },
}, { strict : false, timestamps : true});

const UserSubscription = mongoose.model("subscriptions", userSubscriptionSchema);

export default UserSubscription;