import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// ReadableStream polyfill for Node.js versions < 18
if (!globalThis.ReadableStream) {
  const { ReadableStream } = require('web-streams-polyfill/ponyfill');
  globalThis.ReadableStream = ReadableStream;
}

import { SaraminCrawler } from './SaraminCrawler.js';
import { connectDB, disconnectDB } from '../config/database.js';

async function main() {
  try {
    await connectDB();
    const crawler = new SaraminCrawler();
    await crawler.crawl('개발자', 10); // 10페이지 크롤링
  } catch (error) {
    console.error('크롤링 중 에러 발생:', error);
  } finally {
    await disconnectDB();
  }
}

main();