import moment from "moment";

/**
 * VitaGrid Clinical Assets & Diagnostic Imagery Catalog
 * Authentic Medical Imagery for UNESCO Humanitarian Logistics Network
 */

const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const CLINICAL_ASSETS_MAP = {
  // 1. Cornea (72 hrs window) - PIN: 500001
  500001: {
    title: "Universal Donor Pre-cut Corneal Graft",
    organType: "Cornea",
    classification: "Ocular Allograft Registry",
    bloodGroup: "Universal Donor",
    preservationModality: "Hypothermic Optisol-GS Media",
    toleranceHours: 72,
    pin: "500001",
    nodeLocation: "Telangana Node (HYD-01)",
    clinicalSpecs: "Endothelial cell density > 2600 cells/mm² · Clear stroma · Slit-lamp biomicroscopy validated · Micro-keratome dissected",
    clinicalMetricBadge: "ECD > 2600 cells/mm²",
    images: [
      "/images/clinical/cornea_primary.jpg",
      `${apiURL}/uploads/products/cornea1.png`,
      "/images/clinical/cornea_secondary.jpg",
      `${apiURL}/uploads/products/cornea2.png`,
      "https://upload.wikimedia.org/wikipedia/commons/2/2d/Cornea_Transplant.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/6/69/A_human_eye_1_day_after_a_cornea_transplant.jpg",
    ],
  },

  // 2. Lungs (8 hrs window) - PIN: 600001
  600001: {
    title: "O- Negative Universal Donor Double Lungs",
    organType: "Lungs",
    classification: "Pulmonary Allograft Network",
    bloodGroup: "O- Negative",
    preservationModality: "Cold Low-Potassium Dextran Flush / EVLP Circuit",
    toleranceHours: 8,
    pin: "600001",
    nodeLocation: "Tamil Nadu Node (MAA-04)",
    clinicalSpecs: "PaO₂/FiO₂ ratio > 450 mmHg · Clear bilateral chest radiography · Bronchoscopy validated · No purulence",
    clinicalMetricBadge: "PaO₂/FiO₂ > 450 mmHg · Clear X-Ray",
    images: [
      "/images/clinical/lungs_primary.png",
      `${apiURL}/uploads/products/lungs1.png`,
      "/images/clinical/lungs_secondary.jpg",
      `${apiURL}/uploads/products/lungs2.png`,
      "https://upload.wikimedia.org/wikipedia/commons/0/03/Human_lungs.png",
      "https://upload.wikimedia.org/wikipedia/commons/5/53/Lung_transplant.jpg",
    ],
  },

  // 3. Heart (6 hrs window) - PIN: 700001
  700001: {
    title: "AB+ Blood Group, Human Donor Heart",
    organType: "Heart",
    classification: "Cardiac Perfusion Corridor",
    bloodGroup: "AB+ Positive",
    preservationModality: "TransMedics Organ Care System (OCS)",
    toleranceHours: 6,
    pin: "700001",
    nodeLocation: "West Bengal Node (CCU-02)",
    clinicalSpecs: "TransMedics OCS pulsatile warm perfusion · Echo normal · LVEF > 60% · Coronary angiogram clear · Lactate trend normal",
    clinicalMetricBadge: "OCS Warm Perfusion · Normal Echo",
    images: [
      "/images/clinical/heart_primary.png",
      `${apiURL}/uploads/products/heart1.png`,
      "/images/clinical/heart_secondary.jpg",
      `${apiURL}/uploads/products/heart2.png`,
      "https://upload.wikimedia.org/wikipedia/commons/2/29/Human_heart.png",
      "https://upload.wikimedia.org/wikipedia/commons/1/1d/Heart_transplant.jpg",
    ],
  },

  // 4. Liver (12 hrs window) - PIN: 560001
  560001: {
    title: "B+ Blood Group, Whole Adult Liver",
    organType: "Liver",
    classification: "Hepatic Allocation Tier",
    bloodGroup: "B+ Positive",
    preservationModality: "Static Custodiol HTK / Dual-Vessel Machine Perfusion",
    toleranceHours: 12,
    pin: "560001",
    nodeLocation: "Karnataka Node (BLR-03)",
    clinicalSpecs: "Biopsy confirmed <5% macrosteatosis · Continuous bile production · Minimal warm ischemia · High viability index",
    clinicalMetricBadge: "<5% Macrosteatosis · High Viability",
    images: [
      "/images/clinical/liver_primary.jpg",
      `${apiURL}/uploads/products/liver1.png`,
      "/images/clinical/liver_secondary.jpg",
      `${apiURL}/uploads/products/liver2.png`,
      "https://upload.wikimedia.org/wikipedia/commons/f/fc/Human_liver.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/f1/Left_Liver_Transplant.jpg",
    ],
  },

  // 5. Kidney (30 hrs window) - PIN: 110001
  110001: {
    title: "A+ Blood Group, Right Kidney",
    organType: "Kidney",
    classification: "Renal Allocation Network",
    bloodGroup: "A+ Positive",
    preservationModality: "Static Cold Storage (Belzer UW Solution)",
    toleranceHours: 30,
    pin: "110001",
    nodeLocation: "NCR Delhi Node (DEL-01)",
    clinicalSpecs: "HLA typed (0-mismatch crossmatch candidate) · Infectious disease screened · Single renal artery & vein · Capsule intact",
    clinicalMetricBadge: "HLA Typed · Screened Sterile",
    images: [
      "/images/clinical/kidney_live_donor.jpg",
      `${apiURL}/uploads/products/kidney_a1.png`,
      "/images/clinical/kidney_pair.jpg",
      `${apiURL}/uploads/products/kidney_a2.png`,
      "https://upload.wikimedia.org/wikipedia/commons/e/ea/Kidney_for_transplant_from_live_donor.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/04/Human_kidneys.jpg",
    ],
  },

  // 6. Kidney (24 hrs window) - PIN: 400001
  400001: {
    title: "O+ Blood Group, Left Kidney",
    organType: "Kidney",
    classification: "Renal Allocation Network",
    bloodGroup: "O+ Positive",
    preservationModality: "LifePort Hypothermic Machine Perfusion (HMP)",
    toleranceHours: 24,
    pin: "400001",
    nodeLocation: "Maharashtra Node (BOM-05)",
    clinicalSpecs: "32yo donor · Hypothermic machine perfusion verified · Flow > 100ml/min · Resistive index < 0.30 · Crossmatch ready",
    clinicalMetricBadge: "32yo Donor · Machine Perfusion",
    images: [
      "/images/clinical/kidney_live_donor.jpg",
      `${apiURL}/uploads/products/kidney1.png`,
      "/images/clinical/kidney_pair.jpg",
      `${apiURL}/uploads/products/kidney2.png`,
      "https://upload.wikimedia.org/wikipedia/commons/e/ea/Kidney_for_transplant_from_live_donor.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/0/04/Human_kidneys.jpg",
    ],
  },
};

/**
 * Returns organ-specific fallback image to ensure no invalid equipment images are shown.
 */
export const getOrganFallbackImage = (organType = "") => {
  const t = String(organType).toLowerCase();
  if (t.includes("cornea") || t.includes("eye")) return "/images/clinical/cornea_primary.jpg";
  if (t.includes("lung")) return "/images/clinical/lungs_primary.png";
  if (t.includes("heart")) return "/images/clinical/heart_primary.png";
  if (t.includes("liver")) return "/images/clinical/liver_primary.jpg";
  if (t.includes("kidney") || t.includes("renal")) return "/images/clinical/kidney_live_donor.jpg";
  return "/images/clinical/heart_primary.png";
};

/**
 * Resolves metadata and authentic medical image URLs for any organ product.
 */
export const getClinicalAsset = (product, imageIndex = 0) => {
  if (!product) {
    return {
      title: "Biological Specimen",
      organType: "Organ Allograft",
      classification: "Bio-Logistics Specimen",
      bloodGroup: "Universal",
      preservationModality: "Cold Ischemia Protocol",
      toleranceHours: 24,
      pin: "OPO-Node",
      nodeLocation: "National Allocation Grid",
      clinicalSpecs: "Preserved according to UNESCO and WHO clinical protocols.",
      clinicalMetricBadge: "Clinical Protocol Ready",
      primaryImage: "/images/clinical/heart_primary.png",
      secondaryImage: "/images/clinical/heart_secondary.jpg",
      fallbackImage: "/images/clinical/heart_primary.png",
      images: ["/images/clinical/heart_primary.png", "/images/clinical/heart_secondary.jpg"],
    };
  }

  const pin = Number(product.pPrice) || 0;
  let asset = CLINICAL_ASSETS_MAP[pin];

  if (!asset) {
    // Fallback by Category Name or Description if PIN is custom
    const desc = `${product.pCategory?.cName || ""} ${product.pDescription || ""}`.toLowerCase();
    let matchedPin = 500001;
    if (desc.includes("lung")) matchedPin = 600001;
    else if (desc.includes("heart")) matchedPin = 700001;
    else if (desc.includes("liver")) matchedPin = 560001;
    else if (desc.includes("kidney") || desc.includes("renal")) matchedPin = 400001;
    else if (desc.includes("cornea") || desc.includes("eye")) matchedPin = 500001;
    asset = CLINICAL_ASSETS_MAP[matchedPin] || CLINICAL_ASSETS_MAP[500001];
  }

  const organFallback = getOrganFallbackImage(asset.organType);
  const primaryImg = (asset.images && asset.images[imageIndex]) || asset.images[0] || organFallback;
  const secondaryImg = (asset.images && asset.images[1]) || (asset.images && asset.images[0]) || organFallback;

  return {
    ...asset,
    title: product.pDescription ? product.pDescription.split(".")[0] : asset.title,
    pin: String(product.pPrice || asset.pin),
    toleranceHours: Number(product.pName) || asset.toleranceHours,
    primaryImage: primaryImg,
    secondaryImage: secondaryImg,
    fallbackImage: organFallback,
    images: asset.images || [primaryImg, secondaryImg],
  };
};

/**
 * Cold Ischemia Window viability state machine
 * Calculated dynamically via moment(createdAt).add(pName, 'hours')
 * Accurately tracks countdown and flags listings that are expired or disabled (pStatus = 'Disabled').
 */
export const getViabilityState = (product) => {
  if (!product) {
    return {
      expirationDate: moment(),
      diffHours: 0,
      diffMinutes: 0,
      isExpired: false,
      isStatusDisabled: false,
      isDisabled: false,
      isCritical: false,
      statusLabel: "UNKNOWN",
      timeLabel: "--",
    };
  }

  const createdAt = new Date(product.createdAt || Date.now());
  const toleranceHours = Number(product.pName) || 24;
  const expirationDate = moment(createdAt).add(toleranceHours, "hours");
  const now = moment();

  const isExpired = expirationDate.isBefore(now);
  const isStatusDisabled = product.pStatus === "Disabled";
  const isDisabled = isExpired || isStatusDisabled;

  const diffHours = Math.max(0, expirationDate.diff(now, "hours"));
  const diffMinutes = Math.max(0, expirationDate.diff(now, "minutes") % 60);
  const isCritical = !isDisabled && diffHours < 4;

  let statusLabel = "COLD ISCHEMIA";
  let timeLabel = `${diffHours}h ${diffMinutes}m REMAINING`;

  if (isStatusDisabled) {
    statusLabel = "DECOMMISSIONED";
    timeLabel = "LISTING DISABLED";
  } else if (isExpired) {
    statusLabel = "EXPIRED";
    timeLabel = "TOLERANCE EXCEEDED";
  } else if (isCritical) {
    statusLabel = "URGENT ISCHEMIA";
    timeLabel = `${diffHours}h ${diffMinutes}m REMAINING`;
  }

  return {
    expirationDate,
    toleranceHours,
    diffHours,
    diffMinutes,
    isExpired,
    isStatusDisabled,
    isDisabled,
    isCritical,
    statusLabel,
    timeLabel,
  };
};

