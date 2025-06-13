import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";

interface DocumentData {
  proposalChannelName: string;
  proposalChannelDate: string;
  logo: string;
  relatedImage: string;
  business: string;
  companyName: string;
  ceo: string;
  companyDate: string;
  location: string;
  mainPhone: string;
  fax: string;
}

const ProductDocumentViewPage: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [currentSection, setCurrentSection] = useState(1);
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [mainColor, setMainColor] = useState("#7eb3e7");

  useEffect(() => {
    // TODO: API로 문서 데이터 로드
    // fetchDocumentData(documentId);
  }, [documentId]);

  const handleSectionChange = (sectionNumber: number) => {
    setCurrentSection(sectionNumber);
  };

  const sections = [
    { id: 1, title: "표지" },
    { id: 2, title: "목차" },
    { id: 3, title: "회사 소개" },
    { id: 4, title: "브랜드 소개" },
    { id: 5, title: "상품 소개" },
    { id: 6, title: "입점제안" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 문서 네비게이션 */}
        <div className="mb-6">
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                  currentSection === section.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* 문서 내용 */}
        <div className="bg-white rounded-lg shadow-lg">
          {currentSection === 1 && (
            <div className="p-8 text-center">
              {documentData?.logo && (
                <img
                  src={documentData.logo}
                  alt="Company Logo"
                  className="mx-auto mb-8 max-w-xs"
                />
              )}
              <div className="space-y-4 max-w-lg mx-auto">
                <input
                  type="text"
                  value={documentData?.proposalChannelName || ""}
                  readOnly
                  className="w-full text-2xl font-bold text-center border-none focus:ring-0"
                />
                <input
                  type="text"
                  value={documentData?.proposalChannelDate || ""}
                  readOnly
                  className="w-full text-gray-600 text-center border-none focus:ring-0"
                />
              </div>
            </div>
          )}

          {currentSection === 2 && (
            <div className="p-8 flex">
              <div className="w-1/2">
                {documentData?.relatedImage && (
                  <img
                    src={documentData.relatedImage}
                    alt="Related"
                    className="w-full rounded-lg"
                  />
                )}
              </div>
              <div className="w-1/2 p-8" style={{ backgroundColor: mainColor }}>
                <h2 className="text-2xl font-bold text-white mb-6">목차</h2>
                <div className="space-y-4 text-white">
                  <p>1. 회사 소개</p>
                  <p>2. 브랜드 소개</p>
                  <p>3. 상품 소개</p>
                  <p>4. 입점제안</p>
                  <p>5. 마케팅 요약</p>
                  <p>6. 문의</p>
                </div>
              </div>
            </div>
          )}

          {currentSection === 3 && (
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  <span className="text-3xl">01</span> 회사 소개
                  <span className="text-gray-500 ml-2">[ 기업 소개 ]</span>
                </h2>
                {documentData?.logo && (
                  <img
                    src={documentData.logo}
                    alt="Company Logo"
                    className="h-16"
                  />
                )}
              </div>

              <div className="max-w-3xl mx-auto">
                <textarea
                  value={documentData?.business || ""}
                  readOnly
                  rows={5}
                  className="w-full mb-6 p-4 border rounded-lg resize-none"
                />

                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left w-1/4 bg-gray-50">
                        회사명
                      </th>
                      <td className="py-3 px-4">{documentData?.companyName}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left w-1/4 bg-gray-50">
                        대표자
                      </th>
                      <td className="py-3 px-4">{documentData?.ceo}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left w-1/4 bg-gray-50">
                        설립연도
                      </th>
                      <td className="py-3 px-4">{documentData?.companyDate}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left w-1/4 bg-gray-50">
                        주소
                      </th>
                      <td className="py-3 px-4">{documentData?.location}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left w-1/4 bg-gray-50">
                        대표전화
                      </th>
                      <td className="py-3 px-4">{documentData?.mainPhone}</td>
                    </tr>
                    <tr className="border-b">
                      <th className="py-3 px-4 text-left w-1/4 bg-gray-50">
                        Fax
                      </th>
                      <td className="py-3 px-4">{documentData?.fax}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDocumentViewPage;
