import { z } from "zod";


export const openPaymentDataValidator = z.object({
    search: z.string(
        {
            required_error: "Search query is required",
            invalid_type_error: "Search query must be a string",
        }
    ),

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

    type: z.enum(
        [
            "prescriber",
            "company",
            "hospital"  
        ],
    ).optional(),

    country : z.string(
        {
            invalid_type_error: "Country must be a string",
        }
    ).min(2, "Country must be at least 2 characters long")
    .optional(),
    
    city: z.string(
        {
            invalid_type_error: "City must be a string",
        }
    ).min(2, "City must be at least 2 characters long")
    .optional(),

    npiNumber: z.string(
        {
            invalid_type_error: "NPI number must be a string",
        }
    ).min(2, "NPI number must be at least 2 characters long")
    .optional(),

});

export type openPaymentDataValidatorType = z.infer<typeof openPaymentDataValidator>;

export const generalPaymentAcrossYearsValidator = z.object({
    profileId: z.string(
        {
            required_error: "profileId is required",
            invalid_type_error: "profileId must be a string",
        }
    ).min(5, "profileId must be at least 5 characters long"),

    type: z.enum(
        [
            "prescriber",
            "company",
            "hospital"  
        ],
    ).optional(),
});

export type RegisterType = z.infer<typeof generalPaymentAcrossYearsValidator>;