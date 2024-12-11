# schema.py

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class Company(BaseModel):
    """회사 정보 모델"""
    id: str = Field(default_factory=str)
    name: str  # 회사명 (unique)
    location: str  # 회사 위치
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class WorkConditions(BaseModel):
    """근무조건 모델"""
    location: str = ""  # 근무지 상세
    job_type: str = ""  # 고용형태
    work_shift: str = ""  # 근무시간

class JobPosting(BaseModel):
    """채용 공고 모델"""
    id: str = Field(default_factory=str)
    company_id: str
    company_name: str
    title: str
    original_url: str  # 원본 채용공고 URL

    description: str = ""  # 직무 상세 설명
    tasks: List[str] = Field(default_factory=list)
    requirements: List[str] = Field(default_factory=list)
    preferred: List[str] = Field(default_factory=list)
    benefits: List[str] = Field(default_factory=list)
    process: List[str] = Field(default_factory=list)

    location: str = ""  # 근무지 주소
    detail_location: str = ""  # 상세 근무지
    job_type: str = ""  # 고용형태
    experience_level: str = ""  # 경력 요건
    education: str = ""  # 학력 요건
    conditions: WorkConditions = Field(default_factory=WorkConditions)  # 상세 근무조건

    salary_text: str = ""  # 급여 정보
    sector: str = ""  # 직무 분야
    skills: List[str] = Field(default_factory=list)  # 기술 스택 목록
    deadline: str = ""  # 마감일 텍스트
    deadline_timestamp: Optional[datetime] = None  # 마감일 파싱된 값

    status: str = "active"  # 채용 상태
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        schema_extra = {
            "example": {
                "company_name": "베스핀글로벌(주)",
                "title": "Cloud SA 담당자 영입(SRE 1팀)",
                "description": "백엔드 개발팀에서 새로운 서비스 개발 및 유지보수를 담당할 개발자를 모집합니다.",
                "tasks": ["백엔드 서비스 개발", "API 설계 및 구현", "클라우드 활용"],
                "requirements": ["Python 개발 경력 3년 이상", "웹 프레임워크 사용 경험"],
                "preferred": ["Kubernetes 경험자", "AWS 사용 경험자"],
                "benefits": ["점심식사 제공", "자유로운 휴가사용", "원격근무 가능"],
                "conditions": {"location": "서울특별시 강남구", "job_type": "정규직", "work_shift": "주 5일 (월-금) 09:00-18:00"},
                "location": "서울 서초구",
                "salary_text": "정보 없음",
                "sector": "클라우드, DevOps, IDC, 아키텍쳐, AWS",
                "original_url": "https://www.saramin.co.kr/zf_user/jobs/relay/view?view_type=search&rec…"
            }
        }
