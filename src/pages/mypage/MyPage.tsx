import React, { useState } from "react";

const MyPage = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  // 사용자 정보 (추후 API로 대체)
  const userInfo = {
    email: "user@example.com",
    subscriptionPeriod: "2024-06-20 ~ 2026-06-20",
    businessStatus: "-",
    recentActivities: [],
  };

  // 비즈니스 인증 폼 상태
  const [businessForm, setBusinessForm] = useState({
    business_number: "",
    opening_date: "",
    representative_name: "",
  });

  // 구독 신청 폼 상태
  const [subscriptionForm, setSubscriptionForm] = useState({
    name: "",
    email: "",
  });

  // 폼 입력 변경 핸들러
  const handleBusinessFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessForm({
      ...businessForm,
      [name]: value,
    });
  };

  const handleSubscriptionFormChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setSubscriptionForm({
      ...subscriptionForm,
      [name]: value,
    });
  };

  // 폼 제출 핸들러
  const handleBusinessFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Business verification submitted:", businessForm);
    // 여기에 API 호출 로직 추가
    setShowBusinessModal(false);
  };

  const handleSubscriptionFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscription form submitted:", subscriptionForm);
    // 여기에 API 호출 로직 추가
    setShowSubscriptionModal(false);
  };

  return (
    <div>
      <div className="flex bg-[#f8faff] min-h-screen">
        {/* 사이드바 메뉴 */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4 border-b border-gray-200">
            <div className="mb-4">
              <p className="text-gray-600">안녕하세요!</p>
              <p>
                <span className="text-2xl font-bold text-[#b4dcff]">
                  {userInfo.email.split("@")[0]}
                </span>
                <span className="leading-10">님</span>
              </p>
            </div>
            <div className="text-center mb-4">
              <div className="font-medium text-gray-700">구독기간</div>
              <div className="text-sm">{userInfo.subscriptionPeriod}</div>
            </div>
            <button className="w-full py-2 bg-[#019AEC] text-white rounded mb-2">
              자가진단
            </button>
            <button className="w-full py-2 bg-white text-gray-700 border border-gray-300 rounded mb-2">
              전문가 매칭
            </button>
            <button
              className="w-full py-2 bg-white text-gray-700 border border-gray-300 rounded"
              onClick={() => setShowSubscriptionModal(true)}
            >
              구독
            </button>
          </div>

          <div className="p-4 font-bold bg-gray-100">대시보드</div>

          <ul className="border-b border-dashed border-gray-400">
            <li className="p-3 font-bold border-b border-dashed border-gray-400">
              제안서
            </li>
            <li className="p-3 hover:bg-gray-100 cursor-pointer">
              제안정보 입력
            </li>
            <li className="p-3 hover:bg-gray-100 cursor-pointer">
              제안문서 미리보기
            </li>
            <li className="p-3 hover:bg-gray-100 cursor-pointer">
              제안문서 기획신청
            </li>
          </ul>

          <ul>
            <li className="p-3 font-bold border-y border-dashed border-gray-400">
              사용자 관리
            </li>
            <li className="p-3 hover:bg-gray-100 cursor-pointer">회원정보</li>
            <li className="p-3 hover:bg-gray-100 cursor-pointer">구독권</li>
          </ul>

          <div className="p-4 font-bold">설정</div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-6">대시보드</h1>

          {/* 상태 표시 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
              <div className="grid grid-cols-3 w-full">
                <div className="text-center">
                  <p className="text-gray-600 mb-2">사업자 인증 상태</p>
                  <span id="businessStatus" className="font-medium">
                    {userInfo.businessStatus}
                  </span>
                  <p>
                    <a
                      href="#"
                      className="text-[#019aec]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowBusinessModal(true);
                      }}
                    >
                      [확인]
                    </a>
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-2">자가진단 상태</p>
                  <span className="font-medium">-</span>
                  <p>
                    <a href="#" className="text-[#019aec]">
                      [신청]
                    </a>
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-gray-600 mb-2">구독 상태</p>
                  <span className="font-medium">-</span>
                  <p>
                    <a
                      href="#"
                      className="text-[#019aec]"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowSubscriptionModal(true);
                      }}
                    >
                      [신청]
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#1983DA] p-4 rounded-lg shadow text-white">
              <p className="text-center">
                화장품 사업가를 위한 유통 전문 교육부터 상품 유통 대행까지
                <br />
                어려웠던 유통채널 초기 진입 '뷰통월드'가 함께 하겠습니다.
              </p>
            </div>
          </div>

          {/* 최근 활동 섹션 */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex border-b mb-4">
              <button
                className={`mr-4 pb-2 ${
                  activeTab === "recent"
                    ? "border-b-2 border-blue-500 font-bold"
                    : ""
                }`}
                onClick={() => setActiveTab("recent")}
              >
                최근활동
              </button>
              <button
                className={`pb-2 ${
                  activeTab === "expire"
                    ? "border-b-2 border-blue-500 font-bold"
                    : ""
                }`}
                onClick={() => setActiveTab("expire")}
              >
                만료 예정인 문서
              </button>
            </div>

            <div className="p-4 text-center text-gray-500">
              {activeTab === "recent"
                ? "최근 활동 내역이 없습니다."
                : "만료 예정인 문서가 없습니다."}
            </div>
          </div>

          {/* 전문가 매칭 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">전문가 매칭 신청</h2>
              <div className="text-center p-4 border border-gray-200 rounded mb-3">
                매칭된 전문가가 없습니다
                <br />
                <p className="my-3 font-normal text-gray-400">
                  전문가를 쉽고 빠르게 신청해보세요!
                </p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                전문가 매칭 +
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">전문가 매칭 신청</h2>
              <div className="text-center p-4 border border-gray-200 rounded mb-3">
                매칭된 전문가가 없습니다
                <br />
                <p className="my-3 font-normal text-gray-400">
                  전문가를 쉽고 빠르게 신청해보세요!
                </p>
              </div>
              <div className="text-center p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-50">
                전문가 매칭 +
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 구독 모달 */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">구독 신청</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowSubscriptionModal(false)}
              >
                X
              </button>
            </div>
            <div className="p-4">
              <form
                id="subscriptionForm"
                onSubmit={handleSubscriptionFormSubmit}
              >
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="name"
                  >
                    이름:
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={subscriptionForm.name}
                    onChange={handleSubscriptionFormChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="email"
                  >
                    이메일:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={subscriptionForm.email}
                    onChange={handleSubscriptionFormChange}
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    신청
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 사업자 인증 모달 */}
      {showBusinessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">사업자 인증</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowBusinessModal(false)}
              >
                X
              </button>
            </div>
            <div className="p-4">
              <form id="businessForm" onSubmit={handleBusinessFormSubmit}>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="b_no"
                  >
                    사업자번호:
                  </label>
                  <input
                    type="text"
                    id="b_no"
                    name="business_number"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={businessForm.business_number}
                    onChange={handleBusinessFormChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="start_dt"
                  >
                    설립일:
                  </label>
                  <input
                    type="text"
                    id="start_dt"
                    name="opening_date"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="YYYY-MM-DD"
                    value={businessForm.opening_date}
                    onChange={handleBusinessFormChange}
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="p_nm"
                  >
                    대표자명:
                  </label>
                  <input
                    type="text"
                    id="p_nm"
                    name="representative_name"
                    required
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={businessForm.representative_name}
                    onChange={handleBusinessFormChange}
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    확인
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
