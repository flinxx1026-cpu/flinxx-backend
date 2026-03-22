#!/usr/bin/env node

/**
 * Frontend Deployment Script to S3 using Node.js
 */

const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const AWS_REGION = 'us-east-1';
const S3_BUCKET = 'flinxx-frontend';
const CLOUDFRONT_ID = 'd2v5adgyikd2u0';
const DIST_DIR = path.join(__dirname, 'frontend', 'dist');

console.log('\n🚀 Flinxx Frontend Deployment Script (Node.js)\n');
console.log('📋 Configuration:');
console.log(`   Region: ${AWS_REGION}`);
console.log(`   S3 Bucket: ${S3_BUCKET}`);
console.log(`   CloudFront ID: ${CLOUDFRONT_ID}`);
console.log(`   Source: ${DIST_DIR}\n`);

// Verify dist exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ ERROR: dist/ directory not found!');
  process.exit(1);
}

console.log('✅ dist/ directory found\n');

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION
});

// Get MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.json': 'application/json'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Get cache control based on file type
function getCacheControl(filePath) {
  // HTML files: no cache
  if (filePath.endsWith('.html')) {
    return 'no-cache, no-store, must-revalidate';
  }
  // Assets with hash in name: long cache
    if (/\.[a-f0-9]{8,}\.(js|css)$/.test(filePath)) {
    return 'public, max-age=31536000, immutable';
  }
  // Other files: moderate cache
  return 'public, max-age=3600';
}

// Upload a single file to S3
async function uploadFile(localPath, s3Key) {
  try {
    const fileContent = fs.readFileSync(localPath);
    const contentType = getMimeType(localPath);
    const cacheControl = getCacheControl(localPath);
    
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
      CacheControl: cacheControl
    });

    await s3Client.send(command);
    console.log(`  ✅ Uploaded: ${s3Key}`);
  } catch (error) {
    console.error(`  ❌ Failed to upload ${s3Key}:`, error.message);
    throw error;
  }
}

// Recursively upload directory contents
async function uploadDirectory(dirPath, s3Prefix = '') {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const localPath = path.join(dirPath, file);
    const stat = fs.statSync(localPath);
    const s3Key = s3Prefix ? `${s3Prefix}/${file}` : file;

    if (stat.isDirectory()) {
      await uploadDirectory(localPath, s3Key);
    } else {
      await uploadFile(localPath, s3Key);
    }
  }
}

// Main deployment
(async () => {
  try {
    console.log('📤 Uploading files to S3...\n');
    await uploadDirectory(DIST_DIR);
    
    console.log('\n✨ Frontend deployment complete!');
    console.log(`\n📌 Next: Invalidate CloudFront cache for distribution ${CLOUDFRONT_ID}`);
    console.log(`   Command: aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*" --region ${AWS_REGION}\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message, '\n');
    process.exit(1);
  }
})();
