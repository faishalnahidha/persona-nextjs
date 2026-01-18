/**
 * Debug script to check environment variables
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

// import { connectDB } from '../src/lib/db/mongodb';

console.log('🔍 Debugging environment variables...\n');

// Check current working directory
console.log('📁 Current directory:', process.cwd());

// Check if .env.local exists
const envPath = resolve(process.cwd(), '.env.local');
console.log('📄 .env.local path:', envPath);
console.log('✅ .env.local exists:', existsSync(envPath));

// Try to load .env.local
console.log('\n🔧 Loading .env.local...');
const result = config({ path: envPath });

if (result.error) {
  console.log('❌ Error loading .env.local:', result.error);
} else {
  console.log('✅ .env.local loaded successfully');
}

// Check MONGODB_URI
console.log('\n🗃️  Environment variables:');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log(
  'MONGODB_URI value:',
  process.env.MONGODB_URI
    ? process.env.MONGODB_URI.substring(0, 20) + '...'
    : 'undefined',
);

// List all env variables (first 50 chars only for safety)
console.log('\n📋 All environment variables starting with MONGO or NEXT:');
Object.keys(process.env)
  .filter(key => key.startsWith('MONGO') || key.startsWith('NEXT'))
  .forEach(key => {
    const value = process.env[key] || '';
    console.log(`${key}:`, value.substring(0, 30) + '...');
  });
