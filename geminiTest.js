import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";

import productServiceMetaModel from "./model/productServiceMeta.model.js";
import productServiceModel from "./model/Brand/productService.model.js";
import targetAudienceModel from "./model/targetAudience.model.js";
import Brand from "./model/Brand/brand.model.js";
import SubBrand from "./model/Brand/subBrand.model.js";
import Category from "./model/Brand/category.model.js";
import SubCategory from "./model/Brand/subCategory.model.js";

dotenv.config();
const genAI = new GoogleGenerativeAI("AIzaSyDc3Q5b-Im6e5jFon-oHBcSzB2WaCi61j4");
const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

// parameter to be passed for security of response using gemini api
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// function to work with gemini api, passing prompt and processing response for base village
async function getAIResponse(
  ProductName,
  TargetAudience,
  Location,
  USP,
  Feature,
  Description,
  PainPoints,
  Attributes
) {
  return new Promise(async (resolve, reject) => {
    // getting instance of model
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings,
    });
    const prompt = `
Imagine you are both an SEO manager and a content writer. You are tasked with writing a blog post for ${ProductName}. This blog post is targeted towards ${TargetAudience} who are located in ${Location}. The target audience faces the following pain points: ${PainPoints}. The ${ProductName} offers the following features, description, unique selling points ${USP}, and attributes: ${
      (Feature, Description, USP, Attributes)
    }.

Please generate a sample blog post for an occasion such as Diwali. Ensure the content is engaging, informative, and optimized for SEO. Format the output in Markdown. The blog post should include:

1. Introduction:
   - Introduce the ${ProductName} and its relevance to the Diwali.
   - Mention the target audience and location to create a connection.

2. Understanding the Pain Points:
   - Discuss the pain points of the target audience in detail.
   - Explain how these pain points affect their daily lives or specific situations.

3. Introducing ${ProductName}:
   - Provide an overview of the product, highlighting its features, description, USP, and attributes.
   - Explain how the product addresses the pain points of the target audience.

4. Benefits of Using ${ProductName}:
   - Highlight the benefits of using the product, emphasizing its effectiveness in solving the target audience's problems.
   - Provide real-life examples or hypothetical scenarios to illustrate the benefits.

5. Usage Tips and Best Practices:
   - Offer tips on how to use the product effectively.
   - Suggest best practices for maximizing the product's benefits.

6. Conclusion:
   - Summarize the key points discussed in the blog.
   - Reinforce the value of the product and encourage the target audience to consider it for their needs.

Additional Requirements:
- Use a conversational and engaging tone to make the content relatable.
- Incorporate relevant keywords naturally throughout the blog to optimize for SEO.
- Add at least two relevant images or visuals to enhance the content.
- Format the entire blog post in Markdown.
`;
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    resolve(text);
    reject("No response");
  });
}

app.post("/api/test/longform", async (req, res) => {
  const reqObj = req.body;
  if (
    mongoose.isValidObjectId(reqObj.productId) &&
    reqObj.productName &&
    reqObj.targetAudience
  ) {
    const productDetails = await productServiceMetaModel.findOne({
      productServiceId: reqObj.productId,
    });
    const productData = await productServiceModel
      .findById(reqObj.productId)
      .select("name");
    console.log(productDetails);
    // Function
    const aiResponse = await getAIResponse(
      productData.name,
      reqObj.targetAudience.name,
      reqObj.targetAudience.Location,
      productDetails.usp,
      productDetails.feature,
      productDetails.description,
      reqObj.targetAudience.painPoints,
      productDetails.attributes
    );
    console.log(aiResponse);
    res.json({ response: aiResponse });
  } else {
    res.json({ response: "Insufficient data" });
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log(`Server is running on port ${5000}`);
    });
  })
  .catch((err) => console.log("Failed to connect to MongoDB", err));
