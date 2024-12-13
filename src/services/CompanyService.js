import { Company } from '../models/Company.js';

export class CompanyService {
  async findOrCreate(name) {
    try {
      let company = await Company.findOne({ name });
      if (!company) {
        company = await Company.create({ name });
        console.log(`새로운 회사 등록: ${name}`);
      }
      return company;
    } catch (error) {
      console.error(`회사 정보 처리 중 오류: ${error.message}`);
      throw error;
    }
  }
}