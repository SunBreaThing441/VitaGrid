const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const bcrypt = require("bcryptjs");
const dns = require("dns");

// Ensure public DNS fallback for MongoDB Atlas SRV resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Models
const categoryModel = require("../models/categories");
const productModel = require("../models/products");
const orderModel = require("../models/orders");
const userModel = require("../models/users");
const customizeModel = require("../models/customize");

/**
 * Creates a valid PNG buffer with custom dimensions and RGB background.
 * Pure Node.js implementation without external binary dependencies.
 */
function generatePngBuffer(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type);
    const body = Buffer.concat([typeBuf, data]);
    const crc = Buffer.alloc(4);
    let c = 0xffffffff;
    const table = [];
    for (let n = 0; n < 256; n++) {
      let v = n;
      for (let k = 0; k < 8; k++) {
        v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1;
      }
      table[n] = v;
    }
    for (let i = 0; i < body.length; i++) {
      c = table[(c ^ body[i]) & 0xff] ^ (c >>> 8);
    }
    crc.writeUInt32BE((c ^ 0xffffffff) >>> 0, 0);
    return Buffer.concat([len, body, crc]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2; // RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rowBytes = width * 3 + 1;
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const offset = y * rowBytes;
    rawData[offset] = 0; // Filter type: None
    // Subtle gradient variation from top to bottom
    const dr = Math.floor((y / height) * 25);
    const dg = Math.floor((y / height) * 25);
    const db = Math.floor((y / height) * 25);
    for (let x = 0; x < width; x++) {
      rawData[offset + 1 + x * 3] = Math.max(0, Math.min(255, r - dr));
      rawData[offset + 1 + x * 3 + 1] = Math.max(0, Math.min(255, g - dg));
      rawData[offset + 1 + x * 3 + 2] = Math.max(0, Math.min(255, b - db));
    }
  }

  const idatData = zlib.deflateSync(rawData);
  return Buffer.concat([
    signature,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", idatData),
    makeChunk("IEND", Buffer.alloc(0)),
  ]);
}

/**
 * Ensures upload folders and default sample image files exist.
 */
function ensureSampleImages() {
  const baseUploads = path.join(__dirname, "../public/uploads");
  const categoriesDir = path.join(baseUploads, "categories");
  const customizeDir = path.join(baseUploads, "customize");
  const productsDir = path.join(baseUploads, "products");

  [categoriesDir, customizeDir, productsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Category images (400x300)
  const catImages = [
    { name: "kidney.png", r: 180, g: 40, b: 60 },
    { name: "liver.png", r: 160, g: 70, b: 35 },
    { name: "heart.png", r: 210, g: 30, b: 45 },
    { name: "lungs.png", r: 70, g: 130, b: 180 },
    { name: "pancreas.png", r: 218, g: 140, b: 40 },
    { name: "cornea.png", r: 46, g: 139, b: 87 },
  ];
  catImages.forEach((img) => {
    const filePath = path.join(categoriesDir, img.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, generatePngBuffer(400, 300, img.r, img.g, img.b));
    }
  });

  // Customize Slider images (1200x420)
  const sliderImages = [
    { name: "slider1.png", r: 26, g: 54, b: 93 },
    { name: "slider2.png", r: 44, g: 82, b: 130 },
  ];
  sliderImages.forEach((img) => {
    const filePath = path.join(customizeDir, img.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, generatePngBuffer(1200, 420, img.r, img.g, img.b));
    }
  });

  // Product images (500x400)
  const prodImages = [
    { name: "kidney1.png", r: 190, g: 50, b: 70 },
    { name: "kidney2.png", r: 170, g: 40, b: 60 },
    { name: "kidney_a1.png", r: 185, g: 55, b: 75 },
    { name: "kidney_a2.png", r: 165, g: 45, b: 65 },
    { name: "liver1.png", r: 170, g: 80, b: 40 },
    { name: "liver2.png", r: 150, g: 70, b: 35 },
    { name: "heart1.png", r: 220, g: 35, b: 50 },
    { name: "heart2.png", r: 200, g: 25, b: 40 },
    { name: "lungs1.png", r: 80, g: 140, b: 190 },
    { name: "lungs2.png", r: 65, g: 120, b: 170 },
    { name: "cornea1.png", r: 50, g: 150, b: 95 },
    { name: "cornea2.png", r: 40, g: 130, b: 80 },
  ];
  prodImages.forEach((img) => {
    const filePath = path.join(productsDir, img.name);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, generatePngBuffer(500, 400, img.r, img.g, img.b));
    }
  });
}

/**
 * Main migration function to seed all necessary sample data.
 */
async function migrateDatabase() {
  console.log("=================================================");
  console.log(" Starting OrganEase Database Migration & Seeding");
  console.log("=================================================");

  // 1. Ensure DB Connection
  if (mongoose.connection.readyState !== 1) {
    const dbUri =
      process.env.DATABASE ||
      "mongodb+srv://hashira345890_db_user:nSOPdgM43ze9F0l6@database.0mkxrot.mongodb.net/organ_ease?retryWrites=true&w=majority";
    console.log("Connecting to MongoDB...");
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("MongoDB Connected Successfully!");
  }

  // 2. Ensure Sample Images
  console.log("Ensuring local sample images in public/uploads...");
  ensureSampleImages();

  // 3. Clear existing data
  console.log("Resetting existing collections...");
  await Promise.all([
    categoryModel.deleteMany({}),
    productModel.deleteMany({}),
    orderModel.deleteMany({}),
    userModel.deleteMany({}),
    customizeModel.deleteMany({}),
  ]);

  // 4. Seed Users
  console.log("Seeding Users (Admin & Hospital)...");
  const hashedAdminPassword = bcrypt.hashSync("admin123", 10);
  const hashedUserPassword = bcrypt.hashSync("user123", 10);

  const adminUser = await userModel.create({
    name: "OrganEase Admin",
    email: "admin@organease.com",
    password: hashedAdminPassword,
    userRole: 1, // 1 = Admin
    phoneNumber: 9876543210,
    userImage: "user.png",
    verified: "true",
  });

  const hospitalUser = await userModel.create({
    name: "Apex Hospital Transplant Unit",
    email: "hospital@organease.com",
    password: hashedUserPassword,
    userRole: 0, // 0 = Customer / Hospital Requester
    phoneNumber: 9123456789,
    userImage: "user.png",
    verified: "true",
  });

  console.log(` Created ${2} Users (Admin: admin@organease.com, User: hospital@organease.com)`);

  // 5. Seed Categories
  console.log("Seeding Categories...");
  const categoriesData = [
    {
      cName: "Kidney",
      cDescription: "Human donor kidneys preserved under hypothermic perfusion for renal transplant.",
      cImage: "kidney.png",
      cStatus: "Active",
    },
    {
      cName: "Liver",
      cDescription: "Whole and split human livers in static cold storage for hepatic replacement.",
      cImage: "liver.png",
      cStatus: "Active",
    },
    {
      cName: "Heart",
      cDescription: "Viable donor hearts preserved under active machine perfusion for urgent cardiac transplant.",
      cImage: "heart.png",
      cStatus: "Active",
    },
    {
      cName: "Lungs",
      cDescription: "Double and single lungs under normothermic ex-vivo lung perfusion.",
      cImage: "lungs.png",
      cStatus: "Active",
    },
    {
      cName: "Pancreas",
      cDescription: "Pancreas and islet cell tissue donors with complete HLA tissue compatibility.",
      cImage: "pancreas.png",
      cStatus: "Active",
    },
    {
      cName: "Cornea",
      cDescription: "Preserved corneal grafts and ocular tissues for optical restoration.",
      cImage: "cornea.png",
      cStatus: "Active",
    },
  ];

  const createdCategories = await categoryModel.insertMany(categoriesData);
  console.log(` Created ${createdCategories.length} Categories.`);

  const catMap = {};
  createdCategories.forEach((cat) => {
    catMap[cat.cName] = cat._id;
  });

  // 6. Seed Slider Images (Customize)
  console.log("Seeding Homepage Slider Images...");
  await customizeModel.insertMany([
    {
      slideImage: "slider1.png",
      firstShow: 0,
    },
    {
      slideImage: "slider2.png",
      firstShow: 1,
    },
  ]);
  console.log(" Created 2 Hero Slider Customizations.");

  // 7. Seed Products (Available Organs in Storage)
  console.log("Seeding Available Organs (Products)...");
  const productsData = [
    {
      pName: 24, // 24 hours ischemic window
      pDescription: "O+ Blood Group, Left Kidney. 32yo donor, hypothermic machine perfusion verified. Crossmatch ready.",
      pPrice: 400001, // PIN Code
      pSold: 0,
      pQuantity: 1,
      pCategory: catMap["Kidney"],
      pImages: ["kidney1.png", "kidney2.png"],
      pOffer: "0",
      pStatus: "Active",
      pRatingsReviews: [
        {
          review: "Donor history validated, cold perfusion parameters within optimal thresholds.",
          user: adminUser._id,
          rating: "5",
          createdAt: new Date(),
        },
      ],
    },
    {
      pName: 30, // 30 hours ischemic window
      pDescription: "A+ Blood Group, Right Kidney. Static cold storage, HLA typed and infectious disease screened.",
      pPrice: 110001, // PIN Code
      pSold: 0,
      pQuantity: 1,
      pCategory: catMap["Kidney"],
      pImages: ["kidney_a1.png", "kidney_a2.png"],
      pOffer: "0",
      pStatus: "Active",
      pRatingsReviews: [],
    },
    {
      pName: 12, // 12 hours ischemic window
      pDescription: "B+ Blood Group, Whole Adult Liver. Biopsy confirmed <5% macrosteatosis. High viability index.",
      pPrice: 560001, // PIN Code
      pSold: 0,
      pQuantity: 1,
      pCategory: catMap["Liver"],
      pImages: ["liver1.png", "liver2.png"],
      pOffer: "0",
      pStatus: "Active",
      pRatingsReviews: [
        {
          review: "Procured by National Organ Procurement Center. Rapid transport authorized.",
          user: adminUser._id,
          rating: "5",
          createdAt: new Date(),
        },
      ],
    },
    {
      pName: 6, // 6 hours ischemic window (Urgent)
      pDescription: "AB+ Blood Group, Human Donor Heart. TransMedics Organ Care System transported, echo normal.",
      pPrice: 700001, // PIN Code
      pSold: 0,
      pQuantity: 1,
      pCategory: catMap["Heart"],
      pImages: ["heart1.png", "heart2.png"],
      pOffer: "0",
      pStatus: "Active",
      pRatingsReviews: [],
    },
    {
      pName: 8, // 8 hours ischemic window
      pDescription: "O- Negative Universal Donor Double Lungs. PaO2/FiO2 ratio > 450 mmHg, chest X-ray clear.",
      pPrice: 600001, // PIN Code
      pSold: 0,
      pQuantity: 1,
      pCategory: catMap["Lungs"],
      pImages: ["lungs1.png", "lungs2.png"],
      pOffer: "0",
      pStatus: "Active",
      pRatingsReviews: [],
    },
    {
      pName: 72, // 72 hours preservation window
      pDescription: "Universal Donor Pre-cut Corneal Graft. Endothelial cell density > 2600 cells/mm2.",
      pPrice: 500001, // PIN Code
      pSold: 0,
      pQuantity: 2,
      pCategory: catMap["Cornea"],
      pImages: ["cornea1.png", "cornea2.png"],
      pOffer: "0",
      pStatus: "Active",
      pRatingsReviews: [],
    },
  ];

  const createdProducts = await productModel.insertMany(productsData);
  console.log(` Created ${createdProducts.length} Available Organs.`);

  // 8. Seed Sample Orders
  console.log("Seeding Sample Orders...");
  const ordersData = [
    {
      allProduct: [
        {
          id: createdProducts[0]._id,
          quantitiy: 1,
        },
      ],
      user: hospitalUser._id,
      amount: 400001,
      transactionId: "TXN_ORGAN_8839201",
      address: "Apex Multi-Specialty Transplant Center, Ward 4, Mumbai",
      phone: 9123456789,
      status: "Under Scrutiny",
    },
    {
      allProduct: [
        {
          id: createdProducts[2]._id,
          quantitiy: 1,
        },
      ],
      user: hospitalUser._id,
      amount: 560001,
      transactionId: "TXN_ORGAN_8839202",
      address: "Fortis Organ Recovery Wing, Bangalore",
      phone: 9123456789,
      status: "Request Accepted",
    },
  ];

  const createdOrders = await orderModel.insertMany(ordersData);
  console.log(` Created ${createdOrders.length} Sample Orders.`);

  console.log("=================================================");
  console.log(" Migration & Sample Data Seeding Completed!");
  console.log("=================================================");

  return {
    success: true,
    usersCount: 2,
    categoriesCount: createdCategories.length,
    customizesCount: 2,
    productsCount: createdProducts.length,
    ordersCount: createdOrders.length,
  };
}

// Standalone execution if run directly via CLI
if (require.main === module) {
  migrateDatabase()
    .then((result) => {
      console.log("Result:", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration error:", err);
      process.exit(1);
    });
}

module.exports = { migrateDatabase };
