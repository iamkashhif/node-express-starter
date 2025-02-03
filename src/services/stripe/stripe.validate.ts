import { z } from "zod";

export const creatSubscriptionValidation = z.object({
    priceId: z.string().min(1, { message: "Price Id required"}),
    
})