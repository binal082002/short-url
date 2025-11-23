const Link = require("../models/link.model");
const validator = require("validator");
const crypto = require("crypto");

//function to generate short IDs
function generateShortCode() {
  return crypto
    .randomBytes(7)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 8);
}

/**
 * Create shortened url
 * body: { originalUrl, customCode }
 */
exports.createLink = async (req, res) => {
  try {
    let { originalUrl, customCode } = req.body;
    if (
      !originalUrl ||
      !validator.isURL(originalUrl, { require_protocol: true })
    ) {
      return res
        .status(400)
        .json({
          error: "Invalid or missing originalUrl. Include protocol (https://).",
        });
    }

    if (customCode && customCode.length > 8)
      return res.status(400).json({ error: "Short code length must be 6." });

    if (customCode) {
      const existShortCode = await Link.findOne({ shortCode: customCode });
      if (existShortCode) {
        return createResponse(
          res,
          resStatusCode.BAD_REQUEST,
          "Short url already exist!"
        );
      }
    } else {
      let existShortCode;
      do {
        customCode = generateShortCode();
        existShortCode = await Link.findOne({ shortCode: customCode });
      } while (existShortCode);
    }

    const url = new Link({
      originalUrl,
      shortCode : customCode,
    });

    await url.save();

    return res.status(201).json({
      id: url._id,
      originalUrl: url.originalUrl,
      shortUrl: `${
        process.env.BASE_URL ||
        req.get("origin") ||
        req.protocol + "://" + req.get("host")
      }/${url.shortCode}`,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Redirect handler
 * GET /:code
 */
exports.handleRedirect = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Link.findOne({ shortCode:code });
    if (!url) return res.status(404).json({ error: "Short url not found" });

    // increment click and store minimal info
    const click = {
      ip: req.ip || req.headers["x-forwarded-for"] || "",
      userAgent: req.get("User-Agent") || "",
      referrer: req.get("Referrer") || req.get("Referer") || "",
    };

    url.clicks = (url.clicks || 0) + 1;
    url.lastAccessedAt = new Date();
    url.clicksData.push(click);
    if (url.clicksData.length > 1000) {
      url.clicksData = url.clicksData.slice(-1000);
    }
    await url.save();

    return res.status(200).json(url);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * List links with pagination
 * GET /api/links?page=1&limit=20&search="code"
 */
exports.listLinks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 200);
    const skip = (page - 1) * limit;

    const search = req.query.search?.trim();
    let filter = {};

    if (search && search.length > 0) {
      const regex = new RegExp(search, "i"); // case-insensitive partial match
      filter = {
        $or: [
          { shortCode: regex },
          { originalUrl: regex }
        ]
      };
    }

    const [total, links] = await Promise.all([
      Link.countDocuments(filter),
      Link.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
    ]);

    const base = process.env.BASE_URL || req.protocol + "://" + req.get("host");

    const results = links.map((l) => ({
      id: l._id,
      originalUrl: l.originalUrl,
      shortCode: l.shortCode,
      shortUrl: `${base}/${l.shortCode}`,
      clicks: l.clicks,
      createdAt: l.createdAt,
      lastAccessedAt: l.lastAccessedAt,
    }));

    return res.json({
      total,
      page,
      limit,
      results,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};


/**
 * Get urls by code
 * GET /api/links/:code
 */
exports.getLink = async (req, res) => {
  try {
    const { code } = req.params;

    const link = await Link.findOne({ shortCode: code }).lean()
    if (!link) return res.status(404).json({ error: "Not found" });

    const base = process.env.BASE_URL || req.protocol + "://" + req.get("host");

    return res.json({
      id: link._id,
      originalUrl: link.originalUrl,
      shortCode: link.shortCode,
      shortUrl: `${base}/${link.shortCode}`,
      clicks: link.clicks,
      createdAt: link.createdAt,
      lastAccessedAt: link.lastAccessedAt,
      clicksData: link.clicksData || [],
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * Delete /api/links/code
 */
exports.deleteLink = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await Link.findOneAndDelete({ shortCode: code });

    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }
    return res.json({ message: "Deleted successfully", shortId: code });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
