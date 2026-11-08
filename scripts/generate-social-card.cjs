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
console.log('Copied official emblem to public/logo.png, public/bycn-logo.png, and public/favicon.png');

// Font paths
const fontDevBold = '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf';
const fontDevReg = '/usr/share/fonts/truetype/noto/NotoSansDevanagari-Regular.ttf';
const fontSansBold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';
const fontSansReg = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';

const tmpDir = path.join(rootDir, '.tmp_og');
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

const bgPath = path.join(tmpDir, 'bg.png');
const emblemScaled = path.join(tmpDir, 'emblem_400.png');
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

  // Resize logo smoothly to 380x380
  execSync(`convert "${logoPath}" -resize 380x380 -background none "${emblemScaled}"`);

  // Create crisp white circular backdrop (420x420) with border for the emblem
  execSync(
    `convert -size 420x420 xc:none \\
     -fill '#FFFFFF' -stroke '#F59E0B' -strokewidth 5 \\
     -draw "circle 210,210 210,5" "${circlePlate}"`
  );

  // Composite emblem onto circle plate
  const circleWithEmblem = path.join(tmpDir, 'plate_with_emblem.png');
  execSync(`convert "${circlePlate}" "${emblemScaled}" -gravity center -composite "${circleWithEmblem}"`);

  // Composite plate onto background at x=75, y=105
  const compositeWithLogo = path.join(tmpDir, 'step1.png');
  execSync(`convert "${bgPath}" "${circleWithEmblem}" -geometry +70+105 -composite "${compositeWithLogo}"`);

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

  // Also create a 600x600 square card (ideal for WhatsApp small previews and profile shares)
  execSync(
    `convert -size 600x600 gradient:'#001844'-'#7B0017' \\
     -stroke '#F59E0B' -strokewidth 4 -fill none -draw "roundrectangle 12,12 588,588 20,20" \\
     "${tmpDir}/sq_bg.png"`
  );

  execSync(`convert "${logoPath}" -resize 360x360 -background none "${tmpDir}/sq_logo.png"`);
  execSync(
    `convert -size 390x390 xc:none \\
     -fill '#FFFFFF' -stroke '#F59E0B' -strokewidth 4 \\
     -draw "circle 195,195 195,5" "${tmpDir}/sq_circle.png"`
  );
  execSync(`convert "${tmpDir}/sq_circle.png" "${tmpDir}/sq_logo.png" -gravity center -composite "${tmpDir}/sq_emblem.png"`);
  execSync(`convert "${tmpDir}/sq_bg.png" "${tmpDir}/sq_emblem.png" -gravity north -geometry +0+40 -composite "${tmpDir}/sq_step1.png"`);

  execSync(
    `convert "${tmpDir}/sq_step1.png" \\
     -font "${fontDevBold}" -pointsize 28 -fill '#FFFFFF' -gravity south -annotate +0+95 "नेपाल बोटे युवा समाज" \\
     -font "${fontSansBold}" -pointsize 22 -fill '#FBBF24' -gravity south -annotate +0+65 "Bote Youth Community Nepal" \\
     -font "${fontSansReg}" -pointsize 16 -fill '#CBD5E1' -gravity south -annotate +0+35 "boteyouthcommunity.org.np • Karmaiya, Sarlahi" \\
     "${outSquarePath}"`
  );

  console.log('Successfully generated 600x600 square card at', outSquarePath);

  // Also copy to dist if dist exists
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(outBannerPath, path.join(distDir, 'og-image.png'));
    fs.copyFileSync(outSquarePath, path.join(distDir, 'og-image-square.png'));
    fs.copyFileSync(path.join(publicDir, 'logo.png'), path.join(distDir, 'logo.png'));
    fs.copyFileSync(path.join(publicDir, 'bycn-logo.png'), path.join(distDir, 'bycn-logo.png'));
    fs.copyFileSync(path.join(publicDir, 'favicon.png'), path.join(distDir, 'favicon.png'));
    console.log('Mirrored social cards to dist/');
  }

  // Clean up temporary files
  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch (e) {
  console.error('Failed generating banner via ImageMagick:', e);
  process.exit(1);
}
