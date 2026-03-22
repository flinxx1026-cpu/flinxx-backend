#!/usr/bin/env node

/**
 * S3 & CloudFront Deployment Script
 * Deploys dist2/ to S3 and invalidates CloudFront cache
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const AWS_REGION = 'us-east-1';
const S3_BUCKET = process.env.S3_BUCKET || 'flinxx-frontend'; // Update if needed
const CLOUDFRONT_ID = 'd2v5adgyikd2u0';
const DIST_DIR = path.join(__dirname, 'frontend', 'dist2');

console.log('\n🚀 Flinxx Frontend Deployment Script\n');
console.log('📋 Configuration:');
console.log(`   Region: ${AWS_REGION}`);
console.log(`   S3 Bucket: ${S3_BUCKET}`);
console.log(`   CloudFront ID: ${CLOUDFRONT_ID}`);
console.log(`   Source: ${DIST_DIR}\n`);

// Step 1: Verify dist2 exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ ERROR: dist2/ directory not found!');
  console.error('   Run: npm run build');
  process.exit(1);
}

console.log('✅ dist2/ directory found\n');

// Step 2: Deploy to S3
function deployToS3() {
  console.log('📤 Deploying to S3...\n');
  
  const cmd = `aws s3 sync "${DIST_DIR}" s3://${S3_BUCKET}/ --delete --region ${AWS_REGION}`;
  console.log(`   Command: ${cmd}\n`);
  
  return new Promise((resolve, reject) => {
    const proc = spawn('powershell.exe', ['-Command', cmd], { 
      stdio: 'inherit',
      shell: true 
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ S3 deployment complete\n');
        resolve();
      } else {
        reject(new Error(`S3 sync failed with code ${code}`));
      }
    });
  });
}

// Step 3: Invalidate CloudFront
function invalidateCloudFront() {
  console.log('🔄 Invalidating CloudFront cache...\n');
  
  const cmd = `aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_ID} --paths "/*" --region ${AWS_REGION}`;
  console.log(`   Command: ${cmd}\n`);
  
  return new Promise((resolve, reject) => {
    const proc = spawn('powershell.exe', ['-Command', cmd], { 
      stdio: 'inherit',
      shell: true 
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ CloudFront invalidation initiated\n');
        resolve();
      } else {
        reject(new Error(`CloudFront invalidation failed with code ${code}`));
      }
    });
  });
}

// Main execution
(async () => {
  try {
    await deployToS3();
    await invalidateCloudFront();
    
    console.log('✨ Deployment complete!\n');
    console.log('📌 Next steps:');
    console.log('   1. Monitor CloudFront invalidation status');
    console.log('   2. Wait 2-5 minutes for cache to clear');
    console.log(`   3. Test: https://${CLOUDFRONT_ID}.cloudfront.net\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message, '\n');
    process.exit(1);
  }
})();
