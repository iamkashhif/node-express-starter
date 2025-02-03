import z from "zod";


export const durgSearchValidator = z.object({

    search: z.string(
        {
            invalid_type_error: "search must be a string",
        }
    )
    .min(1, "Email must be at most 100 characters long")
    .max(250, "search must be at most 250 characters long"),

    page: z.number(
        {
            invalid_type_error: "page must be a number",
        }
    ).optional()

});

export type signInType = z.infer<typeof durgSearchValidator>