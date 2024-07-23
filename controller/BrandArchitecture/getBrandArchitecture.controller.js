import Brand from "../../model/Brand/brand.model.js";
import SubBrand from "../../model/Brand/subBrand.model.js";
import Category from "../../model/Brand/category.model.js";
import SubCategory from "../../model/Brand/subCategory.model.js";
import ProductService from "../../model/Brand/productService.model.js";
import mongoose from "mongoose";
import cleanBrandArchitecture from "./cleanBrandArchitecture.controller.js";

export const fetchBrandHierarchy = async (req, res) => {
    try {
        const brandDetails = await Brand.findOne({ name: req.body.brand });
        const brandId = brandDetails._id;
        // Fetch the main brand
        const brandArchitecture = await Brand.findById(brandId)
            .select("-_id -createdAt -updatedAt -__v -managedBy -accountId -_id")
            .populate({
                path: 'subBrands',
                select: "-_id -createdAt -updatedAt -__v",
                populate: {
                    path: 'categories',
                    select: "-_id -createdAt -updatedAt -__v",
                    populate: {
                        path: 'subCategories',
                        select: "-_id -createdAt -updatedAt -__v",
                        populate: {
                            path: 'products',
                            select: "-createdAt -updatedAt -subCategory -category -subBrand -brand -__v"
                        }
                    }
                }
            })
            .populate({
                path: 'categories',
                select: "-_id -createdAt -updatedAt -__v",
                populate: {
                    path: 'subCategories',
                    select: "-_id -createdAt -updatedAt -__v",
                    populate: {
                        path: 'products',
                        select: "-createdAt -updatedAt -subCategory -category -subBrand -brand -__v"
                    }
                }
            })
            .populate({
                path: 'subCategories',
                select: "-_id -createdAt -updatedAt -__v",
                populate: {
                    path: 'products',
                    select: "-createdAt -updatedAt -subCategory -category -subBrand -brand -__v"
                }
            })
            .populate({
                path: "products",
                select: "-createdAt -updatedAt -subCategory -category -subBrand -brand -__v"
            });
        // need to clean the empty arrays in object obtained
        const cleanedArchitecture = cleanBrandArchitecture(brandArchitecture)
        return res.status(200).json({ brand: [cleanedArchitecture] });
    } catch (error) {
        console.error('Error fetching brand hierarchy:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
