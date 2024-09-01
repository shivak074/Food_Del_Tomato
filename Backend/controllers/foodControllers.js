import foodModel from "../model/foodModel.js";
import fs from 'fs/promises';
import { uploadOnCloudnary } from "../utils/cloudnary.js";

// Add food item
const addFood = async (req, res) => {
    const foodImgPath = req.file?.path; // Ensure you use req.file for single file uploads

    if (!foodImgPath) {
        return res.status(400).json({ success: false, message: "Image not provided" });
    }

    try {
        // Log the file path for debugging
        console.log("Received file path:", foodImgPath);

        // Upload image to Cloudinary
        const uploadResponse = await uploadOnCloudnary(foodImgPath);
        if (!uploadResponse) {
            return res.status(500).json({ success: false, message: "Error uploading image to cloudnary" });
        }

        // Log the upload response
        console.log("Upload response:", uploadResponse);

        // Create and save food item
        const food = new foodModel({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: uploadResponse.secure_url // Use the URL from Cloudinary
        });

        await food.save();
        res.json({ success: true, message: "Food added successfully" });
    } catch (error) {
        console.error('Error adding food:', error);
        res.status(500).json({ success: false, message: "Error adding food" });
    }
};

// List all food items
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods });
    } catch (error) {
        console.error('Error listing food:', error);
        res.status(500).json({ success: false, message: "Error listing food" });
    }
};

// Remove food item
const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food not found" });
        }

        // Log the food item being removed
        console.log("Removing food:", food);

        // If you were saving images locally before uploading, remove the local file
        // fs.unlink(`./public/temp/${food.image}`, () => {});

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({ success: true, message: "Food removed successfully" });
    } catch (error) {
        console.error('Error removing food:', error);
        res.status(500).json({ success: false, message: "Error removing food" });
    }
};

export { addFood, listFood, removeFood };




// import foodModel from "../model/foodModel.js";
// import fs from 'fs'
// import { uploadOnCloudnary } from "../utils/cloudnary.js";

// //add food item

// // const addFood = async (req,res)=>{
// //   let image_filename = `${req.file.filename}`;

// //   const food = new foodModel({
// //     name:req.body.name,
// //     description:req.body.description,
// //     price:req.body.price,
// //     category:req.body.category,
// //     image:image_filename
// //   })
// //   try{
// //     await food.save();
// //     res.json({success:true,message:"Food Added"})
// //   }
// //   catch(error){
// //     console.log(error)
// //     res.json({success:false,message:"Error"})
// //   }
// // }

// const addFood = async (req,res)=>{
//   const foodimgpath = req.files?.img[0]?.path;
//   if (!foodimgpath) {
//       throw new ApiError(400, "image not there");
//   }
//   const foodimg = await uploadOnCloudnary(foodimgpath);
//   const food = new foodModel({
//     name:req.body.name,
//     description:req.body.description,
//     price:req.body.price,
//     category:req.body.category,
//     image:foodimg
//   })
//   try{
//     await food.save();
//     res.json({success:true,message:"Food Added"})
//   }
//   catch(error){
//     console.log(error)
//     res.json({success:false,message:"Error"})
//   }
// }
// //all food list

// const listFood = async (req,res)=>{
//    try{
//     const foods = await foodModel.find({})
//     res.json({success:true,data:foods})
//    }
//    catch(error){
//     console.log(error)
//     res.json({success:true,message:"Error in Listing Food"})
//    }
// }

// const removeFood = async (req,res)=>{
//     try{
//      const foods = await foodModel.findById(req.body.id)
//      fs.unlink(`Uploads/${foods.image}`,()=>{})
//      await foodModel.findByIdAndDelete(req.body.id)
//      res.json({success:true,message:"Food Removed"})
//     }
//     catch(error){
//      console.log(error)
//      res.json({success:false,message:"Error in removing Food"})
//     }
//  }
// //remove food item 


// export {addFood,listFood,removeFood}
