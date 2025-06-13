import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/layout/Layout";

const AdditionalInfoPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const userId = query.get("userId") || "";
  const category = query.get("category") || "";

  // 유형 선택 단계 상태
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);

  // 기업 정보 입력 단계 상태
  const [companyInfo, setCompanyInfo] = useState({
    company_name: "",
    boss_name: "",
    company_number: "",
    certificate: null as File | null,
  });

  // 담당자 정보 입력 단계 상태
  const [contactInfo, setContactInfo] = useState({
    pic_fl_name: "",
    pic_name: "",
    pic_telno: "",
    pic_email: "",
  });

  // 동의 체크 상태
  const [agreements, setAgreements] = useState({
    agreeUse: false,
    agreePrivacy: false,
  });

  // 유형 선택 핸들러
  const handleUserTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedUserType(e.target.value);
  };

  // 유형 선택 완료 핸들러
  const checkType = () => {
    if (!selectedUserType) {
      alert("유형을 선택해주세요.");
      return;
    }
    setCurrentStep(2);
  };

  // 기업 정보 변경 핸들러
  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
  };

  // 담당자 정보 변경 핸들러
  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactInfo({
      ...contactInfo,
      [name]: value,
    });
  };

  // 사업자 등록증 파일 변경 핸들러
  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCompanyInfo({
        ...companyInfo,
        certificate: e.target.files[0],
      });
    }
  };

  // 약관 동의 체크 핸들러
  const handleAgreementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setAgreements({
      ...agreements,
      [id]: checked,
    });
  };

  // 사업자 인증 버튼 클릭 핸들러
  const verifyBusiness = () => {
    if (!companyInfo.company_name) {
      alert("회사명을 입력해주세요.");
      return;
    }
    if (!companyInfo.company_number) {
      alert("사업자 등록번호를 입력해주세요.");
      return;
    }
    if (!companyInfo.boss_name) {
      alert("대표자명을 입력해주세요.");
      return;
    }

    alert("사업자 인증이 완료되었습니다.");
  };

  // 회원가입 완료 핸들러
  const handleSignup = () => {
    if (!contactInfo.pic_fl_name || !contactInfo.pic_name) {
      alert("담당자 이름을 입력해주세요.");
      return;
    }
    if (!contactInfo.pic_telno) {
      alert("담당자 전화번호를 입력해주세요.");
      return;
    }
    if (!contactInfo.pic_email) {
      alert("담당자 이메일을 입력해주세요.");
      return;
    }
    if (!agreements.agreeUse || !agreements.agreePrivacy) {
      alert("이용약관 및 개인정보 수집에 동의해주세요.");
      return;
    }

    // 폼 데이터 제출 로직
    const formData = {
      userId,
      category,
      userType: selectedUserType,
      companyInfo,
      contactInfo,
    };

    console.log("제출된 데이터:", formData);
    // API 호출 로직 추가 필요

    setCurrentStep(4);
  };

  // 이용약관 표시 핸들러
  const showAgreeUser = () => {
    alert("이용약관 내용이 표시됩니다.");
  };

  // 개인정보 처리방침 표시 핸들러
  const showAgreePrivacy = () => {
    alert("개인정보 처리방침 내용이 표시됩니다.");
  };

  // 컴포넌트 마운트 시 알림 표시
  useEffect(() => {
    alert("회원정보를 추가로 입력하셔야 서비스 이용이 가능합니다.");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8 px-4">
      <div className="container max-w-md mx-auto">
        {/* 단계 1: 유형 선택 */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
              <p className="text-gray-600">유형을 선택해 주세요</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className={`bg-white border rounded-lg overflow-hidden p-4 cursor-pointer ${
                  selectedUserType === "user_type01"
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedUserType("user_type01")}
              >
                <h3 className="font-bold text-lg mb-2">브랜드사</h3>
                <p className="text-gray-600 text-sm mb-3">
                  뷰티 브랜드 입점을 희망하시면
                  <br />
                  여기를 클릭하세요 !
                </p>
                <div className="flex justify-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-blue-600"
                    name="user_type"
                    id="user_type01"
                    value="user_type01"
                    checked={selectedUserType === "user_type01"}
                    onChange={handleUserTypeChange}
                  />
                </div>
              </div>

              <div
                className={`bg-white border rounded-lg overflow-hidden p-4 cursor-pointer ${
                  selectedUserType === "user_type02"
                    ? "border-blue-500 shadow-md"
                    : "border-gray-200"
                }`}
                onClick={() => setSelectedUserType("user_type02")}
              >
                <h3 className="font-bold text-lg mb-2">유통사 MD</h3>
                <p className="text-gray-600 text-sm mb-3">
                  유통사 판매를 위해 상품 소싱을 하고자 하신다면
                  <br />
                  여기를 클릭하세요 !
                </p>
                <div className="flex justify-center">
                  <input
                    type="radio"
                    className="h-4 w-4 text-blue-600"
                    name="user_type"
                    id="user_type02"
                    value="user_type02"
                    checked={selectedUserType === "user_type02"}
                    onChange={handleUserTypeChange}
                  />
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <button
                type="button"
                className="px-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded transition"
                onClick={checkType}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {/* 단계 2: 기업 정보 입력 */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
              <p className="text-gray-600">회원정보 추가 입력</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">기업 정보 입력</div>
              <div>1 / 2</div>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="company_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  회사명
                </label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={companyInfo.company_name}
                  onChange={handleCompanyInfoChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="회사명 입력"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="boss_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  대표자명
                </label>
                <input
                  type="text"
                  id="boss_name"
                  name="boss_name"
                  value={companyInfo.boss_name}
                  onChange={handleCompanyInfoChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="대표자명 입력"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="company_number"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  사업자 등록번호
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="company_number"
                    name="company_number"
                    value={companyInfo.company_number}
                    onChange={handleCompanyInfoChange}
                    className="flex-grow p-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="사업자 등록번호 (- 없이 입력)"
                    required
                  />
                  <button
                    type="button"
                    onClick={verifyBusiness}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded-r-md"
                  >
                    인증
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="brCert"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  사업자 등록증
                </label>
                <input
                  type="file"
                  id="brCert"
                  name="brCert"
                  onChange={handleChangeFile}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  accept="image/*,.pdf"
                />
              </div>
            </form>

            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="w-full mt-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded"
            >
              다음
            </button>
          </div>
        )}

        {/* 단계 3: 담당자 정보 입력 */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
              <p className="text-gray-600">회원정보 추가 입력</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">담당자 입력</div>
              <div>2 / 2</div>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="pic_fl_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    담당자 성
                  </label>
                  <input
                    type="text"
                    id="pic_fl_name"
                    name="pic_fl_name"
                    value={contactInfo.pic_fl_name}
                    onChange={handleContactInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="담당자 성 입력"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="pic_name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    담당자 이름
                  </label>
                  <input
                    type="text"
                    id="pic_name"
                    name="pic_name"
                    value={contactInfo.pic_name}
                    onChange={handleContactInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="담당자 이름 입력"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="pic_telno"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  담당자 전화번호
                </label>
                <input
                  type="text"
                  id="pic_telno"
                  name="pic_telno"
                  value={contactInfo.pic_telno}
                  onChange={handleContactInfoChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="담당자 전화번호"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="pic_email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  담당자 회사 이메일
                </label>
                <input
                  type="email"
                  id="pic_email"
                  name="pic_email"
                  value={contactInfo.pic_email}
                  onChange={handleContactInfoChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="담당자 회사 이메일"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeUse"
                    checked={agreements.agreeUse}
                    onChange={handleAgreementChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="agreeUse"
                    className="ml-2 text-sm text-gray-700"
                  >
                    이용약관 동의
                  </label>
                  <button
                    type="button"
                    onClick={showAgreeUser}
                    className="ml-2 text-blue-500 text-sm underline"
                  >
                    내용보기
                  </button>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    checked={agreements.agreePrivacy}
                    onChange={handleAgreementChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="agreePrivacy"
                    className="ml-2 text-sm text-gray-700"
                  >
                    개인정보이용/수집 동의
                  </label>
                  <button
                    type="button"
                    onClick={showAgreePrivacy}
                    className="ml-2 text-blue-500 text-sm underline"
                  >
                    내용보기
                  </button>
                </div>
              </div>
            </form>

            <button
              type="button"
              onClick={handleSignup}
              className="w-full mt-6 py-2 bg-gray-700 hover:bg-gray-800 text-white font-medium rounded"
            >
              저장하기
            </button>
          </div>
        )}

        {/* 단계 4: 회원가입 완료 */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Sign Up</h2>
              <p className="text-gray-600">회원정보 추가 입력</p>
            </div>

            <div className="mb-4">
              <div className="font-bold mb-2">
                회원정보 추가 입력이 완료 되었습니다.
              </div>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>
                회원정보 추가 입력 완료 - 가입 승인 대기 - 가입 승인 완료(1~3일
                승인 영업일 기준)
              </p>
              <p className="text-red-500">
                가입 반려 시, 기존에 입력하신 정보는 삭제됩니다. 처음부터 가입
                절차를 진행해 주셔야 합니다.
              </p>
              <p>
                가입 신청이 반려되는 경우 담당자 이메일로 반려 사유를 안내해
                드립니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfoPage;
