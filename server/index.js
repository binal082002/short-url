require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const linksRouter = require("./routes/link.route");
const Link = require("./models/link.model");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Route: API
app.use("/api/links", linksRouter);

app.get("/healthz", (req, res) => {
  res.status(200).json({
    ok: true,
    version: "1.0",
    timestamp: new Date().toISOString(),
  });
});

// // Redirect route (must be after API routes)
// app.get('/:shortId', async (req, res, next) => {
//   // delegate to controller logic using Link model (keeping minimal here)
//   try {
//     const { shortId } = req.params;
//     const link = await Link.findOne({ shortId });
//     if (!link) return res.status(404).json({ error: 'Short link not found' });

//     const click = {
//       ip: req.ip || req.headers['x-forwarded-for'] || '',
//       userAgent: req.get('User-Agent') || '',
//       referrer: req.get('Referrer') || req.get('Referer') || ''
//     };

//     link.clicks = (link.clicks || 0) + 1;
//     link.lastAccessedAt = new Date();
//     link.clicksData.push(click);
//     if (link.clicksData.length > 1000) {
//       link.clicksData = link.clicksData.slice(-1000);
//     }
//     await link.save();
//     return res.redirect(link.originalUrl);
//   } catch (err) {
//     next(err);
//   }
// });

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
