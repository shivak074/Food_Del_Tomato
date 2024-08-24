import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
       name: {
            type: String,
            required: true,
            trim: true 
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        cartData: {
            type: Object,
            default: {}
        }
    },
    {
        timestamps: true,
        minimize: false // Ensure that empty objects are not removed
    }
)

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}


 
 const userModel = mongoose.models.User || mongoose.model("User", userSchema)
 export default userModel;