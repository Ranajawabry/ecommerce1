
import mongoose, {Schema,Types,model} from 'mongoose';
const catagorySchema = new Schema ({
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

catagorySchema.virtual('subCatagory',{
    localField:'_id',
    foreignField : 'catagoryId',
    ref:'SubCatagory'

})



const catagoryModel = mongoose.models.Catagory||  model('Catagory', catagorySchema);
export default catagoryModel;