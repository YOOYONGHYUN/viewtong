import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";

const KakaoSelectUserTypePage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const email = query.get("email") || "";

  const handleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedType(e.target.value);
  };

  const handleNext = () => {
    if (selectedType === "user_type01") {
      navigate(`/signup_kakao?category=1&email=${email}`);
    } else if (selectedType === "user_type02") {
      navigate(`/signup_kakao?category=2&email=${email}`);
    } else {
      alert("유형을 선택해주세요.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
            Sign Up
          </h2>
          <p className="text-lg text-gray-600">유형을 선택해 주세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={`bg-white shadow-md rounded-lg overflow-hidden border-2 ${
              selectedType === "user_type01"
                ? "border-blue-500"
                : "border-transparent"
            } transition-all`}
            onClick={() => setSelectedType("user_type01")}
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-3">브랜드사</h3>
              <p className="text-gray-600 mb-4">
                뷰티 브랜드 입점을 희망하시면
                <br />
                여기를 클릭하세요 !
              </p>
              <div className="flex justify-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  name="user_type"
                  id="user_type01"
                  value="user_type01"
                  checked={selectedType === "user_type01"}
                  onChange={handleTypeChange}
                />
              </div>
            </div>
          </div>

          <div
            className={`bg-white shadow-md rounded-lg overflow-hidden border-2 ${
              selectedType === "user_type02"
                ? "border-blue-500"
                : "border-transparent"
            } transition-all`}
            onClick={() => setSelectedType("user_type02")}
          >
            <div className="p-6 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                유통사 MD
              </h3>
              <p className="text-gray-600 mb-4">
                유통사 판매를 위해 상품 소싱을 하고자 하신다면
                <br />
                여기를 클릭하세요 !
              </p>
              <div className="flex justify-center">
                <input
                  type="radio"
                  className="form-radio h-5 w-5 text-blue-600"
                  name="user_type"
                  id="user_type02"
                  value="user_type02"
                  checked={selectedType === "user_type02"}
                  onChange={handleTypeChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            type="button"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            onClick={handleNext}
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default KakaoSelectUserTypePage;
