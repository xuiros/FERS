const express = require("express");
const axios = require("axios");
const router = express.Router();
const ScannedID = require("../models/Scannedid");

// 🧪 Test route
router.get("/test", (req, res) => {
  res.json({
    message: "Back ID route is working ✅",
    keyLoaded: !!process.env.VISION_API_KEY,
  });
});

// 🔍 POST /api/vision/back
router.post("/", async (req, res) => {
  try {
    let { base64Image } = req.body;

    // 🧩 Validate input
    if (!base64Image)
      return res.status(400).json({ message: "No image received" });

    // 🧹 Clean base64 prefix if present
    base64Image = base64Image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const VISION_API_KEY = process.env.VISION_API_KEY;
    if (!VISION_API_KEY)
      return res
        .status(500)
        .json({ message: "Missing Google Vision API key" });

    // 🧠 Send image to Google Vision API
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

    console.log("📄 Extracted Text (Back):\n", fullText);

    // 🧼 Normalize text: remove noise, convert to uppercase, collapse spaces
    const cleanedText = fullText
      .replace(
        /IF FOUND[\s\S]*|PSA OFFICE[\s\S]*|WWW\.PSA\.GOV\.PH[\s\S]*|\b[0-9A-Z]{8,}\b/g,
        ""
      )
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    // 🧩 OCR-tolerant regex patterns
    const sexMatch =
      cleanedText.match(/\bSEX[:\-]?\s*([A-Z]+)/) ||
      cleanedText.match(/\bKASARIAN\s*\/?\s*SEX[:\-]?\s*([A-Z]+)/);

    const bloodTypeMatch =
      cleanedText.match(/\bBLOOD\s*TYPE[:\-]?\s*([ABO0-9\+\-]+)/) ||
      cleanedText.match(/\bDUGO\s*\/?\s*BLOOD\s*TYPE[:\-]?\s*([ABO0-9\+\-]+)/);

    const civilStatusMatch =
      cleanedText.match(/\bCIVIL\s*STATUS[:\-]?\s*([A-Z]+)/) ||
      cleanedText.match(/\bSIBIL\s*\/?\s*MARITAL\s*STATUS[:\-]?\s*([A-Z]+)/) ||
      cleanedText.match(/\bSTATUS[:\-]?\s*([A-Z]+)/);

    // 🧠 Fallback values
    const rawSex = sexMatch ? sexMatch[1].trim() : "";
    const rawStatus = civilStatusMatch ? civilStatusMatch[1].trim() : "";
    const rawBlood = bloodTypeMatch ? bloodTypeMatch[1].trim() : "";

    // 🧩 Normalize values
    const fixedSex =
      /ALE|MALE/.test(rawSex) ? "MALE" :
      /FEMA|FEMALE/.test(rawSex) ? "FEMALE" : "N/A";

    const fixedStatus =
      /SING|NGLE/.test(rawStatus)
        ? "SINGLE"
        : /MARR/.test(rawStatus)
        ? "MARRIED"
        : /WIDOW/.test(rawStatus)
        ? "WIDOWED"
        : /SEP/.test(rawStatus)
        ? "SEPARATED"
        : "N/A";

    const fixedBlood =
      /^(A|B|AB|O)[\+\-]?$/.test(rawBlood.replace("0", "O"))
        ? rawBlood.replace("0", "O")
        : "N/A";

    // 🧹 Helper cleaner
    const clean = (text) =>
      text ? text.replace(/[^\w\s.,+-]/g, "").trim() : "N/A";

    // 🗂️ Build cleaned data (place_of_birth removed)
    const extractedData = {
      sex: clean(fixedSex),
      blood_type: clean(fixedBlood),
      civil_status: clean(fixedStatus),
      back_image: base64Image,
      back_raw_text: cleanedText,
    };

    // ✅ Save to MongoDB
    const record = new ScannedID(extractedData);
    await record.save();

    console.log("✅ Back ID processed successfully and saved.");
    res.status(200).json({
      message: "Back ID processed successfully ✅",
      data: record,
    });
  } catch (error) {
    console.error(
      "❌ Vision API error (back):",
      error.response?.data || error.message
    );

    const statusCode = error.response?.status || 500;
    const errorMessage =
      error.response?.data?.error?.message || "Unexpected server error";

    res.status(statusCode).json({
      message: "Error processing back ID image",
      error: errorMessage,
    });
  }
});

module.exports = router;
