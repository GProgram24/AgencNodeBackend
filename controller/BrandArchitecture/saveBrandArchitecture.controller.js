import brandModel from "../../model/Brand/brand.model.js";
import subBrandModel from "../../model/Brand/subBrand.model.js";
import categoryModel from "../../model/Brand/category.model.js";
import SubCategoryModel from "../../model/Brand/subCategory.model.js";
import productServiceModel from "../../model/Brand/productService.model.js";

export const saveBrandArchitecture = async (req, res) => {
  const brandData = req.body;

  try {
    // get the brand
    const brand = await brandModel.findOne({ name: brandData.brand });
    if (brand) {
      if (brandData.subBrands && brandData.subBrands.length > 0) {
        for (const subBrandData of brandData.subBrands) {
          // Create and save sub-brand
          const subBrand = new subBrandModel({
            name: subBrandData.name,
            categories: [],
            subCategories: [],
            products: [],
          });
          await subBrand.save();
          brand.subBrands.push(subBrand._id);

          if (subBrandData.categories && subBrandData.categories.length > 0) {
            for (const categoryData of subBrandData.categories) {
              // Create and save category
              const category = new categoryModel({
                name: categoryData.name,
                subCategories: [],
                products: [],
              });
              await category.save();
              subBrand.categories.push(category._id);

              if (
                categoryData.subCategories &&
                categoryData.subCategories.length > 0
              ) {
                for (const subCategoryData of categoryData.subCategories) {
                  // Create and save sub-category
                  const subCategory = new SubCategoryModel({
                    name: subCategoryData.name,
                    products: [],
                  });
                  await subCategory.save();
                  category.subCategories.push(subCategory._id);

                  if (
                    subCategoryData.products &&
                    subCategoryData.products.length > 0
                  ) {
                    for (const productData of subCategoryData.products) {
                      // Create and save product
                      const product = new productServiceModel({
                        name: productData.name,
                        subCategory: subCategory._id,
                        category: category._id,
                        subBrand: subBrand._id,
                        brand: brand._id,
                      });
                      await product.save();
                      subCategory.products.push(product._id);
                    }
                  }
                  await subCategory.save(); // Save sub-category after adding products
                }
              } else if (
                categoryData.products &&
                categoryData.products.length > 0
              ) {
                for (const productData of categoryData.products) {
                  // Create and save product directly under category
                  const product = new productServiceModel({
                    name: productData.name,
                    category: category._id,
                    subBrand: subBrand._id,
                    brand: brand._id,
                  });
                  await product.save();
                  category.products = category.products || [];
                  category.products.push(product._id);
                }
              }
              await category.save(); // Save category after adding sub-categories or products
            }
          }

          if (
            subBrandData.subCategories &&
            subBrandData.subCategories.length > 0
          ) {
            for (const subCategoryData of subBrandData.subCategories) {
              // Create and save sub-category directly under sub-brand
              const subCategory = new SubCategoryModel({
                name: subCategoryData.name,
                products: [],
              });
              await subCategory.save();
              subBrand.subCategories.push(subCategory._id);

              if (
                subCategoryData.products &&
                subCategoryData.products.length > 0
              ) {
                for (const productData of subCategoryData.products) {
                  // Create and save product directly under sub-category
                  const product = new productServiceModel({
                    name: productData.name,
                    subCategory: subCategory._id,
                    subBrand: subBrand._id,
                    brand: brand._id,
                  });
                  await product.save();
                  subCategory.products.push(product._id);
                }
              }
              await subCategory.save(); // Save sub-category after adding products
            }
          }

          if (subBrandData.products && subBrandData.products.length > 0) {
            for (const productData of subBrandData.products) {
              // Create and save product directly under sub-brand
              const product = new productServiceModel({
                name: productData.name,
                subBrand: subBrand._id,
                brand: brand._id,
              });
              await product.save();
              subBrand.products = subBrand.products || [];
              subBrand.products.push(product._id);
            }
          }
          await subBrand.save(); // Save sub-brand after adding categories/sub-categories/products
        }
      }

      if (brandData.categories && brandData.categories.length > 0) {
        for (const categoryData of brandData.categories) {
          // Create and save category directly under brand
          const category = new categoryModel({
            name: categoryData.name,
            subCategories: [],
            products: [],
          });
          await category.save();
          brand.categories.push(category._id);

          if (
            categoryData.subCategories &&
            categoryData.subCategories.length > 0
          ) {
            for (const subCategoryData of categoryData.subCategories) {
              // Create and save sub-category
              const subCategory = new SubCategoryModel({
                name: subCategoryData.name,
                products: [],
              });
              await subCategory.save();
              category.subCategories.push(subCategory._id);

              if (
                subCategoryData.products &&
                subCategoryData.products.length > 0
              ) {
                for (const productData of subCategoryData.products) {
                  // Create and save product
                  const product = new productServiceModel({
                    name: productData.name,
                    subCategory: subCategory._id,
                    category: category._id,
                    brand: brand._id,
                  });
                  await product.save();
                  subCategory.products.push(product._id);
                }
              }
              await subCategory.save(); // Save sub-category after adding products
            }
          } else if (categoryData.products && categoryData.products.length > 0) {
            for (const productData of categoryData.products) {
              // Create and save product directly under category
              const product = new productServiceModel({
                name: productData.name,
                category: category._id,
                brand: brand._id,
              });
              await product.save();
              console.log("Product saved:", product);
              category.products = category.products || [];
              category.products.push(product._id);
            }
          }
          await category.save(); // Save category after adding sub-categories or products
        }
      }

      if (brandData.subCategories && brandData.subCategories.length > 0) {
        for (const subCategoryData of brandData.subCategories) {
          // Create and save sub-category directly under brand
          const subCategory = new SubCategoryModel({
            name: subCategoryData.name,
            products: [],
          });
          await subCategory.save();
          brand.subCategories.push(subCategory._id);

          if (subCategoryData.products && subCategoryData.products.length > 0) {
            for (const productData of subCategoryData.products) {
              // Create and save product directly under sub-category
              const product = new productServiceModel({
                name: productData.name,
                subCategory: subCategory._id,
                brand: brand._id,
              });
              await product.save();
              subCategory.products.push(product._id);
            }
          }
          await subCategory.save(); // Save sub-category after adding products
        }
      }

      if (brandData.products && brandData.products.length > 0) {
        for (const productData of brandData.products) {
          // Create and save product directly under brand
          const product = new productServiceModel({
            name: productData.name,
            brand: brand._id,
          });
          await product.save();
          brand.products = brand.products || [];
          brand.products.push(product._id);
        }
      }

      await brand.save(); // Save brand after adding sub-brands/categories/sub-categories/products

      return res.status(201).json({ message: "successful" });
    }
    else {
      return res.status(404).json({ message: "No such brand exits" })
    };
  } catch (err) {
    console.error("Error saving brand architecture:", err);
    res.status(500).json({ error: "Error saving brand architecture: " + err.message });
  }
};
