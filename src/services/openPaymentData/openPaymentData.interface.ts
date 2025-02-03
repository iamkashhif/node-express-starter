
import { Document, SchemaTimestampsConfig } from "mongoose";

export type TOpenPaymentDateset = {
    datasetId: string;
    type: string;
    year: string;
};

export type TOpenPaymentDatesetModel = TOpenPaymentDateset & Document & SchemaTimestampsConfig;