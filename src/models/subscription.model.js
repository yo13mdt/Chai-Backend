import mongoose, { Schema } from 'mongoose';

const subscriptionSchema = new Schema({
    suscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    },

    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       
    }
} , { timestamps: true });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);