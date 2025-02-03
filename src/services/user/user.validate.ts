import z from "zod";
import { search } from "../openPaymentData/openPaymentData.provider";

// Validate register request
export const signUpValidator = z.object({

    fullName: z.string(
        {
            required_error: "Full name is required",
            invalid_type_error: "Full name must be a string",
        }
    ).min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be at most 50 characters long"),

    email: z.string(
        {
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        }
    ).email()
        .max(100, "Email must be at most 100 characters long"),

    password: z.string(
        {
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }
    ).min(8, "Password must be at least 8 characters long")
        .max(16, "Password must be at most 16 characters long"),

});

export type signUpType = z.infer<typeof signUpValidator>;


export const signInValidator = z.object({

    email: z.string(
        {
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        }
    ).email()
        .max(100, "Email must be at most 100 characters long"),

    password: z.string(
        {
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }
    ).min(8, "Password must be at least 8 characters long")
        .max(16, "Password must be at most 16 characters long"),

});

export type signInType = z.infer<typeof signInValidator>;

export const verifyUserValidator = z.object({

    code: z.string({
        required_error: "Verification Code is required",
        invalid_type_error: "Verification Code must be a string",
    }),

    userId: z.string({
        required_error: "Verification Code is required",
        invalid_type_error: "User Id must be a string",
    }),

});

export type verifyUserValidatorType = z.infer<typeof verifyUserValidator>;


export const userListingAndSearchValidator = z.object({

    search: z.string(
        {
            invalid_type_error: "Search parameter must be a string",
        }
    ).optional(),

    status: z.enum(
        [
            "ACTIVE",
            "INACTIVE"
        ],
    ).optional(),

    page: z.string(
        {
            invalid_type_error: "Page must be a number",
        }
    ).min(1, "Page must be at least 1")
        .optional(),

    pageSize: z.string(
        {
            invalid_type_error: "Page size must be a number",
        }
    ).optional(),

    createdAt: z.date(
        {
            invalid_type_error: "CreatedAt at must be in date format",
        }
    ).optional(),

});

export type userListingAndSearchValidatorType = z.infer<typeof userListingAndSearchValidator>;

export const forgetPasswordValidator = z.object({

    email: z.string(
        {
            required_error: "Email is required",
            invalid_type_error: "Email must be a string",
        }
    )
    .email()
    .max(100, "Email must be at most 100 characters long"),

});

export type forgetPasswordValidatorType = z.infer<typeof forgetPasswordValidator>;

export const changePasswordValidator = z.object({

    userId: z.string(
        {
            required_error: "User Id is required",
            invalid_type_error: "User Id must be a string",
        }
    ).uuid(),

    password: z.string(
        {
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }
    ).min(8, "Password must be at least 8 characters long")
        .max(16, "Password must be at most 16 characters long"),

});

export type changePasswordValidatorType = z.infer<typeof changePasswordValidator>;

export const resetPasswordValidator = z.object({

    code: z.string({
        required_error: "Verification Code is required",
        invalid_type_error: "Verification Code must be a string",
    }),

    userId: z.string({
        required_error: "Verification Code is required",
        invalid_type_error: "User Id must be a string",
    }),

    newPassword: z.string(
        {
            required_error: "Password is required",
            invalid_type_error: "Password must be a string",
        }
    ).min(8, "Password must be at least 8 characters long")
        .max(16, "Password must be at most 16 characters long"),

});

export type resetPasswordValidatorType = z.infer<typeof resetPasswordValidator>;


export const getUserDetailsValidator = z.object({

    userId: z.string(
        {
            required_error: "User Id is required",
            invalid_type_error: "User Id must be a string",
        }
    ).uuid(),

});

export type getUserDetailsType = z.infer<typeof getUserDetailsValidator>;


export const getAllUserValidator = z.object({

    userId: z.string(
        {
            required_error: "User Id is required",
            invalid_type_error: "User Id must be a string",
        }
    ).uuid(),

    search: z.string(
        {
            invalid_type_error: "Search parameter must be a string",
        }
    ).optional(),

    status: z.enum(
        [
            "ACTIVE",
            "INACTIVE"
        ],
    ).optional(),

});

export type getAllUserType = z.infer<typeof getAllUserValidator>;


export const updateUserValidator = z.object({

    userId: z.string(
        {
            required_error: "User Id is required",
            invalid_type_error: "User Id must be a string",
        }
    ).uuid(),

    profilePicture: z.any(
        {
            invalid_type_error: "Profile picture must be a string",
        }
    )
    .optional(),

    fullName: z.string(
        {
            invalid_type_error: "Full name must be a string",
        }
    ).min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be at most 50 characters long")
    .optional(),

    password: z.string(
        {
            invalid_type_error: "Password must be a string",
        }
    ).min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be at most 16 characters long")
    .optional(),

});

export type updateUserType = z.infer<typeof updateUserValidator>;