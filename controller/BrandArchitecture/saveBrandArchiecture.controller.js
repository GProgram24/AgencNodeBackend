import brandModel from "../../model/Brand/brand.model.js";
import subBrandModel from "../../model/Brand/subBrand.model.js";
import categoryModel from "../../model/Brand/category.model.js";
import SubCategoryModel from "../../model/Brand/subCategory.model.js";
import productServiceModel from "../../model/Brand/productService.model.js";

export const saveBrandArchitecture = async (req, res) => {
  const brandData = req.body;

  try {
    // Create and save the brand
    console.log("Saving brand:", brandData.name);
    const brand = new brandModel({
      name: brandData.name,
      brandAdmin: brandData.brandAdmin,
      createdBy: brandData.createdBy,
      subBrands: [],
    });
    await brand.save();
    console.log("Brand saved:", brand);

    for (const subBrandData of brandData.subBrands) {
      // Create and save sub-brand
      console.log("Saving sub-brand:", subBrandData.name);
      const subBrand = new subBrandModel({
        name: subBrandData.name,
        userId: subBrandData.userId,
        categories: [],
      });
      await subBrand.save();
      console.log("Sub-brand saved:", subBrand);
      brand.subBrands.push(subBrand._id);

      for (const categoryData of subBrandData.categories) {
        // Create and save category
        console.log("Saving category:", categoryData.name);
        const category = new categoryModel({
          name: categoryData.name,
          subCategories: [],
        });
        await category.save();
        console.log("Category saved:", category);
        subBrand.categories.push(category._id);

        for (const subCategoryData of categoryData.subCategories) {
          // Create and save sub-category
          console.log("Saving sub-category:", subCategoryData.name);
          const subCategory = new SubCategoryModel({
            name: subCategoryData.name,
            description: subCategoryData.description,
            products: [],
          });
          await subCategory.save();
          console.log("Sub-category saved:", subCategory);
          category.subCategories.push(subCategory._id);

          for (const productData of subCategoryData.products) {
            // Create and save product
            console.log("Saving product:", productData.name);
            const product = new productServiceModel({
              name: productData.name,
            });
            await product.save();
            console.log("Product saved:", product);
            subCategory.products.push(product._id);
          }
          await subCategory.save(); // Save sub-category after adding products
          console.log("Sub-category updated with products:", subCategory);
        }
        await category.save(); // Save category after adding sub-categories
        console.log("Category updated with sub-categories:", category);
      }
      await subBrand.save(); // Save sub-brand after adding categories
      console.log("Sub-brand updated with categories:", subBrand);
    }
    await brand.save(); // Save brand after adding sub-brands
    console.log("Brand updated with sub-brands:", brand);

    // Populate the brand architecture
    console.log("Populating brand architecture...");
    const populatedBrand = await brandModel.findById(brand._id).populate({
      path: "subBrands",
      populate: {
        path: "categories",
        populate: {
          path: "subCategories",
          populate: {
            path: "products",
          },
        },
      },
    });

    console.log("Populated brand architecture:", populatedBrand);
    res.status(201).json(populatedBrand);
  } catch (err) {
    console.error("Error saving brand architecture:", err);
    res
      .status(500)
      .json({ error: "Error saving brand architecture: " + err.message });
  }
};
