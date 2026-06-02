/**
 * EQUIVESA - Cloudinary & Supabase Asset Migration Script
 * 
 * This script runs locally in Node.js to upload a directory of horse photos or documents
 * to Cloudinary and update the corresponding records in your Supabase database.
 * 
 * Instructions:
 * 1. Install dependencies: npm install cloudinary @supabase/supabase-js dotenv
 * 2. Set up a .env file with your credentials:
 *    CLOUDINARY_CLOUD_NAME=your_cloud_name
 *    CLOUDINARY_API_KEY=your_api_key
 *    CLOUDINARY_API_SECRET=your_api_secret
 *    SUPABASE_URL=https://your-project.supabase.co
 *    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (needs write permissions)
 * 3. Place horse photos inside a folder (e.g. ./local_assets/horses/) named after the horse (e.g. "Equivesa.jpg" or matching the horse's UELN/name).
 * 4. Run: node cloudinary_migration.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { createClient } = require('@supabase/supabase-js');

// 1. Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// 2. Initialize Supabase (with service role key to bypass RLS for migration)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Please provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Folder path configurations
const LOCAL_HORSES_DIR = path.join(__dirname, 'local_assets', 'horses');

/**
 * Uploads a file to Cloudinary in a specific folder
 * @param {string} filePath - Absolute path to local file
 * @param {string} cloudinaryFolder - Target folder in Cloudinary
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
async function uploadToCloudinary(filePath, cloudinaryFolder = 'equivesa/horses') {
  try {
    const fileName = path.parse(filePath).name;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: cloudinaryFolder,
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto', // supports jpg, png, pdf, docx, etc.
    });
    console.log(`✅ Uploaded ${fileName} -> ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath} to Cloudinary:`, error.message);
    throw error;
  }
}

/**
 * Migration Runner for Horse Photos
 */
async function migrateHorsePhotos() {
  if (!fs.existsSync(LOCAL_HORSES_DIR)) {
    console.log(`⚠️  Local assets directory not found at: ${LOCAL_HORSES_DIR}`);
    console.log(`👉 Please create it and add horse photos named after the horse (e.g. "Tornado.jpg")`);
    return;
  }

  const files = fs.readdirSync(LOCAL_HORSES_DIR);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  
  const imageFiles = files.filter(file => 
    imageExtensions.includes(path.extname(file).toLowerCase())
  );

  if (imageFiles.length === 0) {
    console.log("ℹ️ No images found to migrate in", LOCAL_HORSES_DIR);
    return;
  }

  console.log(`🚀 Starting migration of ${imageFiles.length} horse photos...`);

  for (const file of imageFiles) {
    const filePath = path.join(LOCAL_HORSES_DIR, file);
    const horseName = path.parse(file).name; // File name without extension

    console.log(`\nProcessing image for horse: "${horseName}"`);

    // 1. Find horse in Supabase (case-insensitive name match)
    const { data: horses, error: fetchError } = await supabase
      .from('horses')
      .select('id, name')
      .ilike('name', horseName);

    if (fetchError) {
      console.error(`❌ Supabase error fetching horse "${horseName}":`, fetchError.message);
      continue;
    }

    if (!horses || horses.length === 0) {
      console.log(`⚠️  No horse found matching name "${horseName}" in Supabase. Skipping...`);
      continue;
    }

    const horse = horses[0];
    console.log(`🔗 Found matching horse in database: ${horse.name} (ID: ${horse.id})`);

    // 2. Upload to Cloudinary
    try {
      const cloudinaryUrl = await uploadToCloudinary(filePath, 'equivesa/horses');

      // 3. Update Supabase record with the Cloudinary URL
      const { error: updateError } = await supabase
        .from('horses')
        .update({ photo_url: cloudinaryUrl })
        .eq('id', horse.id);

      if (updateError) {
        console.error(`❌ Failed to update Supabase record for ${horse.name}:`, updateError.message);
      } else {
        console.log(`🎉 Successfully linked Cloudinary URL to ${horse.name} in Supabase!`);
      }
    } catch (uploadError) {
      // Error already logged in helper function
    }
  }
}

// Run Migration
(async () => {
  try {
    console.log("🏁 Starting Equivesa Data Migration Process...");
    await migrateHorsePhotos();
    console.log("\n🏁 Migration task finished.");
  } catch (err) {
    console.error("💥 Unhandled migration error:", err);
  }
})();
