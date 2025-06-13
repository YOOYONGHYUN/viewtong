import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
// import { formatDate } from "@/utils/formatters";

interface SubscriptionInfo {
  id: string;
  type: "01" | "02"; // 01: 월간구독, 02: 연간구독
  userType: "01" | "02"; // 01: BASIC, 02: MASTER
  startDate: string;
  endDate: string;
  amount: number;
  status: "01" | "02" | "03"; // 01: 대기, 02: 정상, 03: 만료
  autoRenewal: boolean;
  paymentMethod: string;
  nextPaymentDate?: string;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: "success" | "failed" | "pending";
}

const SubscriptionInfoPage: React.FC = () => {
  const [subscriptionInfo, setSubscriptionInfo] =
    useState<SubscriptionInfo | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);

  useEffect(() => {
    // TODO: API로 구독 정보 및 결제 내역 로드
    // fetchSubscriptionInfo();
    // fetchPaymentHistory();
  }, []);

  const getSubscriptionTypeText = (type: string) => {
    switch (type) {
      case "01":
        return "월간구독";
      case "02":
        return "연간구독";
      default:
        return "알 수 없음";
    }
  };

  const getUserTypeText = (type: string) => {
    switch (type) {
      case "01":
        return "BASIC";
      case "02":
        return "MASTER";
      default:
        return "알 수 없음";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "01":
        return "대기";
      case "02":
        return "정상";
      case "03":
        return "만료";
      default:
        return "알 수 없음";
    }
  };

  const handleCancelSubscription = () => {
    // TODO: API로 구독 취소 요청
    setShowCancelModal(false);
  };

  const handleChangeSubscription = () => {
    // TODO: API로 구독 변경 요청
    setShowChangeModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* 헤더 */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">구독 정보</h1>
              <div className="text-sm text-gray-500 mt-1">
                <span>구독/결제</span>
                <span className="mx-2">/</span>
                <span>구독 정보</span>
              </div>
            </div>
          </div>
        </div>

        {/* 구독 정보 */}
        <div className="p-6">
          {subscriptionInfo ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-bold mb-4">현재 구독 정보</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">구독 유형</p>
                      <p className="font-medium">
                        {getSubscriptionTypeText(subscriptionInfo.type)} /{" "}
                        {getUserTypeText(subscriptionInfo.userType)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">구독 기간</p>
                      <p className="font-medium">
                        {subscriptionInfo.startDate} ~{" "}
                        {subscriptionInfo.endDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">구독 상태</p>
                      <p className="font-medium">
                        {getStatusText(subscriptionInfo.status)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">결제 금액</p>
                      <p className="font-medium">
                        {subscriptionInfo.amount.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-lg font-bold mb-4">결제 정보</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600">자동 갱신</p>
                      <p className="font-medium">
                        {subscriptionInfo.autoRenewal ? "설정" : "해제"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">결제 수단</p>
                      <p className="font-medium">
                        {subscriptionInfo.paymentMethod}
                      </p>
                    </div>
                    {subscriptionInfo.nextPaymentDate && (
                      <div>
                        <p className="text-gray-600">다음 결제일</p>
                        <p className="font-medium">
                          {subscriptionInfo.nextPaymentDate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setShowChangeModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  구독 변경
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  구독 해지
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              구독 정보가 없습니다.
            </div>
          )}
        </div>

        {/* 결제 내역 */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-bold mb-4">결제 내역</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">결제일</th>
                  <th className="px-4 py-3 text-right">결제금액</th>
                  <th className="px-4 py-3 text-center">결제수단</th>
                  <th className="px-4 py-3 text-center">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{payment.date}</td>
                      <td className="px-4 py-3 text-right">
                        {payment.amount.toLocaleString()}원
                      </td>
                      <td className="px-4 py-3 text-center">
                        {payment.method}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            payment.status === "success"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.status === "success"
                            ? "완료"
                            : payment.status === "failed"
                            ? "실패"
                            : "대기"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      결제 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 구독 취소 모달 */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">구독 해지</h3>
            <p className="text-gray-600 mb-4">
              정말로 구독을 해지하시겠습니까? 해지 시 서비스 이용이 제한됩니다.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                해지하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 구독 변경 모달 */}
      {showChangeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">구독 변경</h3>
            {/* TODO: 구독 변경 폼 구현 */}
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowChangeModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={handleChangeSubscription}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                변경하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionInfoPage;
