import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import logger from "morgan";

import productServiceRoutes from './router/productServiceRoute.js';
import categoryRoutes from './router/categoryRoute.js';
import subBrandRoutes from './router/subBrandRoute.js';
import brandRoutes from './router/brandRoute.js';
import targetGroupRoutes from './router/targetGroupRoute.js';
import projectRoutes from './router/projectRoute.js';
import userRoutes from './router/userRoute.js';
import productServiceMetaRoutes from './router/productServiceMetaRoute.js';
import targetAudienceRoutes from './router/targetAudienceRoute.js';
import communicationGoalsRoutes from './router/communicationGoalRoute.js';
import userBrandRoutes from './router/userBrandRoute.js';
import userSectorRoutes from './router/userSectorRoute.js';
import technologyRoutes from './router/technologyRoute.js';
import sectorRoutes from './router/sectorRoute.js';
import quarterRoutes from './router/quarterRoute.js'; 
import login from "./router/login.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(bodyParser.json());
app.use(logger('dev'));


app.get('/', (req, res)=>{
  res.json("working");
})

app.use('/login', login);
app.use('/product-services', productServiceRoutes);
app.use('/categories', categoryRoutes);
app.use('/sub-brands', subBrandRoutes);
app.use('/brands', brandRoutes);
app.use('/target-groups', targetGroupRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);
app.use('/product-service-metas', productServiceMetaRoutes);
app.use('/target-audiences', targetAudienceRoutes);
app.use('/communication-goals', communicationGoalsRoutes);
app.use('/user-brands', userBrandRoutes);
app.use('/user-sectors', userSectorRoutes);
app.use('/technologies', technologyRoutes);
app.use('/sectors', sectorRoutes);
app.use('/quarters', quarterRoutes);
// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
