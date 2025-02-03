
import { Document, ObjectId, Schema, SchemaTimestampsConfig } from "mongoose";

export type TUser = {
    role: "user" | "admin";
    password: string;
    email: string;
    fullName: string;
    otp?: string;
    otpExpiryTime?: Date;
    stripeCustomerId?: string;
    status: "ACTIVE" | "INACTIVE";
    isVerified: boolean;
    profilePicture: string;
    comparePasswordMethod?: (userPassword: string) => Promise<any>;
};

export type TUserModel = TUser & Document & SchemaTimestampsConfig;

export type TTokenUser = {
    userId: string;
    role: string;
}

export type TRole = 'admin' | 'user';