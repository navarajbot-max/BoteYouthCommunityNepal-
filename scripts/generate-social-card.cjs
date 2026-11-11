const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const publicDir = path.join(rootDir, 'public');
const logoPath = path.join(publicDir, 'uploads', 'header_logo_1789693984575_mmutt.png');

if (!fs.existsSync(logoPath)) {
  console.error('Logo file not found:', logoPath);
  process.exit(1);
}

// 1. Copy original 1:1 emblem directly to standard locations
fs.copyFileSync(logoPath, path.join(publicDir, 'logo.png'));
fs.copyFileSync(logoPath, path.join(publicDir, 'bycn-logo.png'));
fs.copyFileSync(logoPath, path.join(publicDir, 'favicon.png'));

// Font paths
const fontDevBold = '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf';
const fontDevReg = '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf';
const fontSansBold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const fontSansReg = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

const tmpDir = path.join(rootDir, '.tmp_og');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const bgPath = path.join(tmpDir, 'bg.png');
const emblemScaled = path.join(tmpDir, 'emblem_380.png');
const emblemCircular = path.join(tmpDir, 'emblem_circle.png');
const circlePlate = path.join(tmpDir, 'circle_plate.png');
const outBannerPath = path.join(publicDir, 'og-image.png');
const outSquarePath = path.join(publicDir, 'og-image-square.png');

try {
  // Generate gradient background 1200x630 with a subtle golden inner border
  execSync(
    `convert -size 1200x630 gradient:'#001844'-'#7B0017' \\
     -stroke '#F59E0B' -strokewidth 4 -fill none -draw "roundrectangle 16,16 1184,614 24,24" \\
     "${bgPath}"`
  );

  // Resize logo to 380x380
  execSync(`convert "${logoPath}" -resize 380x380 -background none "${emblemScaled}"`);

  // Mask logo to clean circle (removes square white background corners)
  execSync(
    `convert "${emblemScaled}" \\
     \\( -size 380x380 xc:none -fill white -draw "circle 190,190 190,0" \\) \\
     -alpha set -compose DstIn -composite "${emblemCircular}"`
  );

  // Create crisp white circular plate with gold rim
  execSync(
    `convert -size 410x410 xc:none \\
     -fill '#FFFFFF' -stroke '#F59E0B' -strokewidth 6 \\
     -draw "circle 205,205 205,6" "${circlePlate}"`
  );

  // Composite circular emblem onto plate
  const plateWithEmblem = path.join(tmpDir, 'plate_with_emblem.png');
  execSync(`convert "${circlePlate}" "${emblemCircular}" -gravity center -composite "${plateWithEmblem}"`);

  // Composite plate onto background at x=75, y=110
  const compositeWithLogo = path.join(tmpDir, 'step1.png');
  execSync(`convert "${bgPath}" "${plateWithEmblem}" -geometry +75+110 -composite "${compositeWithLogo}"`);

  // Add text layers with exact font paths
  execSync(
    `convert "${compositeWithLogo}" \\
     -font "${fontDevBold}" -pointsize 46 -fill '#FFFFFF' -annotate +520+165 "नेपाल बोटे युवा समाज" \\
     -font "${fontSansBold}" -pointsize 38 -fill '#FBBF24' -annotate +520+225 "Bote Youth Community Nepal" \\
     -font "${fontDevReg}" -pointsize 26 -fill '#FDE68A' -annotate +520+280 "सम्पदाको संरक्षण • भविष्यको सशक्तीकरण" \\
     -font "${fontSansReg}" -pointsize 21 -fill '#E2E8F0' -annotate +520+335 "Indigenous River Heritage • Language • Youth Leadership" \\
     -font "${fontDevReg}" -pointsize 20 -fill '#E0F2FE' -annotate +520+380 "केन्द्रीय कार्यालय: कर्मैया, सर्लाही, नेपाल" \\
     -font "${fontSansReg}" -pointsize 19 -fill '#CBD5E1' -annotate +520+420 "Central Office: Karmaiya, Sarlahi Ward 11, Nepal" \\
     -font "${fontSansBold}" -pointsize 20 -fill '#F59E0B' -annotate +520+485 "boteyouthcommunity.org.np" \\
     -font "${fontSansReg}" -pointsize 18 -fill '#94A3B8' -annotate +520+520 "Official Platform • Verified Digital Community ID" \\
     "${outBannerPath}"`
  );

  console.log('Successfully generated 1200x630 banner at', outBannerPath);

  // Square Card (600x600)
  execSync(
    `convert -size 600x600 gradient:'#001844'-'#7B0017' \\
     -stroke '#F59E0B' -strokewidth 4 -fill none -draw "roundrectangle 12,12 588,588 20,20" \\
     "${tmpDir}/sq_bg.png"`
  );

  const sqEmblemScaled = path.join(tmpDir, 'sq_emblem_360.png');
  const sqEmblemCircular = path.join(tmpDir, 'sq_emblem_circle.png');
  const sqPlate = path.join(tmpDir, 'sq_plate.png');

  execSync(`convert "${logoPath}" -resize 360x360 -background none "${sqEmblemScaled}"`);
  execSync(
    `convert "${sqEmblemScaled}" \\
     \\( -size 360x360 xc:none -fill white -draw "circle 180,180 180,0" \\) \\
     -alpha set -compose DstIn -composite "${sqEmblemCircular}"`
  );

  execSync(
    `convert -size 386x386 xc:none \\
     -fill '#FFFFFF' -stroke '#F59E0B' -strokewidth 5 \\
     -draw "circle 193,193 193,5" "${sqPlate}"`
  );

  execSync(`convert "${sqPlate}" "${sqEmblemCircular}" -gravity center -composite "${tmpDir}/sq_combo.png"`);
  execSync(`convert "${tmpDir}/sq_bg.png" "${tmpDir}/sq_combo.png" -gravity north -geometry +0+35 -composite "${tmpDir}/sq_step1.png"`);

  execSync(
    `convert "${tmpDir}/sq_step1.png" \\
     -font "${fontDevBold}" -pointsize 28 -fill '#FFFFFF' -gravity south -annotate +0+95 "नेपाल बोटे युवा समाज" \\
     -font "${fontSansBold}" -pointsize 22 -fill '#FBBF24' -gravity south -annotate +0+65 "Bote Youth Community Nepal" \\
     -font "${fontSansReg}" -pointsize 16 -fill '#CBD5E1' -gravity south -annotate +0+35 "boteyouthcommunity.org.np • Karmaiya, Sarlahi" \\
     "${outSquarePath}"`
  );

  console.log('Successfully generated 600x600 square card at', outSquarePath);

  // Sync to dist if dist exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(outBannerPath, path.join(distDir, 'og-image.png'));
    fs.copyFileSync(outSquarePath, path.join(distDir, 'og-image-square.png'));
    fs.copyFileSync(path.join(publicDir, 'logo.png'), path.join(distDir, 'logo.png'));
    fs.copyFileSync(path.join(publicDir, 'bycn-logo.png'), path.join(distDir, 'bycn-logo.png'));
    fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(distDir, 'favicon.png'));
  }

  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch (e) {
  console.error('Failed generating banner via ImageMagick:', e);
  process.exit(1);
}
