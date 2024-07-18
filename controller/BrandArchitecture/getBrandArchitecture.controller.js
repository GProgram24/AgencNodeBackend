import Brand from "../../model/Brand/brand.model.js";
import SubBrand from "../../model/Brand/subBrand.model.js";
import Category from "../../model/Brand/category.model.js";
import SubCategory from "../../model/Brand/subCategory.model.js";
import ProductService from "../../model/Brand/productService.model.js";
import mongoose from "mongoose";

export const fetchBrandHierarchy = async (req, res) => {
    try {
        const brandId = new mongoose.Types.ObjectId(req.body.brandId);
        // Fetch the main brand
        const brand = await Brand.findById(brandId)
            .populate({
                path: 'subBrands',
                populate: {
                    path: 'categories',
                    populate: {
                        path: 'subCategories',
                        populate: {
                            path: 'products'
                        }
                    }
                }
            })
            .populate({
                path: 'categories',
                populate: {
                    path: 'subCategories',
                    populate: {
                        path: 'products'
                    }
                }
            })
            .populate({
                path: 'subCategories',
                populate: {
                    path: 'products'
                }
            })
            .populate('products');
        // need to clean the empty arrays in object obtained
        return res.status(200).json(brand);
    } catch (error) {
        console.error('Error fetching brand hierarchy:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
