import brandModel from "../../model/Brand/brand.model.js";
import subBrandModel from "../../model/Brand/subBrand.model.js";
import categoryModel from "../../model/Brand/category.model.js";
import SubCategoryModel from "../../model/Brand/subCategory.model.js";
import productServiceModel from "../../model/Brand/productService.model.js";
import cleanBrandArchitecture from "./cleanBrandArchitecture.controller.js";

export const saveBrandArchitecture = async (req, res) => {
  const brandData = req.body;

  try {
    // Create and save the brand
    console.log("Saving brand:", brandData.name);
    const brand = new brandModel({
      name: brandData.name,
      subBrands: [],
      categories: [],
      subCategories: [],
      products: [],
    });
    await brand.save();
    console.log("Brand saved:", brand);

    if (brandData.subBrands && brandData.subBrands.length > 0) {
      for (const subBrandData of brandData.subBrands) {
        // Create and save sub-brand
        console.log("Saving sub-brand:", subBrandData.name);
        const subBrand = new subBrandModel({
          name: subBrandData.name,
          categories: [],
          subCategories: [],
          products: [],
        });
        await subBrand.save();
        console.log("Sub-brand saved:", subBrand);
        brand.subBrands.push(subBrand._id);

        if (subBrandData.categories && subBrandData.categories.length > 0) {
          for (const categoryData of subBrandData.categories) {
            // Create and save category
            console.log("Saving category:", categoryData.name);
            const category = new categoryModel({
              name: categoryData.name,
              subCategories: [],
              products: [],
            });
            await category.save();
            console.log("Category saved:", category);
            subBrand.categories.push(category._id);

            if (
              categoryData.subCategories &&
              categoryData.subCategories.length > 0
            ) {
              for (const subCategoryData of categoryData.subCategories) {
                // Create and save sub-category
                console.log("Saving sub-category:", subCategoryData.name);
                const subCategory = new SubCategoryModel({
                  name: subCategoryData.name,
                  products: [],
                });
                await subCategory.save();
                console.log("Sub-category saved:", subCategory);
                category.subCategories.push(subCategory._id);

                if (
                  subCategoryData.products &&
                  subCategoryData.products.length > 0
                ) {
                  for (const productData of subCategoryData.products) {
                    // Create and save product
                    console.log("Saving product:", productData.name);
                    const product = new productServiceModel({
                      name: productData.name,
                      subCategory: subCategory._id,
                      category: category._id,
                      subBrand: subBrand._id,
                      brand: brand._id,
                    });
                    await product.save();
                    console.log("Product saved:", product);
                    subCategory.products.push(product._id);
                  }
                }
                await subCategory.save(); // Save sub-category after adding products
                console.log("Sub-category updated with products:", subCategory);
              }
            } else if (
              categoryData.products &&
              categoryData.products.length > 0
            ) {
              for (const productData of categoryData.products) {
                // Create and save product directly under category
                console.log(
                  "Saving product directly under category:",
                  productData.name
                );
                const product = new productServiceModel({
                  name: productData.name,
                  category: category._id,
                  subBrand: subBrand._id,
                  brand: brand._id,
                });
                await product.save();
                console.log("Product saved:", product);
                category.products = category.products || [];
                category.products.push(product._id);
              }
            }
            await category.save(); // Save category after adding sub-categories or products
            console.log(
              "Category updated with sub-categories/products:",
              category
            );
          }
        }

        if (
          subBrandData.subCategories &&
          subBrandData.subCategories.length > 0
        ) {
          for (const subCategoryData of subBrandData.subCategories) {
            // Create and save sub-category directly under sub-brand
            console.log(
              "Saving sub-category directly under sub-brand:",
              subCategoryData.name
            );
            const subCategory = new SubCategoryModel({
              name: subCategoryData.name,
              products: [],
            });
            await subCategory.save();
            console.log("Sub-category saved:", subCategory);
            subBrand.subCategories.push(subCategory._id);

            if (
              subCategoryData.products &&
              subCategoryData.products.length > 0
            ) {
              for (const productData of subCategoryData.products) {
                // Create and save product directly under sub-category
                console.log(
                  "Saving product directly under sub-category:",
                  productData.name
                );
                const product = new productServiceModel({
                  name: productData.name,
                  subCategory: subCategory._id,
                  subBrand: subBrand._id,
                  brand: brand._id,
                });
                await product.save();
                console.log("Product saved:", product);
                subCategory.products.push(product._id);
              }
            }
            await subCategory.save(); // Save sub-category after adding products
            console.log("Sub-category updated with products:", subCategory);
          }
        }

        if (subBrandData.products && subBrandData.products.length > 0) {
          for (const productData of subBrandData.products) {
            // Create and save product directly under sub-brand
            console.log(
              "Saving product directly under sub-brand:",
              productData.name
            );
            const product = new productServiceModel({
              name: productData.name,
              subBrand: subBrand._id,
              brand: brand._id,
            });
            await product.save();
            console.log("Product saved:", product);
            subBrand.products = subBrand.products || [];
            subBrand.products.push(product._id);
          }
        }
        await subBrand.save(); // Save sub-brand after adding categories/sub-categories/products
        console.log(
          "Sub-brand updated with categories/sub-categories/products:",
          subBrand
        );
      }
    }

    if (brandData.categories && brandData.categories.length > 0) {
      for (const categoryData of brandData.categories) {
        // Create and save category directly under brand
        console.log("Saving category directly under brand:", categoryData.name);
        const category = new categoryModel({
          name: categoryData.name,
          subCategories: [],
          products: [],
        });
        await category.save();
        console.log("Category saved:", category);
        brand.categories.push(category._id);

        if (
          categoryData.subCategories &&
          categoryData.subCategories.length > 0
        ) {
          for (const subCategoryData of categoryData.subCategories) {
            // Create and save sub-category
            console.log("Saving sub-category:", subCategoryData.name);
            const subCategory = new SubCategoryModel({
              name: subCategoryData.name,
              products: [],
            });
            await subCategory.save();
            console.log("Sub-category saved:", subCategory);
            category.subCategories.push(subCategory._id);

            if (
              subCategoryData.products &&
              subCategoryData.products.length > 0
            ) {
              for (const productData of subCategoryData.products) {
                // Create and save product
                console.log("Saving product:", productData.name);
                const product = new productServiceModel({
                  name: productData.name,
                  subCategory: subCategory._id,
                  category: category._id,
                  brand: brand._id,
                });
                await product.save();
                console.log("Product saved:", product);
                subCategory.products.push(product._id);
              }
            }
            await subCategory.save(); // Save sub-category after adding products
            console.log("Sub-category updated with products:", subCategory);
          }
        } else if (categoryData.products && categoryData.products.length > 0) {
          for (const productData of categoryData.products) {
            // Create and save product directly under category
            console.log(
              "Saving product directly under category:",
              productData.name
            );
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
        console.log("Category updated with sub-categories/products:", category);
      }
    }

    if (brandData.subCategories && brandData.subCategories.length > 0) {
      for (const subCategoryData of brandData.subCategories) {
        // Create and save sub-category directly under brand
        console.log(
          "Saving sub-category directly under brand:",
          subCategoryData.name
        );
        const subCategory = new SubCategoryModel({
          name: subCategoryData.name,
          products: [],
        });
        await subCategory.save();
        console.log("Sub-category saved:", subCategory);
        brand.subCategories.push(subCategory._id);

        if (subCategoryData.products && subCategoryData.products.length > 0) {
          for (const productData of subCategoryData.products) {
            // Create and save product directly under sub-category
            console.log(
              "Saving product directly under sub-category:",
              productData.name
            );
            const product = new productServiceModel({
              name: productData.name,
              subCategory: subCategory._id,
              brand: brand._id,
            });
            await product.save();
            console.log("Product saved:", product);
            subCategory.products.push(product._id);
          }
        }
        await subCategory.save(); // Save sub-category after adding products
        console.log("Sub-category updated with products:", subCategory);
      }
    }

    if (brandData.products && brandData.products.length > 0) {
      for (const productData of brandData.products) {
        // Create and save product directly under brand
        console.log("Saving product directly under brand:", productData.name);
        const product = new productServiceModel({
          name: productData.name,
          brand: brand._id,
        });
        await product.save();
        console.log("Product saved:", product);
        brand.products = brand.products || [];
        brand.products.push(product._id);
      }
    }

    await brand.save(); // Save brand after adding sub-brands/categories/sub-categories/products
    console.log(
      "Brand updated with sub-brands/categories/sub-categories/products:",
      brand
    );

    // Populate the brand architecture
    console.log("Populating brand architecture...");
    const populatedBrand = await brandModel
      .findById(brand._id)
      .populate({
        path: "subBrands",
        populate: {
          path: "categories subCategories products",
        },
      })
      .populate({
        path: "categories",
        populate: {
          path: "subCategories products",
        },
      })
      .populate({
        path: "subCategories",
        populate: {
          path: "products",
        },
      })
      .populate("products");

    // Clean the populated brand architecture
    const cleanedBrand = cleanBrandArchitecture(populatedBrand);

    console.log("Populated brand architecture:", cleanedBrand);
    res.status(201).json(cleanedBrand);
  } catch (err) {
    console.error("Error saving brand architecture:", err);
    res
      .status(500)
      .json({ error: "Error saving brand architecture: " + err.message });
  }
};
