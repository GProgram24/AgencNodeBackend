import Brand from "../../model/Brand/brand.model.js";
import SubBrand from "../../model/Brand/subBrand.model.js";
import Category from "../../model/Brand/category.model.js";
import SubCategory from "../../model/Brand/subCategory.model.js";
import ProductService from "../../model/Brand/productService.model.js";
import mongoose from "mongoose";
import cleanBrandArchitecture from "./cleanBrandArchitecture.controller.js";

export const fetchBrandHierarchy = async (req, res) => {
    try {
        const brandDetails = await Brand.findOne({ name: req.params.brandName });
        // Fetch the architecture if brand details found
        if (brandDetails) {
            const brandArchitecture = await Brand.findOne({ name: req.params.brandName })
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
            // Clean the empty arrays in object obtained
            const cleanedArchitecture = cleanBrandArchitecture(brandArchitecture)
            return res.status(200).json({ brand: [cleanedArchitecture] });
        } else {
            // If no brand details are found
            return res.status(404).json({ message: "Brand not found" });
        }
    } catch (error) {
        console.log('Error fetching brand hierarchy:', error);
        return res.status(500).json({ message: "Server error" });
    }
}
