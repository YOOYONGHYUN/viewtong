import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

interface CompanyForm {
  name: string;
  businessNumber: string;
  representative: string;
  address: string;
  phoneNumber: string;
  email: string;
  website?: string;
  logo?: File;
  description?: string;
  establishedDate: string;
  employeeCount: number;
  businessType: string;
  businessCategory: string;
}

const CompanyEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<CompanyForm>({
    name: "",
    businessNumber: "",
    representative: "",
    address: "",
    phoneNumber: "",
    email: "",
    website: "",
    establishedDate: "",
    employeeCount: 0,
    businessType: "",
    businessCategory: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<CompanyForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);

  useEffect(() => {
    // TODO: API로 기존 회사 정보 로드
    // fetchCompanyInfo();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 메시지 제거
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, logo: file }));
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<CompanyForm> = {};

    if (!form.name.trim()) {
      newErrors.name = "회사명을 입력해주세요.";
    }

    if (!form.businessNumber.trim()) {
      newErrors.businessNumber = "사업자등록번호를 입력해주세요.";
    }

    if (!form.representative.trim()) {
      newErrors.representative = "대표자명을 입력해주세요.";
    }

    if (!form.address.trim()) {
      newErrors.address = "주소를 입력해주세요.";
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "전화번호를 입력해주세요.";
    }

    if (!form.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    if (!form.establishedDate) {
      newErrors.establishedDate = "설립일을 입력해주세요.";
    }

    if (!form.businessType.trim()) {
      newErrors.businessType = "업태를 입력해주세요.";
    }

    if (!form.businessCategory.trim()) {
      newErrors.businessCategory = "업종을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // TODO: API로 회사 정보 저장
      // await saveCompanyInfo(form);
      navigate("/mypage/biz/company");
    } catch (error) {
      console.error("회사 정보 저장 실패:", error);
      // TODO: 에러 처리
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* 헤더 */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">회사 정보 수정</h1>
                <div className="text-sm text-gray-500 mt-1">
                  <span>마이페이지</span>
                  <span className="mx-2">/</span>
                  <span>회사 정보 수정</span>
                </div>
              </div>
            </div>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* 로고 업로드 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">로고</h2>
              <div className="flex items-center space-x-4">
                <div className="w-40 h-40 border rounded-lg flex items-center justify-center overflow-hidden">
                  {previewLogo ? (
                    <img
                      src={previewLogo}
                      alt="로고 미리보기"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400">로고 이미지</div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleChangeFile}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200"
                  >
                    이미지 업로드
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    권장 크기: 500x500px, 최대 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    회사명 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    사업자등록번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessNumber"
                    value={form.businessNumber}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.businessNumber ? "border-red-500" : ""
                    }`}
                  />
                  {errors.businessNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.businessNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    대표자 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="representative"
                    value={form.representative}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.representative ? "border-red-500" : ""
                    }`}
                  />
                  {errors.representative && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.representative}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    설립일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="establishedDate"
                    value={form.establishedDate}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.establishedDate ? "border-red-500" : ""
                    }`}
                  />
                  {errors.establishedDate && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.establishedDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 사업 정보 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">사업 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    업태 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessType"
                    value={form.businessType}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.businessType ? "border-red-500" : ""
                    }`}
                  />
                  {errors.businessType && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.businessType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    업종 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessCategory"
                    value={form.businessCategory}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.businessCategory ? "border-red-500" : ""
                    }`}
                  />
                  {errors.businessCategory && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.businessCategory}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    직원 수
                  </label>
                  <input
                    type="number"
                    name="employeeCount"
                    value={form.employeeCount}
                    onChange={handleInputChange}
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 연락처 정보 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">연락처 정보</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.address ? "border-red-500" : ""
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    전화번호 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.phoneNumber ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    이메일 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    웹사이트
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={form.website}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="https://"
                  />
                </div>
              </div>
            </div>

            {/* 회사 소개 */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">회사 소개</h2>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                rows={5}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="회사 소개를 입력해주세요."
              />
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/mypage/biz/company")}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "저장 중..." : "저장"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyEditPage;
