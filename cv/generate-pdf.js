/**
 * Script de generation des CVs PDF
 *
 * Usage: node generate-pdf.js
 *
 * Prerequis: npm install puppeteer
 */

const puppeteer = require('puppeteer');
const path = require('path');

const CVS = [
  { html: 'cv-fr.html', output: 'Ichai_Wizman_CV_FR.pdf', name: 'Francais' },
  { html: 'cv-en.html', output: 'Ichai_Wizman_CV_EN.pdf', name: 'English' },
];

async function generatePDF(htmlFile, outputFile, name) {
  console.log(`Generating ${name} CV...`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, htmlFile);
  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

  const outputPath = path.resolve(__dirname, outputFile);
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: {
      top: '0mm',
      right: '0mm',
      bottom: '0mm',
      left: '0mm'
    }
  });

  await browser.close();
  console.log(`  -> ${outputFile} generated successfully!`);

  return outputPath;
}

async function main() {
  console.log('======================================');
  console.log('   CV PDF Generator - Ichai Wizman');
  console.log('======================================\n');

  const results = [];

  for (const cv of CVS) {
    try {
      const outputPath = await generatePDF(cv.html, cv.output, cv.name);
      results.push({ name: cv.name, path: outputPath, success: true });
    } catch (error) {
      console.error(`Error generating ${cv.name} CV:`, error.message);
      results.push({ name: cv.name, success: false, error: error.message });
    }
  }

  console.log('\n======================================');
  console.log('   Summary');
  console.log('======================================');

  for (const result of results) {
    if (result.success) {
      console.log(`[OK] ${result.name}: ${result.path}`);
    } else {
      console.log(`[FAIL] ${result.name}: ${result.error}`);
    }
  }

  console.log('\nDone!');
}

main().catch(console.error);
