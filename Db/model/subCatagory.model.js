import mongoose, {Schema,Types,model} from 'mongoose';
const subCatagorySchema = new Schema ({
    Name:{
        type:String,
        required:true,
        unique:true
    },
    sluge:{
        type:String,
        required:true
    },
    image:{
        type:Object,
       
    },
    catagoryId:{
        type : Types.ObjectId,
        required:true,
        ref:'Catagory'
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
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    timestamps:true,
    
})


subCatagorySchema.virtual('products',{
    localField:'_id',
    foreignField : 'subCatagoryId',
    ref:'Product'

})
const subCatagoryModel = mongoose.models.SubCatagory||  model('SubCatagory',subCatagorySchema);
export default subCatagoryModel;