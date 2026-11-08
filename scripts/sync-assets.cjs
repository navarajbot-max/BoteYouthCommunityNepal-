const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const dataUploadsDir = path.join(rootDir, 'data', 'uploads');
const publicUploadsDir = path.join(rootDir, 'public', 'uploads');
const distUploadsDir = path.join(rootDir, 'dist', 'uploads');

// Ensure public/uploads directory exists
if (!fs.existsSync(publicUploadsDir)) {
  fs.mkdirSync(publicUploadsDir, { recursive: true });
}

// Copy from data/uploads to public/uploads
if (fs.existsSync(dataUploadsDir)) {
  try {
    const files = fs.readdirSync(dataUploadsDir);
    for (const file of files) {
      const src = path.join(dataUploadsDir, file);
      const dest = path.join(publicUploadsDir, file);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, dest);
      }
    }
    console.log(`[sync-assets] Copied ${files.length} upload files to public/uploads`);
  } catch (err) {
    console.warn('[sync-assets] Error syncing data/uploads to public/uploads:', err);
  }
}

// If dist exists, copy to dist/uploads as well
if (fs.existsSync(path.join(rootDir, 'dist'))) {
  if (!fs.existsSync(distUploadsDir)) {
    fs.mkdirSync(distUploadsDir, { recursive: true });
  }
  if (fs.existsSync(publicUploadsDir)) {
    try {
      const pubFiles = fs.readdirSync(publicUploadsDir);
      for (const file of pubFiles) {
        const src = path.join(publicUploadsDir, file);
        const dest = path.join(distUploadsDir, file);
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, dest);
        }
      }
      console.log(`[sync-assets] Copied ${pubFiles.length} files to dist/uploads`);
    } catch (err) {
      console.warn('[sync-assets] Error syncing to dist/uploads:', err);
    }
  }
}
