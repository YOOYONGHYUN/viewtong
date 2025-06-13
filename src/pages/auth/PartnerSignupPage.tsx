import React, { useState } from "react";
import Layout from "../../components/layout/Layout";

const PartnerSignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    boss_name: "",
    company_number: "",
    certificate: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        certificate: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("파트너 신청 데이터:", formData);
    // API 호출 로직 추가 필요
    alert("파트너 신청이 완료되었습니다.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">SIGNUP</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="회사명"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="text"
              className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="대표자명"
              name="boss_name"
              value={formData.boss_name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="text"
              className="w-full p-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="사업자 등록번호 (- 없이 입력)"
              name="company_number"
              value={formData.company_number}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="certificate"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              사업자 등록증
            </label>
            <input
              type="file"
              id="certificate"
              accept="image/*,.pdf"
              onChange={handleChangeFile}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            파트너 신청
          </button>
        </form>
      </div>
    </div>
  );
};

export default PartnerSignupPage;
