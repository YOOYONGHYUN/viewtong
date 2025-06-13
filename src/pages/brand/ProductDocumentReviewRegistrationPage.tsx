import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

interface ReviewForm {
  productId: string;
  rating: number;
  content: string;
  attachments: File[];
}

const ProductDocumentReviewRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ReviewForm>({
    productId: "",
    rating: 5,
    content: "",
    attachments: [],
  });
  const [errors, setErrors] = useState<Partial<ReviewForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<ReviewForm> = {};

    if (!form.productId) {
      newErrors.productId = "제품을 선택해주세요.";
    }

    if (!form.content.trim()) {
      newErrors.content = "리뷰 내용을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: API로 리뷰 제출
      // const response = await submitReview(form);
      // if (response.success) {
      //   navigate("/mypage/biz/prdoc/review/list");
      // }

      // 임시로 성공 처리
      navigate("/mypage/biz/prdoc/review/list");
    } catch (error) {
      console.error("리뷰 등록 중 오류가 발생했습니다:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setForm((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleCancel = () => {
    if (
      window.confirm("작성 중인 내용이 저장되지 않습니다. 취소하시겠습니까?")
    ) {
      navigate("/mypage/biz/prdoc/review/list");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* 헤더 */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">제품 문서 리뷰 작성</h1>
            <div className="text-sm text-gray-500 mt-1">
              <span>제품 문서</span>
              <span className="mx-2">/</span>
              <span>리뷰 작성</span>
            </div>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* 제품 선택 */}
              <div>
                <label
                  htmlFor="productId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  제품 선택 <span className="text-red-500">*</span>
                </label>
                <select
                  id="productId"
                  value={form.productId}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      productId: e.target.value,
                    }))
                  }
                  className={`w-full p-2 border rounded ${
                    errors.productId ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">제품을 선택해주세요</option>
                  {/* TODO: API로 제품 목록 로드 */}
                </select>
                {errors.productId && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.productId}
                  </p>
                )}
              </div>

              {/* 평점 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  평점
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, rating }))}
                      className="p-1"
                    >
                      <svg
                        className={`w-8 h-8 ${
                          rating <= form.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {form.rating}/5
                  </span>
                </div>
              </div>

              {/* 리뷰 내용 */}
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  리뷰 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="content"
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className={`w-full h-40 p-2 border rounded resize-none ${
                    errors.content ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="리뷰 내용을 입력해주세요"
                ></textarea>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content}</p>
                )}
              </div>

              {/* 첨부 파일 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  첨부 파일
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>파일 선택</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleChangeFile}
                        />
                      </label>
                      <p className="pl-1">또는 여기로 파일을 끌어오세요</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, GIF (최대 10MB)
                    </p>
                  </div>
                </div>
                {form.attachments.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {form.attachments.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                      >
                        <span className="text-sm text-gray-700">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-white rounded ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDocumentReviewRegistrationPage;
