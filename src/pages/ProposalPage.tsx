import React, { useState, useRef } from "react";
import Layout from "../components/layout/Layout";

const ProposalPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(1);
  const [proposalData, setProposalData] = useState({
    // 표지
    channelName: "",
    channelDate: "",
    coverLogo: null as File | null,

    // 회사소개
    companyLogo: null as File | null,
    business: "",
    ceo: "",
    location: "",
    establishDate: "",
    revenue: "",
    businessArea: "",

    // 회사소개 2
    brands: "",
    historyImage: null as File | null,
    historyItems: [
      { date: "", description: "" },
      { date: "", description: "" },
      { date: "", description: "" },
      { date: "", description: "" },
    ],

    // 브랜드 소개
    brandImage: null as File | null,
    brandMeaning: "",
    brandStory: "",

    // 상품 컨셉
    productImage: null as File | null,
    productConcept: "",
  });

  const fileInputRefs = {
    coverLogo: useRef<HTMLInputElement>(null),
    companyLogo: useRef<HTMLInputElement>(null),
    historyImage: useRef<HTMLInputElement>(null),
    brandImage: useRef<HTMLInputElement>(null),
    productImage: useRef<HTMLInputElement>(null),
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;

    if (
      id.startsWith("date-input-4-") ||
      id.startsWith("description-input-4-")
    ) {
      // 히스토리 아이템 업데이트
      const index = parseInt(id.split("-").pop() || "0") - 2;
      const fieldName = id.startsWith("date") ? "date" : "description";

      const updatedHistoryItems = [...proposalData.historyItems];
      updatedHistoryItems[index] = {
        ...updatedHistoryItems[index],
        [fieldName]: value,
      };

      setProposalData({
        ...proposalData,
        historyItems: updatedHistoryItems,
      });
    } else {
      // 일반 필드 업데이트
      const fieldMap: Record<string, keyof typeof proposalData> = {
        "text-input-1": "channelName",
        "example-date-1": "channelDate",
        "text-input-3-1": "business",
        "text-input-3-2": "ceo",
        "text-input-3-3": "location",
        "example-date-main": "establishDate",
        "text-input-3-5": "revenue",
        "text-input-3-6": "businessArea",
        "text-input-4-1": "brands",
        "text-input-5-1": "brandMeaning",
        "text-input-5-2": "brandStory",
        "text-input-6-1": "productConcept",
      };

      const fieldName = fieldMap[id];
      if (fieldName) {
        setProposalData({
          ...proposalData,
          [fieldName]: value,
        });
      }
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id } = e.target;

    if (e.target.files && e.target.files.length > 0) {
      const fileMap: Record<string, keyof typeof proposalData> = {
        "file-input-1": "coverLogo",
        "file-input-3": "companyLogo",
        "file-input-4": "historyImage",
        "file-input-5": "brandImage",
        "file-input-6": "productImage",
      };

      const fieldName = fileMap[id];
      if (fieldName) {
        setProposalData({
          ...proposalData,
          [fieldName]: e.target.files[0],
        });
      }
    }
  };

  const showSection = (sectionNumber: number) => {
    setCurrentSection(sectionNumber);
  };

  const downloadPdf = () => {
    alert("PDF 다운로드 기능이 실행됩니다.");
    // 실제 구현 시 PDF 생성 및 다운로드 로직 추가
  };

  return (
    <div className="flex bg-[#f8faff] min-h-screen">
      {/* 사이드바 메뉴 (제안서 편집 메뉴) */}
      <div className="w-[450px] p-6 bg-gray-200">
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-6"
          onClick={downloadPdf}
        >
          다운로드
        </button>

        {/* 표지 섹션 */}
        <div
          className={`bg-white p-4 rounded-lg shadow mb-4 ${
            currentSection === 1 ? "border-2 border-blue-500" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">표지</h2>
            <div className="flex items-center">
              <span className="mr-2">
                <span className="font-bold">01</span>/13
              </span>
              <button
                className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                onClick={() => showSection(2)}
              >
                다음
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="file-input-1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Logo 입력
              </label>
              <input
                type="file"
                id="file-input-1"
                ref={fileInputRefs.coverLogo}
                accept="image/*"
                onChange={handleChangeFile}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label
                htmlFor="text-input-1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                제안채널명
              </label>
              <input
                type="text"
                id="text-input-1"
                value={proposalData.channelName}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label
                htmlFor="example-date-1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date
              </label>
              <input
                type="date"
                id="example-date-1"
                value={proposalData.channelDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* 목차 섹션 */}
        <div
          className={`bg-white p-4 rounded-lg shadow mb-4 ${
            currentSection === 2 ? "border-2 border-blue-500" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">목차</h2>
            <div className="flex items-center">
              <span className="mr-2">
                <span className="font-bold">02</span>/13
              </span>
              <div className="flex space-x-2">
                <button
                  className="bg-gray-500 text-white py-1 px-3 rounded text-sm"
                  onClick={() => showSection(1)}
                >
                  이전
                </button>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                  onClick={() => showSection(3)}
                >
                  다음
                </button>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="file-input-2"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              관련 이미지
            </label>
            <input
              type="file"
              id="file-input-2"
              accept="image/*"
              onChange={handleChangeFile}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        {/* 회사소개 섹션 */}
        <div
          className={`bg-white p-4 rounded-lg shadow mb-4 ${
            currentSection === 3 ? "border-2 border-blue-500" : ""
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">회사소개</h2>
            <div className="flex items-center">
              <span className="mr-2">
                <span className="font-bold">03</span>/13
              </span>
              <div className="flex space-x-2">
                <button
                  className="bg-gray-500 text-white py-1 px-3 rounded text-sm"
                  onClick={() => showSection(2)}
                >
                  이전
                </button>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm"
                  onClick={() => showSection(4)}
                >
                  다음
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="file-input-3"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                회사 로고 삽입
              </label>
              <input
                type="file"
                id="file-input-3"
                ref={fileInputRefs.companyLogo}
                accept="image/*"
                onChange={handleChangeFile}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label
                htmlFor="text-input-3-1"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                주요 비즈니스
              </label>
              <textarea
                id="text-input-3-1"
                value={proposalData.business}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
              />
            </div>

            <div>
              <label
                htmlFor="text-input-3-2"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                대표이사
              </label>
              <input
                type="text"
                id="text-input-3-2"
                value={proposalData.ceo}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label
                htmlFor="text-input-3-3"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                본사위치
              </label>
              <input
                type="text"
                id="text-input-3-3"
                value={proposalData.location}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label
                htmlFor="example-date-main"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                설립일
              </label>
              <input
                type="date"
                id="example-date-main"
                value={proposalData.establishDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label
                htmlFor="text-input-3-5"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                매출액
              </label>
              <input
                type="text"
                id="text-input-3-5"
                value={proposalData.revenue}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label
                htmlFor="text-input-3-6"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                사업영역
              </label>
              <input
                type="text"
                id="text-input-3-6"
                value={proposalData.businessArea}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* 나머지 섹션들... 브라우저에서 보여지는 영역만 렌더링을 위해 축약 */}
      </div>

      {/* 미리보기 영역 */}
      <div className="flex-1 p-6">
        {/* 표지 미리보기 */}
        {currentSection === 1 && (
          <div className="bg-white p-8 shadow-lg rounded-lg max-w-2xl mx-auto">
            <div className="flex flex-col items-center justify-center min-h-[500px]">
              {proposalData.coverLogo && (
                <img
                  src={URL.createObjectURL(proposalData.coverLogo)}
                  alt="회사 로고"
                  className="mb-6 max-h-24"
                />
              )}

              <h1 className="text-3xl font-bold mb-2">제안서</h1>
              <h2 className="text-2xl font-bold mb-8">
                {proposalData.channelName || "[제안채널명]"}
              </h2>

              <div className="mt-auto">
                <p className="text-lg">
                  {proposalData.channelDate
                    ? new Date(proposalData.channelDate).toLocaleDateString()
                    : "날짜를 선택해주세요"}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 목차 미리보기 */}
        {currentSection === 2 && (
          <div className="bg-white p-8 shadow-lg rounded-lg max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">목차</h1>

            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-lg font-bold mr-4">01</span>
                <span className="text-lg">회사소개</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold mr-4">02</span>
                <span className="text-lg">브랜드 소개</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold mr-4">03</span>
                <span className="text-lg">상품 컨셉</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold mr-4">04</span>
                <span className="text-lg">판매현황</span>
              </div>
              <div className="flex items-center">
                <span className="text-lg font-bold mr-4">05</span>
                <span className="text-lg">마케팅</span>
              </div>
            </div>
          </div>
        )}

        {/* 회사소개 미리보기 */}
        {currentSection === 3 && (
          <div className="bg-white p-8 shadow-lg rounded-lg max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">회사소개</h1>

            <div className="flex justify-center mb-6">
              {proposalData.companyLogo && (
                <img
                  src={URL.createObjectURL(proposalData.companyLogo)}
                  alt="회사 로고"
                  className="max-h-24"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-bold mb-2">주요 비즈니스</h3>
                <p>{proposalData.business || "-"}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">대표이사</h3>
                <p>{proposalData.ceo || "-"}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">본사위치</h3>
                <p>{proposalData.location || "-"}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">설립일</h3>
                <p>{proposalData.establishDate || "-"}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">매출액</h3>
                <p>{proposalData.revenue || "-"}</p>
              </div>

              <div>
                <h3 className="font-bold mb-2">사업영역</h3>
                <p>{proposalData.businessArea || "-"}</p>
              </div>
            </div>
          </div>
        )}

        {/* 나머지 섹션 미리보기... */}
      </div>
    </div>
  );
};

export default ProposalPage;
