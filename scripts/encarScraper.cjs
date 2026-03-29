const { chromium } = require("playwright");
const https = require("https");
const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(process.cwd(), "cars.json");
const IMAGE_BASE = "https://ci.encar.com";
const TOTAL_CARS = 20; // Change to 2000 when going live
const PAGE_SIZE = 20;
const MAX_PHOTOS = 30; // Try up to 30 photos per car

const BRAND_MAP = {
  "현대": "Hyundai", "기아": "Kia", "제네시스": "Genesis",
  "쉐보레(GM대우)": "Chevrolet", "쉐보레": "Chevrolet",
  "르노코리아(삼성)": "Renault Korea", "르노코리아": "Renault Korea",
  "KG모빌리티(쌍용)": "KG Mobility", "KG모빌리티": "KG Mobility",
  "쌍용": "SsangYong", "르노삼성": "Renault Samsung",
  "BMW": "BMW", "벤츠": "Mercedes-Benz", "메르세데스-벤츠": "Mercedes-Benz",
  "아우디": "Audi", "폭스바겐": "Volkswagen", "볼보": "Volvo",
  "토요타": "Toyota", "도요타": "Toyota", "렉서스": "Lexus",
  "혼다": "Honda", "닛산": "Nissan", "인피니티": "Infiniti",
  "포르쉐": "Porsche", "랜드로버": "Land Rover", "재규어": "Jaguar",
  "미니": "MINI", "푸조": "Peugeot", "시트로엥": "Citroen",
  "시트로엥/DS": "Citroen/DS", "르노": "Renault", "피아트": "Fiat",
  "알파로메오": "Alfa Romeo", "마세라티": "Maserati", "페라리": "Ferrari",
  "람보르기니": "Lamborghini", "벤틀리": "Bentley", "롤스로이스": "Rolls-Royce",
  "테슬라": "Tesla", "링컨": "Lincoln", "캐딜락": "Cadillac",
  "포드": "Ford", "지프": "Jeep", "크라이슬러": "Chrysler",
  "닷지": "Dodge", "GMC": "GMC", "스바루": "Subaru",
  "마쯔다": "Mazda", "미쓰비시": "Mitsubishi", "스즈키": "Suzuki",
  "BYD": "BYD", "폴스타": "Polestar", "스마트": "Smart",
  "동풍소콘": "Dongfeng Sokon", "기타 제조사": "Other", "기타제조사": "Other",
  "애스턴마틴": "Aston Martin", "이네오스": "Ineos",
  "맥라렌": "McLaren", "페라리": "Ferrari", "람보르기니": "Lamborghini",
  "볼보코리아": "Volvo Korea", "재규어/랜드로버": "Jaguar Land Rover",
};

const MODEL_MAP = {
  // Hyundai
  "아반떼": "Avante", "쏘나타": "Sonata", "그랜저": "Grandeur",
  "아이오닉5": "Ioniq 5", "아이오닉6": "Ioniq 6", "아이오닉": "Ioniq",
  "투싼": "Tucson", "싼타페": "Santa Fe", "팰리세이드": "Palisade",
  "코나": "Kona", "넥쏘": "Nexo", "스타리아": "Staria",
  "캐스퍼": "Casper", "벨로스터": "Veloster", "포터": "Porter",
  "스타렉스": "Starex", "그랜드 스타렉스": "Grand Starex",
  "더 뉴 아반떼": "New Avante", "더 뉴 쏘나타": "New Sonata",
  "더 뉴 그랜저": "New Grandeur", "더 뉴 투싼": "New Tucson",
  "더 뉴 싼타페": "New Santa Fe", "더 뉴 팰리세이드": "New Palisade",
  "더 뉴 코나": "New Kona",
  // Kia
  "K3": "K3", "K5": "K5", "K7": "K7", "K8": "K8", "K9": "K9",
  "EV6": "EV6", "EV9": "EV9", "스포티지": "Sportage",
  "쏘렌토": "Sorento", "모하비": "Mohave", "카니발": "Carnival",
  "셀토스": "Seltos", "니로": "Niro", "레이": "Ray",
  "모닝": "Morning", "스팅어": "Stinger",
  "더 뉴 K5": "New K5", "더 뉴 K7": "New K7",
  "더 뉴 스포티지": "New Sportage", "더 뉴 쏘렌토": "New Sorento",
  "더 뉴 카니발": "New Carnival",
  // Genesis
  "G70": "G70", "G80": "G80", "G90": "G90",
  "GV70": "GV70", "GV80": "GV80", "GV90": "GV90",
  // KG Mobility / SsangYong
  "티볼리": "Tivoli", "코란도": "Korando", "렉스턴": "Rexton",
  "무쏘": "Musso", "액티언": "Actyon",
  // Chevrolet
  "말리부": "Malibu", "크루즈": "Cruze", "스파크": "Spark",
  "트레일블레이저": "Trailblazer", "트랙스": "Trax",
  "이쿼녹스": "Equinox", "올란도": "Orlando", "캡티바": "Captiva",
  // Renault Korea
  "SM3": "SM3", "SM5": "SM5", "SM6": "SM6", "SM7": "SM7",
  "QM3": "QM3", "QM5": "QM5", "QM6": "QM6",
  // Foreign models (Korean names)
  "그랜드 스타렉스": "Grand Starex",
  "어코드": "Accord", "시빅": "Civic", "CR-V": "CR-V", "HR-V": "HR-V",
  "마칸": "Macan", "카이엔": "Cayenne", "파나메라": "Panamera",
  "박스터": "Boxster", "911": "911", "타이칸": "Taycan",
  "E-클래스": "E-Class", "C-클래스": "C-Class", "S-클래스": "S-Class",
  "GLC-클래스": "GLC-Class", "GLE-클래스": "GLE-Class", "GLS-클래스": "GLS-Class",
  "GLA-클래스": "GLA-Class", "GLB-클래스": "GLB-Class", "AMG GT": "AMG GT",
  "A-클래스": "A-Class", "B-클래스": "B-Class", "CLA-클래스": "CLA-Class",
  "X1": "X1", "X2": "X2", "X3": "X3", "X4": "X4", "X5": "X5", "X6": "X6", "X7": "X7",
  "1시리즈": "1 Series", "2시리즈": "2 Series", "3시리즈": "3 Series",
  "4시리즈": "4 Series", "5시리즈": "5 Series", "6시리즈": "6 Series",
  "7시리즈": "7 Series", "8시리즈": "8 Series",
  "A3": "A3", "A4": "A4", "A5": "A5", "A6": "A6", "A7": "A7", "A8": "A8",
  "Q3": "Q3", "Q5": "Q5", "Q7": "Q7", "Q8": "Q8",
  "XC40": "XC40", "XC60": "XC60", "XC90": "XC90",
  "캠리": "Camry", "RAV4": "RAV4", "프리우스": "Prius", "하이랜더": "Highlander",
  "ES": "ES", "IS": "IS", "RX": "RX", "NX": "NX", "UX": "UX",
  "더 뉴 300C": "New 300C", "300C": "300C",
  // More foreign models
  "트래버스": "Traverse", "콜로라도": "Colorado", "실버라도": "Silverado",
  "타호": "Tahoe", "서버번": "Suburban",
  "아테온": "Arteon", "파사트": "Passat", "골프": "Golf", "티구안": "Tiguan",
  "투아렉": "Touareg", "폴로": "Polo", "제타": "Jetta",
  "익스플로러": "Explorer", "머스탱": "Mustang", "엣지": "Edge",
  "브롱코": "Bronco", "레인저": "Ranger", "F-150": "F-150",
  "레인지로버": "Range Rover", "디스커버리": "Discovery", "디펜더": "Defender",
  "F-페이스": "F-Pace", "E-페이스": "E-Pace", "I-페이스": "I-Pace",
  "508": "508", "3008": "3008", "5008": "5008",
  "모델S": "Model S", "모델3": "Model 3", "모델X": "Model X", "모델Y": "Model Y",
  "모델 S": "Model S", "모델 3": "Model 3", "모델 X": "Model X", "모델 Y": "Model Y",
  // Jeep
  "랭글러": "Wrangler", "체로키": "Cherokee", "그랜드 체로키": "Grand Cherokee",
  "컴패스": "Compass", "레니게이드": "Renegade",
  // MINI
  "쿠퍼": "Cooper", "쿠퍼 클럽맨": "Cooper Clubman", "쿠퍼 컨트리맨": "Cooper Countryman",
  "쿠퍼 페이스맨": "Cooper Paceman", "쿠퍼 S": "Cooper S",
  // Lexus
  "뉴 ES300h": "ES300h", "뉴 ES": "ES", "뉴 IS": "IS", "뉴 RX": "RX",
  "ES300h": "ES300h", "ES350": "ES350",
  // Volvo
  "볼보 XC90": "XC90",
  // Others
  "뉴": "",
  // McLaren
  "아투라": "Artura", "720S": "720S", "570S": "570S", "600LT": "600LT",
  // Chevrolet / GMC
  "익스프레스밴": "Express Van", "익스프레스": "Express",
  "타호": "Tahoe", "서버번": "Suburban", "실버라도": "Silverado",
  // Lexus additional
  "LS": "LS", "LC": "LC", "LX": "LX", "GS": "GS",
  // Infiniti
  "Q50": "Q50", "Q70": "Q70", "QX50": "QX50", "QX60": "QX60", "QX80": "QX80",
};

// Korean badge/trim word translations
const BADGE_WORD_MAP = {
  "가솔린": "Gasoline", "디젤": "Diesel", "전기": "Electric",
  "하이브리드": "Hybrid", "수소": "Hydrogen", "LPi": "LPi", "LPG": "LPG",
  "시그니처": "Signature", "프레스티지": "Prestige", "노블레스": "Noblesse",
  "익스클루시브": "Exclusive", "프리미엄": "Premium", "럭셔리": "Luxury",
  "얼티메이트": "Ultimate", "인스퍼레이션": "Inspiration", "인텔리전트": "Intelligent",
  "그래비티": "Gravity", "다이나믹": "Dynamic", "어드밴스드": "Advanced",
  "스마트": "Smart", "모던": "Modern", "트렌디": "Trendy", "스타일": "Style",
  "투어링": "Touring", "어반": "Urban", "스포츠": "Sport", "쿠페": "Coupe",
  "왜건": "Wagon", "컨버터블": "Convertible", "카브리올레": "Cabriolet",
  "브라이트": "Bright", "블랙": "Black", "화이트": "White",
  "콰트로": "quattro", "매틱": "matic", "밴": "Van",
  "인승": "-seat", "더 뉴": "",
  "AWD": "AWD", "2WD": "2WD", "4WD": "4WD", "4MATIC": "4MATIC",
};

const FUEL_MAP = {
  "가솔린": "Gasoline", "디젤": "Diesel", "전기": "Electric",
  "하이브리드": "Hybrid", "LPG": "LPG",
  "가솔린+전기": "Hybrid", "디젤+전기": "Hybrid", "수소": "Hydrogen",
};

function translateBrand(k) {
  if (!k) return "Unknown";
  if (BRAND_MAP[k]) return BRAND_MAP[k];
  if (/[\uAC00-\uD7A3]/.test(k)) return k + " (KR)";
  return k;
}

function translateModel(k) {
  if (!k) return "";
  if (MODEL_MAP[k]) return MODEL_MAP[k];
  for (const key of Object.keys(MODEL_MAP)) {
    if (k.includes(key)) return k.replace(key, MODEL_MAP[key]);
  }
  return k;
}

function translateFuel(k) { return FUEL_MAP[k] || k; }

// Translate a badge/trim string to clean English
function translateBadge(raw) {
  if (!raw) return "";
  let s = raw;

  // "N세대" → "Gen N"
  s = s.replace(/(\d+)세대/g, "Gen $1");
  // "N인승" → "N-seat"
  s = s.replace(/(\d+)인승/g, "$1-seat");

  // Replace known Korean words word by word
  const words = s.split(/\s+/);
  const translated = words.map(function(w) {
    if (BADGE_WORD_MAP[w] !== undefined) return BADGE_WORD_MAP[w];
    // Partial match
    for (const key of Object.keys(BADGE_WORD_MAP)) {
      if (w === key) return BADGE_WORD_MAP[key];
    }
    return w;
  });

  s = translated.join(" ");

  // Strip remaining Korean characters
  s = s.replace(/[\uAC00-\uD7A3\u3130-\u318F\u1100-\u11FF]+/g, "");

  // Clean up extra spaces and trailing/leading punctuation
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://www.encar.com/",
        "Origin": "https://www.encar.com",
      },
    };
    https.get(url, options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("Bad JSON")); }
      });
    }).on("error", reject);
  });
}

// Check if an image URL exists (returns 200)
function checkImageExists(url) {
  return new Promise((resolve) => {
    https.get(url, { method: "HEAD" }, (res) => {
      resolve(res.statusCode === 200);
    }).on("error", () => resolve(false));
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildCarLink(id) {
  return "https://www.encar.com/dc/dc_cardetailview.do?carid=" + id;
}

function formatYear(raw) {
  if (!raw) return "";
  const c = String(raw).replace(/[^0-9\/]/g, "");
  if (/^\d{6}$/.test(c)) return c.slice(0, 4) + "/" + c.slice(4, 6);
  if (/^\d{4}\/\d{2}$/.test(c)) return c;
  return c;
}

function formatMileage(raw) {
  if (!raw && raw !== 0) return "";
  const num = parseInt(String(raw).replace(/[^0-9]/g, ""), 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("en-US") + " km";
}

// Extract the base path from an image URL
// e.g. "https://ci.encar.com/carpicture03/pic4173/41739459_001.jpg"
// → base = "https://ci.encar.com/carpicture03/pic4173/41739459_"
function getImageBase(imageUrl) {
  if (!imageUrl) return null;
  // Remove everything after the last underscore + number + .jpg
  const match = imageUrl.match(/^(https:\/\/ci\.encar\.com\/.+_)\d+\.jpg/);
  if (match) return match[1];
  return null;
}

// Build all image URLs by trying _001 through _MAX_PHOTOS
async function getAllImages(knownImages) {
  if (!knownImages || knownImages.length === 0) return [];

  // Get the base path from first known image
  const base = getImageBase(knownImages[0]);
  if (!base) return knownImages;

  // We already know which numbers exist from the API
  // Extract known numbers
  const knownNums = new Set();
  knownImages.forEach(function(url) {
    const m = url.match(/_(\d+)\.jpg/);
    if (m) knownNums.add(parseInt(m[1], 10));
  });

  // Try all numbers from 1 to MAX_PHOTOS
  const allImages = [];
  const checks = [];

  for (let i = 1; i <= MAX_PHOTOS; i++) {
    const num = String(i).padStart(3, "0");
    const url = base + num + ".jpg";
    checks.push({ num: i, url });
  }

  // Check all URLs in parallel (faster)
  const results = await Promise.all(
    checks.map(function(item) {
      // If we already know it exists from API data, skip the check
      if (knownNums.has(item.num)) {
        return Promise.resolve({ url: item.url, exists: true });
      }
      return checkImageExists(item.url).then(function(exists) {
        return { url: item.url, exists };
      });
    })
  );

  results.forEach(function(r) {
    if (r.exists) allImages.push(r.url);
  });

  return allImages.length > 0 ? allImages : knownImages;
}

function parseCar(raw) {
  const id = String(raw.Id || "");
  if (!id) return null;

  const brand = translateBrand(raw.Manufacturer || "");
  const model = translateModel(raw.Model || "");
  const badge = translateBadge(raw.Badge || "");
  const badgeDetail = translateBadge(raw.BadgeDetail || "");
  const fuel = translateFuel(raw.FuelType || "");

  let title = [brand, model, badge, badgeDetail]
    .map((s) => s.trim()).filter((s) => s.length > 0).join(" ");

  // Final pass: handle generation/seat patterns and strip any leftover Korean
  title = title.replace(/(\d+)세대/g, "Gen $1");
  title = title.replace(/(\d+)인승/g, "$1-seat");
  title = title.replace(/(\d+)도어/g, "");  // remove "5도어" etc — not needed in title
  // Check MODEL_MAP for any remaining Korean substrings
  for (const key of Object.keys(MODEL_MAP)) {
    if (/[\uAC00-\uD7A3]/.test(key) && title.includes(key)) {
      title = title.replace(key, MODEL_MAP[key]);
    }
  }
  // Translate any remaining Korean words using BADGE_WORD_MAP
  title = title.split(/\s+/).map(function(w) {
    return BADGE_WORD_MAP[w] !== undefined ? BADGE_WORD_MAP[w] : w;
  }).join(" ");
  // Strip remaining Korean characters entirely
  title = title.replace(/[\uAC00-\uD7A3\u3130-\u318F\u1100-\u11FF]+/g, "");
  // Remove empty parentheses and stray symbols left after Korean removal
  title = title.replace(/\(\s*\)/g, "");
  title = title.replace(/\s+\+\s+/g, " ");
  title = title.replace(/\s+/g, " ").trim();

  if (!title || title.length < 2) return null;

  // Get photos from API response
  const images = [];
  if (raw.Photos && Array.isArray(raw.Photos)) {
    raw.Photos.forEach(function(p) {
      if (p.location) images.push(IMAGE_BASE + p.location);
    });
  }
  if (images.length === 0 && raw.Photo) {
    images.push(IMAGE_BASE + raw.Photo + "001.jpg");
  }

  return {
    id, title, brand, model,
    year: formatYear(raw.Year),
    mileage: formatMileage(raw.Mileage),
    fuel,
    location: raw.OfficeCityState || "",
    price: typeof raw.Price === "number" ? raw.Price : 0,
    image: images[0] || "",
    images: images,
    link: buildCarLink(id),
    scrapedAt: new Date().toISOString(),
  };
}

async function fetchCarList(url, limit) {
  const cars = [];
  const seenIds = new Set();
  const pages = Math.ceil(limit / PAGE_SIZE);

  for (let page = 0; page < pages; page++) {
    const offset = page * PAGE_SIZE;
    const pageUrl = url + offset + "%7C" + PAGE_SIZE;
    console.log("  Page " + (page + 1) + "/" + pages + " | Cars: " + cars.length);
    try {
      const data = await fetchJson(pageUrl);
      if (!data.SearchResults) break;
      for (const raw of data.SearchResults) {
        const car = parseCar(raw);
        if (!car || seenIds.has(car.id)) continue;
        seenIds.add(car.id);
        cars.push(car);
        if (cars.length >= limit) break;
      }
      await sleep(300);
    } catch (err) {
      console.error("  Error:", err.message);
      await sleep(1000);
    }
    if (cars.length >= limit) break;
  }
  return cars;
}

async function scrapeEncar() {
  console.log("🚀 Encar scraper starting...");
  console.log("🎯 Target: " + TOTAL_CARS + " cars");
  console.log("💾 Output: " + OUTPUT_PATH);

  const half = Math.ceil(TOTAL_CARS / 2);

  console.log("\n🇰🇷 Korean cars...");
  const korUrl = "https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.CarType.Y.)&sr=%7CModifiedDate%7C";
  const korCars = await fetchCarList(korUrl, half);
  console.log("✅ " + korCars.length + " Korean cars");

  console.log("\n🌍 Foreign cars...");
  const forUrl = "https://api.encar.com/search/car/list/general?count=true&q=(And.Hidden.N._.CarType.N.)&sr=%7CModifiedDate%7C";
  const forCars = await fetchCarList(forUrl, half);
  console.log("✅ " + forCars.length + " foreign cars");

  const allCars = [...korCars, ...forCars];

console.log("\n📸 Finding all photos for each car...");
  console.log("   (Checking up to " + MAX_PHOTOS + " images per car)\n");

  for (let i = 0; i < allCars.length; i++) {
    const car = allCars[i];
    process.stdout.write("  [" + (i + 1) + "/" + allCars.length + "] " + car.brand + " " + car.model + "... ");
    const allImages = await getAllImages(car.images);
    car.images = allImages;
    car.image = allImages[0] || car.image;
    console.log(allImages.length + " photos ✓");
    await sleep(100);
  }

  // Open browser for report scraping
  console.log("\n📋 Fetching insurance/accident reports...");
  const reportBrowser = await chromium.launch({ headless: true });

  for (let i = 0; i < allCars.length; i++) {
    const car = allCars[i];
    process.stdout.write("  [" + (i + 1) + "/" + allCars.length + "] " + car.brand + " " + car.model + "... ");
    const report = await fetchCarReport(reportBrowser, car.id);
    car.report = report;
    if (report) {
      const myCount = report.myCarAccident ? report.myCarAccident.count : 0;
      const otherCount = report.otherCarAccident ? report.otherCarAccident.count : 0;
      console.log("✓ my:" + myCount + " other:" + otherCount);
    } else {
      console.log("- no report");
    }
    await sleep(500);
  }

  await reportBrowser.close();
  console.log("🔒 Report browser closed");

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allCars, null, 2), "utf-8");

  const avgPhotos = allCars.length > 0
    ? (allCars.reduce((sum, c) => sum + (c.images?.length || 0), 0) / allCars.length).toFixed(1)
    : 0;

  console.log("\n📊 Summary:");
  console.log("   Total cars  : " + allCars.length);
  console.log("   Avg photos  : " + avgPhotos);
  console.log("\n✅ Saved to cars.json");
  console.log("🏁 Done!");
}

scrapeEncar().catch(function(err) {
  console.error("💥 Fatal:", err.message);
  process.exit(1);
});

// Fetch accident/insurance report for one car
async function fetchCarReport(browser, carId) {
  const url = "https://fem.encar.com/cars/report/accident/" + carId;
  let page = null;
  try {
    page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    });

    await page.goto("https://fem.encar.com/cars/report/inspect/" + carId, {
      waitUntil: "networkidle",
      timeout: 30000,
    });

    await page.waitForTimeout(1500);

    // Click insurance tab
    await page.evaluate(function() {
      const links = document.querySelectorAll("a");
      for (var i = 0; i < links.length; i++) {
        if (links[i].innerText.includes("보험이력") || links[i].href.includes("accident")) {
          links[i].click();
          return;
        }
      }
    });

    await page.waitForTimeout(2000);

    const report = await page.evaluate(function() {
      const text = document.body.innerText;

      function extractAccident(label) {
        const regex = new RegExp(label + "\\s*([^\\n]+)");
        const match = text.match(regex);
        if (!match) return { count: 0, amount: null };
        const raw = match[1].trim();
        if (raw.includes("없음")) return { count: 0, amount: null };
        const countMatch = raw.match(/(\d+)회/);
        const amountMatch = raw.match(/([\d,]+)원/);
        return {
          count: countMatch ? parseInt(countMatch[1]) : 0,
          amount: amountMatch ? amountMatch[1] + "원" : null,
        };
      }

      const myCar = extractAccident("보험사고 이력 \\(내차 피해\\)");
      const otherCar = extractAccident("보험사고 이력 \\(타차 가해\\)");

      const ownerMatch = text.match(/번호\s*\/\s*소유자 변경이력\s*(\d+)회(\d+)회/);

      function extractSpecialAccident(keyword) {
        const regex = new RegExp(keyword + "\\s*(\\d+)회(?:\\s*([\\d,]+)원)?");
        const match = text.match(regex);
        if (!match || parseInt(match[1]) === 0) return { count: 0, amount: null };
        return {
          count: parseInt(match[1]),
          amount: match[2] ? match[2] + "원" : null,
        };
      }

      const totalLossData = extractSpecialAccident("전손");
      const floodData = extractSpecialAccident("침수\\(전손,분손\\)");

      return {
        myCarAccident: myCar,
        otherCarAccident: otherCar,
        totalLoss: totalLossData.count > 0,
        totalLossAmount: totalLossData.amount,
        flood: floodData.count > 0,
        floodAmount: floodData.amount,
        ownerChanges: ownerMatch ? parseInt(ownerMatch[2]) : null,
        reportUrl: "https://fem.encar.com/cars/report/accident/" + window.location.pathname.split("/").pop(),
      };
    });

    // Fix reportUrl with correct carId
    report.reportUrl = url;
    return report;

  } catch (e) {
    return null;
  } finally {
    if (page) await page.close();
  }
}