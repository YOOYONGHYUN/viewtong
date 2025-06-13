import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

interface Company {
  id: string;
  name: string;
  businessNumber: string;
  representative: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  logo?: string;
  description?: string;
  establishedDate: string;
  employeeCount: number;
  businessType: string;
  businessCategory: string;
}

const CompanyPage: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API로 회사 정보 로드
    // fetchCompanyInfo();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            회사 정보를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">
            회사 정보가 등록되어 있지 않습니다. 회사 정보를 등록해주세요.
          </p>
          <Link
            to="/mypage/biz/company/edit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            회사 정보 등록
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* 헤더 */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">회사 정보</h1>
                <div className="text-sm text-gray-500 mt-1">
                  <span>마이페이지</span>
                  <span className="mx-2">/</span>
                  <span>회사 정보</span>
                </div>
              </div>
              <Link
                to="/mypage/biz/company/edit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                정보 수정
              </Link>
            </div>
          </div>

          {/* 회사 정보 */}
          <div className="p-6">
            {/* 로고 */}
            {company.logo && (
              <div className="mb-8 flex justify-center">
                <img
                  src={company.logo}
                  alt={`${company.name} 로고`}
                  className="max-h-40 object-contain"
                />
              </div>
            )}

            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">회사명</p>
                    <p className="font-medium">{company.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">사업자등록번호</p>
                    <p className="font-medium">{company.businessNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">대표자</p>
                    <p className="font-medium">{company.representative}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">설립일</p>
                    <p className="font-medium">{company.establishedDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">사업 정보</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">업태</p>
                    <p className="font-medium">{company.businessType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">업종</p>
                    <p className="font-medium">{company.businessCategory}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">직원 수</p>
                    <p className="font-medium">{company.employeeCount}명</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">연락처 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">주소</p>
                    <p className="font-medium">{company.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">전화번호</p>
                    <p className="font-medium">{company.phoneNumber}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">이메일</p>
                    <p className="font-medium">{company.email}</p>
                  </div>
                  {company.website && (
                    <div>
                      <p className="text-gray-600">웹사이트</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 회사 소개 */}
            {company.description && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">회사 소개</h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {company.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
