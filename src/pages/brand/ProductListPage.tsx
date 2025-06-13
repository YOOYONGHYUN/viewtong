import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Select } from "@/components/common/FormElements";

interface Product {
  prdct_id: string;
  cd_nm: string;
  brand_nm: string;
  prdct_nm: string;
  prdct_amt: string;
  reg_dt: string;
  prdct_stts_cd: string;
  rjct_rsn_cn?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });
  const [categories, setCategories] = useState<any>({
    level1: [],
    level2: [],
    level3: [],
    level4: [],
  });
  const [searchType, setSearchType] = useState<"00" | "01">("00");
  const [searchText, setSearchText] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    // TODO: API로 카테고리 데이터 로드
    // fetchCategories();
    // TODO: API로 제품 목록 데이터 로드
    // fetchProducts(1);
  }, []);

  const handleSearch = (page: number = 1) => {
    // TODO: API 호출하여 검색 결과 로드
    console.log("Search:", { searchType, searchText, page });
  };

  const handleCategoryChange = (level: number, value: string) => {
    // TODO: 카테고리 변경 처리
    console.log("Category changed:", { level, value });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProducts(products.map((p) => p.prdct_id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleShowRejectionReason = (productId: string, reason: string) => {
    setRejectionReason(reason);
    setShowRejectionModal(true);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "02":
        return "승인";
      case "03":
        return "반려";
      default:
        return "미승인";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow">
        {/* 헤더 */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">상품리스트</h1>
            <div className="flex items-center space-x-2">
              <Link to="/mypage/biz">상품관리</Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-700">상품리스트</span>
            </div>
          </div>
        </div>

        {/* 검색 필터 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 카테고리 선택 */}
            <div className="flex items-center space-x-4">
              <span className="whitespace-nowrap">카테고리</span>
              {/* <div className="grid grid-cols-4 gap-4 flex-1">
                  <Select
                    options={categories.level1}
                    onChange={(e) => handleCategoryChange(1, e.target.value)}
                    placeholder="1차분류"
                  />
                  <Select
                    options={categories.level2}
                    onChange={(e) => handleCategoryChange(2, e.target.value)}
                    placeholder="2차분류"
                  />
                  <Select
                    options={categories.level3}
                    onChange={(e) => handleCategoryChange(3, e.target.value)}
                    placeholder="3차분류"
                  />
                  <Select
                    options={categories.level4}
                    onChange={(e) => handleCategoryChange(4, e.target.value)}
                    placeholder="4차분류"
                  />
                </div> */}
            </div>

            {/* 검색 */}
            <div className="flex items-center space-x-4">
              <select
                className="form-select"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value as "00" | "01")}
              >
                <option value="00">상품명</option>
                <option value="01">브랜드명</option>
              </select>
              <input
                type="text"
                className="form-input flex-1"
                placeholder="검색어 입력"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleSearch()}
              >
                검색
              </button>
              <div className="flex space-x-2">
                <button
                  className={`p-2 rounded ${
                    viewMode === "grid" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  className={`p-2 rounded ${
                    viewMode === "list" ? "bg-blue-100" : "bg-gray-100"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 제품 목록 */}
        {viewMode === "list" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === products.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-4 py-3 text-left">카테고리</th>
                  <th className="px-4 py-3 text-left">브랜드명</th>
                  <th className="px-4 py-3 text-left">상품명</th>
                  <th className="px-4 py-3">가격</th>
                  <th className="px-4 py-3">등록일</th>
                  <th className="px-4 py-3">승인여부</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.prdct_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.prdct_id)}
                          onChange={() => handleProductSelect(product.prdct_id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-4 py-3 truncate">{product.cd_nm}</td>
                      <td className="px-4 py-3 truncate">{product.brand_nm}</td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/mypage/biz/prdct/view/${product.prdct_id}`}
                          className="text-blue-600 hover:text-blue-800 truncate block"
                        >
                          {product.prdct_nm}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {product.prdct_amt}원
                      </td>
                      <td className="px-4 py-3 text-center">
                        {product.reg_dt}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {product.prdct_stts_cd === "03" ? (
                          <button
                            onClick={() =>
                              handleShowRejectionReason(
                                product.prdct_id,
                                product.rjct_rsn_cn || ""
                              )
                            }
                            className="text-red-600 hover:text-red-800"
                          >
                            반려
                          </button>
                        ) : (
                          getStatusText(product.prdct_stts_cd)
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      등록된 상품이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {products.map((product) => (
              <div
                key={product.prdct_id}
                className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link to={`/mypage/biz/prdct/view/${product.prdct_id}`}>
                  <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                    {/* TODO: 제품 이미지 추가 */}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500">{product.cd_nm}</p>
                    <h3 className="font-medium">{product.brand_nm}</h3>
                    <p className="text-lg font-bold mt-1">{product.prdct_nm}</p>
                    <p className="text-blue-600 mt-2">{product.prdct_amt}원</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-gray-500">
                        {product.reg_dt}
                      </span>
                      <span
                        className={`text-sm ${
                          product.prdct_stts_cd === "02"
                            ? "text-green-600"
                            : product.prdct_stts_cd === "03"
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {getStatusText(product.prdct_stts_cd)}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* 페이지네이션 */}
        {products.length > 0 && (
          <div className="flex justify-center py-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handleSearch(1)}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasPrevious}
              >
                {"<<"}
              </button>
              <button
                onClick={() => handleSearch(pagination.currentPage - 1)}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasPrevious}
              >
                {"<"}
              </button>
              {/* TODO: 페이지 번호 버튼들 구현 */}
              <button
                onClick={() => handleSearch(pagination.currentPage + 1)}
                className="px-3 py-1 rounded border hover:bg-gray-100"
                disabled={!pagination.hasNext}
              >
                {">"}
              </button>
              <button
                onClick={() => handleSearch(pagination.totalPages)}
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
            <p className="text-gray-700 whitespace-pre-line">
              {rejectionReason}
            </p>
            <div className="mt-6 flex justify-end">
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

export default ProductListPage;
