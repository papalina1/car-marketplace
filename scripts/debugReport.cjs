const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function debug() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  // Car WITH accident history
  await page.goto("https://fem.encar.com/cars/report/inspect/40774562", {
    waitUntil: "networkidle",
    timeout: 30000,
  });

  await page.waitForTimeout(3000);

  // Log all clickable elements to find the insurance tab
  const links = await page.evaluate(() => {
    const els = document.querySelectorAll("a, button, li, [role='tab']");
    return Array.from(els).map(el => ({
      tag: el.tagName,
      text: el.innerText?.trim().substring(0, 50),
      href: el.getAttribute("href"),
      classes: el.className,
    })).filter(el => el.text && el.text.length > 0).slice(0, 30);
  });

  console.log("\n📋 Clickable elements on page:");
  links.forEach((l, i) => console.log("[" + i + "] " + l.tag + " | " + l.text + " | href: " + l.href));

  // Try clicking insurance tab
  const clicked = await page.evaluate(() => {
    const all = document.querySelectorAll("a, button, li");
    for (const el of all) {
      if (el.innerText && el.innerText.includes("보험")) {
        el.click();
        return el.innerText.trim();
      }
    }
    return null;
  });

  console.log("\n🖱️ Clicked:", clicked);
  await page.waitForTimeout(3000);

  const text = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(path.join(process.cwd(), "insurance_debug.txt"), text, "utf-8");

  console.log("\n📋 Full page text after click:");
  console.log(text);

  await browser.close();
}

debug().catch(console.error);