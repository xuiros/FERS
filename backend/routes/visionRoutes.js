const express = require("express");
const axios = require("axios");
const router = express.Router();
const ScannedID = require("../models/Scannedid");

// 🧪 Test route
router.get("/test", (req, res) => {
  res.json({
    message: "Front ID route is working ✅",
    keyLoaded: !!process.env.VISION_API_KEY,
  });
});

// 🔍 POST /api/vision/front
router.post("/", async (req, res) => {
  try {
    let { base64Image } = req.body;

    // 🧩 Validate input
    if (!base64Image) {
      return res.status(400).json({ message: "No image received" });
    }

    // 🧹 Remove "data:image/..." prefix if present
    base64Image = base64Image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const VISION_API_KEY = process.env.VISION_API_KEY;
    if (!VISION_API_KEY) {
      return res.status(500).json({ message: "Missing Google Vision API key" });
    }

    // 🧠 Send to Google Vision API
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`,
      {
        requests: [
          {
            image: { content: base64Image },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      }
    );

    const fullText =
      response.data.responses?.[0]?.textAnnotations?.[0]?.description || "";

    console.log("📄 Extracted Text (Front):\n", fullText);

    // 🧼 Normalize text (remove line breaks, unify spacing and case)
    const cleanedText = fullText.replace(/\s+/g, " ").trim().toUpperCase();

    // 🧩 ID Number
    const idNumberMatch = cleanedText.match(/\d{4}-\d{4}-\d{4}-\d{4}/);

    // 🧠 More flexible name extraction (works with inconsistent OCR)
    const lastNameMatch =
      cleanedText.match(
        /APELYIDO\s*\/?\s*LAST\s*NAME[:\-]?\s*([A-Z\s]+?)(?=\s*MGA|GIVEN|GITNANG|MIDDLE|PETSANG|DATE|TIRAHAN|ADDRESS|$)/
      ) ||
      cleanedText.match(
        /LAST\s*NAME[:\-]?\s*([A-Z\s]+?)(?=\s*MGA|GIVEN|MIDDLE|DATE|ADDRESS|$)/
      );

    const givenNameMatch =
      cleanedText.match(
        /MGA\s*PANGALAN\s*\/?\s*GIVEN\s*NAMES[:\-]?\s*([A-Z\s]+?)(?=\s*GITNANG|MIDDLE|PETSANG|DATE|TIRAHAN|ADDRESS|$)/
      ) ||
      cleanedText.match(
        /GIVEN\s*NAMES?[:\-]?\s*([A-Z\s]+?)(?=\s*GITNANG|MIDDLE|DATE|ADDRESS|$)/
      );

    const middleNameMatch =
      cleanedText.match(
        /GITNANG\s*APELYIDO\s*\/?\s*MIDDLE\s*NAME[:\-]?\s*([A-Z\s]+?)(?=\s*PETSANG|DATE|TIRAHAN|ADDRESS|$)/
      ) ||
      cleanedText.match(
        /MIDDLE\s*NAME[:\-]?\s*([A-Z\s]+?)(?=\s*PETSANG|DATE|ADDRESS|$)/
      );

    // 🗓️ Birthdate (month day year only)
    const birthdateMatch =
      cleanedText.match(
        /PETSANG\s*KAPANGANAKAN\s*\/?\s*DATE\s*OF\s*BIRTH[:\-]?\s*([A-Z]+\s*\d{1,2},?\s*\d{4})/
      ) ||
      cleanedText.match(
        /DATE\s*OF\s*BIRTH[:\-]?\s*([A-Z]+\s*\d{1,2},?\s*\d{4})/
      );

    // 🏠 Address (after Tirahan/Address)
    const addressMatch =
      cleanedText.match(
        /TIRAHAN\s*\/?\s*ADDRESS[:\-]?\s*([A-Z0-9\s,.-]+)/i
      ) ||
      cleanedText.match(/ADDRESS[:\-]?\s*([A-Z0-9\s,.-]+)/i);

    // 🧹 Helper cleaner
    const clean = (text) => {
      if (!text) return "N/A";
      return text
        .replace(
          /\b(APELYIDO|LAST|NAME|MGA|PANGALAN|GIVEN|GITNANG|MIDDLE|TIRAHAN|ADDRESS|DATE|BIRTH|OF)\b/g,
          ""
        )
        .replace(/\s+/g, " ")
        .replace(/[^\w\s.,-]/g, "")
        .trim();
    };

    // 🧩 Final extracted data
    const extractedData = {
      id_number: clean(idNumberMatch?.[0]),
      last_name: clean(lastNameMatch?.[1]),
      given_name: clean(givenNameMatch?.[1]),
      middle_name: clean(middleNameMatch?.[1]),
      birthdate: clean(birthdateMatch?.[1]),
      address: clean(addressMatch?.[1]),
      front_image: base64Image,
      front_raw_text: cleanedText,
    };

    // 🩵 Fallbacks to avoid N/A if possible
    if (extractedData.given_name === "N/A" && cleanedText.includes("GIVEN"))
      extractedData.given_name = "UNREADABLE";
    if (extractedData.last_name === "N/A" && cleanedText.includes("LAST"))
      extractedData.last_name = "UNREADABLE";

    // ✅ Save to MongoDB
    const record = new ScannedID(extractedData);
    await record.save();

    console.log("✅ New front ID record saved.");
    res.status(200).json({
      message: "Front ID processed successfully ✅",
      data: record,
    });
  } catch (error) {
    console.error(
      "❌ Vision API error (front):",
      error.response?.data || error.message
    );

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error?.message || "Unexpected server error";

    res.status(statusCode).json({
      message: "Error processing front ID image",
      error: errorMessage,
    });
  }
});

module.exports = router;
