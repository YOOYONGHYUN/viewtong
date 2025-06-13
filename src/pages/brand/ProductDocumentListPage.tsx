import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Select } from "@/components/common/FormElements";

interface ProductDocument {
  id: string;
  title: string;
  channelName: string;
  status: "01" | "02" | "03" | "04"; // 01: 임시저장, 02: 검토중, 03: 승인, 04: 반려
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ProductDocumentListPage: React.FC = () => {
  const [documents, setDocuments] = useState<ProductDocument[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    // TODO: API로 문서 목록 로드
    // fetchDocuments(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API로 검색 요청
    // searchDocuments(searchKeyword);
  };

  const handleStatusFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatusFilter(e.target.value);
    // TODO: API로 필터링된 목록 요청
    // fetchDocuments(1, e.target.value);
  };

  const handleDocumentSelect = (id: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDocuments(
      e.target.checked ? documents.map((doc) => doc.id) : []
    );
  };

  const handleDeleteSelected = () => {
    if (window.confirm("선택한 문서를 삭제하시겠습니까?")) {
      // TODO: API로 선택된 문서 삭제 요청
      // deleteDocuments(selectedDocuments);
    }
  };

  const handleShowRejectionReason = (reason: string) => {
    setRejectionReason(reason);
    setShowRejectionModal(true);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "01":
        return "임시저장";
      case "02":
        return "검토중";
      case "03":
        return "승인";
      case "04":
        return "반려";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "01":
        return "text-gray-600";
      case "02":
        return "text-yellow-600";
      case "03":
        return "text-green-600";
      case "04":
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
              <h1 className="text-2xl font-bold">제안문서 목록</h1>
              <div className="text-sm text-gray-500 mt-1">
                <span>제안문서 관리</span>
                <span className="mx-2">/</span>
                <span>제안문서 목록</span>
              </div>
            </div>
            <Link
              to="/mypage/biz/prdoc/reg"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              문서 등록
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
                  placeholder="제목 또는 채널명으로 검색"
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
                <option value="all">전체</option>
                <option value="01">임시저장</option>
                <option value="02">검토중</option>
                <option value="03">승인</option>
                <option value="04">반려</option>
              </Select> */}
          </div>
        </div>

        {/* 문서 목록 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      documents.length > 0 &&
                      selectedDocuments.length === documents.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left">제목</th>
                <th className="px-4 py-3 text-left">채널명</th>
                <th className="px-4 py-3 text-center">상태</th>
                <th className="px-4 py-3 text-center">등록일</th>
                <th className="px-4 py-3 text-center">수정일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(doc.id)}
                        onChange={() => handleDocumentSelect(doc.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/mypage/biz/prdoc/view/${doc.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {doc.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{doc.channelName}</td>
                    <td className="px-4 py-3 text-center">
                      {doc.status === "04" ? (
                        <button
                          onClick={() =>
                            handleShowRejectionReason(doc.rejectionReason || "")
                          }
                          className={getStatusColor(doc.status)}
                        >
                          {getStatusText(doc.status)}
                        </button>
                      ) : (
                        <span className={getStatusColor(doc.status)}>
                          {getStatusText(doc.status)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">{doc.createdAt}</td>
                    <td className="px-4 py-3 text-center">{doc.updatedAt}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    등록된 문서가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
            <div>
              {selectedDocuments.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  선택 삭제
                </button>
              )}
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

      {/* 반려 사유 모달 */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-lg font-bold mb-4">반려 사유</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {rejectionReason}
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDocumentListPage;
