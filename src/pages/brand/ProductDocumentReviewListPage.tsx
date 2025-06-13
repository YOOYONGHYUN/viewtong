import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Select } from "@/components/common/FormElements";

interface Review {
  id: string;
  productName: string;
  channelName: string;
  rating: number;
  content: string;
  createdAt: string;
  status: "01" | "02" | "03"; // 01: 공개, 02: 비공개, 03: 삭제
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ProductDocumentReviewListPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    // TODO: API로 리뷰 목록 로드
    // fetchReviews(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API로 검색 요청
    // searchReviews(searchKeyword);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
    // TODO: API로 필터링된 목록 요청
    // fetchReviews(1, e.target.value);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "01":
        return "공개";
      case "02":
        return "비공개";
      case "03":
        return "삭제";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "01":
        return "text-green-600";
      case "02":
        return "text-yellow-600";
      case "03":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg">
        {/* 헤더 */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">제품 문서 리뷰 목록</h1>
              <div className="text-sm text-gray-500 mt-1">
                <span>제품 문서</span>
                <span className="mx-2">/</span>
                <span>리뷰 목록</span>
              </div>
            </div>
            <Link
              to="/mypage/biz/prdoc/review/reg"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              리뷰 작성
            </Link>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="p-6 border-b">
          <div className="flex flex-wrap gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="제품명 또는 채널명으로 검색"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </form>
            {/* <Select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="w-40"
              >
                <option value="all">전체 상태</option>
                <option value="01">공개</option>
                <option value="02">비공개</option>
                <option value="03">삭제</option>
              </Select> */}
          </div>
        </div>

        {/* 리뷰 목록 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">제품명</th>
                <th className="px-4 py-3 text-left">채널명</th>
                <th className="px-4 py-3 text-center">평점</th>
                <th className="px-4 py-3 text-center">상태</th>
                <th className="px-4 py-3 text-center">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        to={`/mypage/biz/prdoc/review/view/${review.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {review.productName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{review.channelName}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          {review.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={getStatusColor(review.status)}>
                        {getStatusText(review.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {review.createdAt}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    등록된 리뷰가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 하단 정보 */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center">
            <div>
              <span>
                총 리뷰 :{" "}
                <span className="text-red-600 font-bold">
                  {pagination.totalItems}
                </span>{" "}
                건
              </span>
            </div>
          </div>
        </div>

        {/* 페이지네이션 */}
        {pagination.totalItems > 0 && (
          <div className="flex justify-center py-4">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => {
                  /* TODO: 첫 페이지로 이동 */
                }}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasPrevious}
              >
                {"<<"}
              </button>
              <button
                onClick={() => {
                  /* TODO: 이전 페이지로 이동 */
                }}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasPrevious}
              >
                {"<"}
              </button>
              {/* TODO: 페이지 번호 버튼들 구현 */}
              <button
                onClick={() => {
                  /* TODO: 다음 페이지로 이동 */
                }}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasNext}
              >
                {">"}
              </button>
              <button
                onClick={() => {
                  /* TODO: 마지막 페이지로 이동 */
                }}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasNext}
              >
                {">>"}
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDocumentReviewListPage;
