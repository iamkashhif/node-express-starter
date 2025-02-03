import mongoose, { Schema } from "mongoose";
import { TOpenPaymentDateset } from "../services/openPaymentData/openPaymentData.interface";

const openPaymentDatasetSchema = new Schema<TOpenPaymentDateset>({
    datasetId : {
        type: String
    },
    type: {
        type: String,
    },
    year : {
        type : String
    },
}, { strict : false, timestamps : true});

const OpenPaymentDataset = mongoose.model("openPaymentDataset", openPaymentDatasetSchema);

export default OpenPaymentDataset;