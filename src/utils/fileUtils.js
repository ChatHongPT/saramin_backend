import fs from 'fs';
import path from 'path';

export class FileUtils {
  static saveToJson(data, filename) {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
      }

      // Save data to JSON file
      const filePath = path.join(dataDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      
      return filePath;
    } catch (error) {
      console.error('Error saving data to JSON:', error);
      throw error;
    }
  }

  static loadFromJson(filename) {
    try {
      const filePath = path.join(process.cwd(), 'data', filename);
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading data from JSON:', error);
      return null;
    }
  }
}