/**
 * Script de generation de tous les CVs PDF
 * 4 versions x 2 langues = 8 PDFs
 *
 * Usage: node generate-all.js
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const VERSIONS = [
  { folder: 'v1-terminal', name: 'Terminal' },
  { folder: 'v2-editorial', name: 'Editorial' },
  { folder: 'v3-brutalist', name: 'Brutalist' },
  { folder: 'v4-classique', name: 'Classique' },
];

const LANGUAGES = [
  { file: 'cv-fr.html', suffix: 'FR', name: 'Francais' },
  { file: 'cv-en.html', suffix: 'EN', name: 'English' },
];

async function generatePDF(htmlPath, outputPath, description) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.goto(`file://${htmlPath}`, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  // Wait for fonts to load
  await page.evaluateHandle('document.fonts.ready');

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
  console.log(`  [OK] ${description}`);

  return outputPath;
}

async function main() {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║     CV PDF Generator - Ichai Wizman                  ║');
  console.log('║     4 Versions x 2 Languages = 8 PDFs                ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');

  // Create output directory
  const outputDir = path.resolve(__dirname, 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (const version of VERSIONS) {
    console.log(`\n📁 ${version.name}:`);

    for (const lang of LANGUAGES) {
      const htmlPath = path.resolve(__dirname, version.folder, lang.file);
      const outputFilename = `Ichai_Wizman_CV_${version.name}_${lang.suffix}.pdf`;
      const outputPath = path.resolve(outputDir, outputFilename);

      try {
        await generatePDF(htmlPath, outputPath, `${lang.name} -> ${outputFilename}`);
        results.push({ name: outputFilename, success: true });
        successCount++;
      } catch (error) {
        console.log(`  [FAIL] ${lang.name}: ${error.message}`);
        results.push({ name: outputFilename, success: false, error: error.message });
        failCount++;
      }
    }
  }

  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║                      SUMMARY                         ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`\n  Success: ${successCount}/${successCount + failCount}`);
  console.log(`  Output folder: ${outputDir}\n`);

  console.log('  Generated files:');
  for (const result of results) {
    const status = result.success ? '✓' : '✗';
    console.log(`    ${status} ${result.name}`);
  }

  console.log('\n  Done!\n');
}

main().catch(console.error);
