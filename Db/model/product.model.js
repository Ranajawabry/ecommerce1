
import mongoose, {Schema,Types,model} from 'mongoose';
const productSchema = new Schema ({
    Name:{
        type:String,
        required:true,
        unique:true,
        trim:true    // cut spaces
    },
    sluge:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    stock:{
        type:Number,
        default:1
    },
    price:{
        type:Number,
        default:1
    },
    discount:{
        type:Number,
        default:0
    },
    finalPrice:{
        type:Number,
        default:1
    },
    colors:
        [String],
    sizes:[{
        type:[String],
        enum:['s','m','lg','xl']
    }],
    catagoryId:{
        type:Types.ObjectId,
        ref:'Catagory',
        required:true
    },
    subCatagoryId:{
        type:Types.ObjectId,
         ref:'SubCatagory',
        required:true
        
    },
    mainImage:{
        type:Object,

       
    },
    subImages:{
        type:[Object]
    },
    deleted:{
        type:Boolean,
        default:false
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

productSchema.virtual('reviews',{
    localField:'_id',
    foreignField : 'productId',
    ref:'Review'

})


const productModel = mongoose.models.Product||  model('Product', productSchema);
export default productModel;