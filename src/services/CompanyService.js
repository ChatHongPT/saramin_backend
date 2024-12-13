import { Company } from '../models/Company.js';

export class CompanyService {
  async findOrCreate(name) {
    try {
      let company = await Company.findOne({ name });
      
      if (!company) {
        company = await Company.create({
          name,
          location: {
            coordinates: [0, 0] // 기본 좌표값
          }
        });
        console.log(`새로운 회사 등록: ${name}`);
      }
      
      return company;
    } catch (error) {
      console.error(`회사 정보 처리 중 오류: ${error.message}`);
      throw error;
    }
  }

  async updateLocation(companyId, locationData) {
    try {
      const company = await Company.findByIdAndUpdate(
        companyId,
        {
          $set: {
            'location.address': locationData.address,
            'location.city': locationData.city,
            'location.country': locationData.country,
            'location.coordinates': locationData.coordinates || [0, 0]
          }
        },
        { new: true }
      );
      return company;
    } catch (error) {
      console.error(`회사 위치 정보 업데이트 중 오류: ${error.message}`);
      throw error;
    }
  }
}