
import mongoose, {Schema,Types,model} from 'mongoose';
const reviewSchema = new Schema ({
    comment:{
        type:String,
        required:true,
    },
    productId:{
        type:Types.ObjectId,
        ref: 'Product',
        required:true
    },
    rating:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    orderId:{
        type:Types.ObjectId,
        ref:'Order',
        require:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    }
},
{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})

const reviewModel = mongoose.models.Review ||  model('Review', reviewSchema);
export default reviewModel;