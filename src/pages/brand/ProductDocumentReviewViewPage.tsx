import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

interface Review {
  id: string;
  productName: string;
  channelName: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  status: "01" | "02" | "03"; // 01: 공개, 02: 비공개, 03: 삭제
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
  replies: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

const ProductDocumentReviewViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    // TODO: API로 리뷰 데이터 로드
    // fetchReview(id);
    setIsLoading(false);
  }, [id]);

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!replyContent.trim()) {
      return;
    }

    try {
      // TODO: API로 답글 제출
      // await submitReply(id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    } catch (error) {
      console.error("답글 작성 중 오류가 발생했습니다:", error);
    }
  };

  const handleStatusChange = async (status: Review["status"]) => {
    if (!review) return;

    try {
      // TODO: API로 상태 변경
      // await updateReviewStatus(id, status);
    } catch (error) {
      console.error("상태 변경 중 오류가 발생했습니다:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            리뷰를 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">
            요청하신 리뷰가 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <Link
            to="/mypage/biz/prdoc/review/list"
            className="text-blue-600 hover:text-blue-800"
          >
            리뷰 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* 헤더 */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold">{review.productName}</h1>
                <div className="text-sm text-gray-500 mt-1">
                  <span>제품 문서</span>
                  <span className="mx-2">/</span>
                  <span>리뷰 상세</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleStatusChange("01")}
                  className={`px-4 py-2 rounded ${
                    review.status === "01"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  공개
                </button>
                <button
                  onClick={() => handleStatusChange("02")}
                  className={`px-4 py-2 rounded ${
                    review.status === "02"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  비공개
                </button>
                <button
                  onClick={() => handleStatusChange("03")}
                  className={`px-4 py-2 rounded ${
                    review.status === "03"
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>

          {/* 리뷰 내용 */}
          <div className="p-6 border-b">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {review.channelName}
                  </h2>
                  <div className="flex items-center mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-5 h-5 ${
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
                    <span className="ml-2 text-sm text-gray-600">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  <div>작성일: {review.createdAt}</div>
                  <div>수정일: {review.updatedAt}</div>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {review.content}
              </p>
            </div>

            {/* 첨부 파일 */}
            {review.attachments.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">첨부 파일</h3>
                <ul className="space-y-2">
                  {review.attachments.map((file) => (
                    <li
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        {file.fileName}
                      </span>
                      <a
                        href={file.fileUrl}
                        download
                        className="text-blue-600 hover:text-blue-800"
                      >
                        다운로드
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 답글 목록 */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                답글 ({review.replies.length})
              </h3>
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showReplyForm ? "취소" : "답글 작성"}
              </button>
            </div>

            {/* 답글 작성 폼 */}
            {showReplyForm && (
              <form onSubmit={handleReplySubmit} className="mb-6">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="답글을 입력해주세요"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    disabled={!replyContent.trim()}
                  >
                    답글 등록
                  </button>
                </div>
              </form>
            )}

            {/* 답글 목록 */}
            {review.replies.length > 0 ? (
              <div className="space-y-4">
                {review.replies.map((reply) => (
                  <div key={reply.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                      <div className="text-sm text-gray-500">
                        {reply.createdAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">
                등록된 답글이 없습니다.
              </p>
            )}
          </div>

          {/* 하단 버튼 */}
          <div className="p-6 border-t">
            <div className="flex justify-end space-x-3">
              <Link
                to="/mypage/biz/prdoc/review/list"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                목록으로
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDocumentReviewViewPage;
