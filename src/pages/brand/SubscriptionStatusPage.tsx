import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
// import { formatDate } from "@/utils/formatters";

interface Subscription {
  id: string;
  startDate: string;
  endDate: string;
  status: "02" | "03" | "04" | string;
  cancelDate?: string;
  cancelReason?: string;
  registrationDate: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const SubscriptionStatusPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState<"normal" | "recur">(
    "normal"
  );

  useEffect(() => {
    // TODO: API로 구독 데이터 로드
    // fetchSubscriptions(1);
  }, []);

  const handlePageChange = (page: number) => {
    // TODO: API로 해당 페이지 데이터 로드
    // fetchSubscriptions(page);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "02":
        return "정상";
      case "03":
        return "취소";
      case "04":
        return "만료";
      default:
        return "문의필요";
    }
  };

  const handleSubscriptionCancel = () => {
    if (window.confirm("정기 구독을 취소하시겠습니까?")) {
      // TODO: API로 구독 취소 요청
      // cancelSubscription();
    }
  };

  const handlePaymentModal = (type: "normal" | "recur") => {
    setSubscriptionType(type);
    setShowPaymentModal(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* 헤더 */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">구독상태</h1>
              <div className="text-sm text-gray-500 mt-1">
                <span>브랜드사</span>
                <span className="mx-2">/</span>
                <span>구독상태</span>
              </div>
            </div>
          </div>
        </div>

        {/* 구독 목록 */}
        <div className="overflow-x-auto p-6">
          <table className="w-full">
            <colgroup>
              <col className="w-[5%]" />
              <col />
              <col className="w-[15%]" />
              <col className="w-[15%]" />
              <col className="w-[20%]" />
              <col className="w-[15%]" />
            </colgroup>
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">번호</th>
                <th className="px-4 py-3 text-left">구독기간</th>
                <th className="px-4 py-3 text-center">상태</th>
                <th className="px-4 py-3 text-center">취소일자</th>
                <th className="px-4 py-3 text-center">취소사유</th>
                <th className="px-4 py-3 text-center">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {subscriptions.length > 0 ? (
                subscriptions.map((subscription, index) => (
                  <tr key={subscription.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      {subscription.startDate} ~ {subscription.endDate}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {getStatusText(subscription.status)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {subscription.cancelDate || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {subscription.cancelReason || "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {subscription.registrationDate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    구독내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        {pagination.totalItems > 0 && (
          <div className="flex justify-center py-4">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasPrevious}
              >
                {"<<"}
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasPrevious}
              >
                {"<"}
              </button>
              {/* TODO: 페이지 번호 버튼들 구현 */}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasNext}
              >
                {">"}
              </button>
              <button
                onClick={() => handlePageChange(pagination.totalPages)}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasNext}
              >
                {">>"}
              </button>
            </nav>
          </div>
        )}

        {/* 하단 버튼 */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center">
            <div>
              <span>
                총 게시물 :{" "}
                <span className="text-red-600 font-bold">
                  {pagination.totalItems}
                </span>{" "}
                건
              </span>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handlePaymentModal("recur")}
                className="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
              >
                정기구독신청
              </button>
              <button
                onClick={handleSubscriptionCancel}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                정기구독취소
              </button>
              <button
                onClick={() => handlePaymentModal("normal")}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                구독신청
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 결제 모달 */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">
              {subscriptionType === "recur" ? "정기구독 신청" : "구독 신청"}
            </h3>
            {/* TODO: 결제 모달 내용 구현 */}
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatusPage;
