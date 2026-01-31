import express from 'express'
import 'dotenv/config';
import database from './config/db.js';
import User from './models/user.js';
import userRoute from './routes/userRoutes.js'
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js"

import cors from 'cors';
import path from "path";
import paymentRoutes from "./routes/payment.routes.js"
import downloadRoutes from "./routes/DownloadToken.route.js"
import webhookRoute from "./routes/webhookRoute.js"







const app = express();

const port = process.env.PORT || 8000;



database();
app.use("/webhook", webhookRoute);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://americanpublishingsolutions.com",
      "https://ryanleehastings.com"
    ],
    credentials: true,
  })
);



app.use('/api',userRoute);
app.use("/api/products", productRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/download", downloadRoutes);



app.use("/images", express.static(path.join(path.resolve(), "public/images")));
app.use("/audio", express.static(path.join(path.resolve(), "public/audio")));

app.get('/', (req, res) => {
  res.send("backend is running ✅");
});


app.listen(port,()=>{
    console.log(`beckend is running ${port}`)
})