import foodModel from "../model/foodModel.js";
import userModel from "../model/userModel.js";

const addToCart = async(req,res)=>{
   try {
         const { userId, itemId } = req.body;

       // Validate input
       if (!userId ) {
          return res.status(400).json({ success: false, message: "Missing userID " });
       }
       if (!itemId) {
          return res.status(400).json({ success: false, message: "Missing itemId" });
       }
   let userData = await userModel.findOne({ _id:userId });
    let cartData = await userData.cartData;
    if(!cartData[itemId]){
      cartData[itemId] = 1;
    }
    else{
      cartData[itemId] += 1;
    }
    await userModel.findByIdAndUpdate(userId,{cartData});
    res.json({success:true,message:"Added TO Cart"})   
   } catch (error) {
      console.log(error);
      res.json({success:false,message:"Error"}) 
   }
}

 


const removeFromCart = async(req,res)=>{
    try {
            const { userId, itemId } = req.body;
          if (!userId ) {
             return res.status(400).json({ success: false, message: "Missing userID " });
          }
          if (!itemId) {
             return res.status(400).json({ success: false, message: "Missing itemId" });
          }
         let userData = await userModel.findById({ _id:userId });
         let cartData = await userData.cartData;
         if(cartData[itemId] > 0){
           cartData[itemId] -= 1;
         }
         await userModel.findByIdAndUpdate(userId,{cartData});
         res.json({success:true,message:"Removed  from Cart"})   
      } catch (error) {
         console.log(error);
         res.json({success:false,message:"Error in removing food from cart"}) 
      }
}

//Fetch user cart data
const getCart = async (req,res)=>{
    try {
      const { userId } = req.body;
    if (!userId ) {
       return res.status(400).json({ success: false, message: "Missing userID " });
    }
    let userData = await userModel.findById({ _id:userId });
    let cartData = await userData.cartData;
   res.json({success:true,cartData})   
} catch (error) {
   console.log(error);
   res.json({success:false,message:"Error in getting food items from cart"}) 
}
}

export {addToCart,removeFromCart,getCart} 