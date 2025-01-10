import { setupApplication } from './app.js';
import dotenv from 'dotenv';
import { DesignTokenExtractor } from './features/designTokens/tokenExtractor.js';
import { extractFileMetadata, extractColors, extractTextStyles } from './utils/figmaUtils.js';

// Load environment variables
dotenv.config();

async function main() {
  console.log('Starting application...');
  
  const app = await setupApplication();
  
  if (!app.ready) {
    console.error('Application failed to start:', app.error);
    process.exit(1);
  }

  const { clients } = app;

  try {
    if (!clients?.figma) {
      throw new Error('Figma client is not initialized');
    }
    
    const fileId = '5tj54aykiKmEvrVCiF5AbO'; // Your Figma file ID
    
    console.log('\nTesting Figma API features...');

    // 1. Get file details
    console.log('\nGetting file details...');
    const fileData = await clients.figma.getFile(fileId);
    console.log('File name:', fileData.name);

    // 2. Get components
    console.log('\nGetting file components...');
    const components = await clients.figma.getFileComponents(fileId);
    console.log('Components:', components);

    // 3. Get comments
    console.log('\nGetting file comments...');
    const comments = await clients.figma.getComments(fileId);
    console.log('Comments:', comments);

    // Get and process file data
    console.log('\nFile Metadata:');
    console.log(extractFileMetadata(fileData));
    
    console.log('\nColors Used:');
    console.log(extractColors(fileData));
    
    console.log('\nText Styles:');
    console.log(extractTextStyles(fileData));

    // Extract design tokens
    console.log('\nExtracting design tokens...');
    const tokenExtractor = new DesignTokenExtractor();
    const tokens = tokenExtractor.extract(fileData.document);
    
    // Log results
    console.log('\nDesign Tokens:');
    console.log(JSON.stringify(tokens, null, 2));

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

console.log('Initializing...');
main().catch(console.error); 