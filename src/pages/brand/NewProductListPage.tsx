import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Select } from "@/components/common/FormElements";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  status: "01" | "02" | "03" | "04"; // 01: 판매중, 02: 품절, 03: 판매중지, 04: 신규
  createdAt: string;
  thumbnail?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

const NewProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    // TODO: API로 상품 목록 로드
    // fetchProducts(1);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: API로 검색 요청
    // searchProducts(searchKeyword);
  };

  const handleFilterChange = (type: "category" | "status", value: string) => {
    if (type === "category") {
      setCategoryFilter(value);
    } else {
      setStatusFilter(value);
    }
    // TODO: API로 필터링된 목록 요청
    // fetchProducts(1, { category: categoryFilter, status: statusFilter });
  };

  const handleProductSelect = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProducts(
      e.target.checked ? products.map((product) => product.id) : []
    );
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "01":
        return "판매중";
      case "02":
        return "품절";
      case "03":
        return "판매중지";
      case "04":
        return "신규";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "01":
        return "text-green-600";
      case "02":
        return "text-gray-600";
      case "03":
        return "text-red-600";
      case "04":
        return "text-blue-600";
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
              <h1 className="text-2xl font-bold">신규 상품 목록</h1>
              <div className="text-sm text-gray-500 mt-1">
                <span>상품 관리</span>
                <span className="mx-2">/</span>
                <span>신규 상품 목록</span>
              </div>
            </div>
            <Link
              to="/mypage/biz/prdct/reg"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              상품 등록
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
                  placeholder="상품명 또는 브랜드명으로 검색"
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
                value={categoryFilter}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-40"
              >
                <option value="all">전체 카테고리</option>
                <option value="skincare">스킨케어</option>
                <option value="makeup">메이크업</option>
                <option value="haircare">헤어케어</option>
                <option value="bodycare">바디케어</option>
              </Select>
              <Select
                value={statusFilter}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-40"
              >
                <option value="all">전체 상태</option>
                <option value="01">판매중</option>
                <option value="02">품절</option>
                <option value="03">판매중지</option>
                <option value="04">신규</option>
              </Select> */}
          </div>
        </div>

        {/* 상품 목록 */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      products.length > 0 &&
                      selectedProducts.length === products.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left">상품명</th>
                <th className="px-4 py-3 text-left">브랜드</th>
                <th className="px-4 py-3 text-left">카테고리</th>
                <th className="px-4 py-3 text-right">가격</th>
                <th className="px-4 py-3 text-center">상태</th>
                <th className="px-4 py-3 text-center">등록일</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleProductSelect(product.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {product.thumbnail && (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded mr-3"
                          />
                        )}
                        <Link
                          to={`/mypage/biz/prdct/view/${product.id}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.brand}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3 text-right">
                      {product.price.toLocaleString()}원
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={getStatusColor(product.status)}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.createdAt}
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

        {/* 하단 버튼 */}
        <div className="p-6 border-t">
          <div className="flex justify-between items-center">
            <div>
              <span>
                총 상품 :{" "}
                <span className="text-red-600 font-bold">
                  {pagination.totalItems}
                </span>{" "}
                개
              </span>
            </div>
            <div className="space-x-2">
              {selectedProducts.length > 0 && (
                <>
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    판매 시작
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
                    판매 중지
                  </button>
                </>
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
    </div>
  );
};

export default NewProductListPage;
