import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    credits:{
        type: Number,
        default: 30,
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    expirationDate: {
        type: Date,
        required: true,
    }
})

creditSchema.pre('save', function(next){
    if(!this.expirationDate){
        this.expirationDate = new Date(this.lastUpdated);
    this.expirationDate.setMonth(this.expirationDate.getMonth() + 1);
    }
    next();
});

export default mongoose.model("Credits", creditSchema);