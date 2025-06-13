import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

interface Proposal {
  id: string;
  channelName: string;
  proposalType: "01" | "02" | "03"; // 01: 입점제안, 02: 상품제안, 03: 기타
  description: string;
  status: "01" | "02" | "03" | "04"; // 01: 검토중, 02: 승인, 03: 반려, 04: 보류
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
  attachments: {
    id: string;
    fileName: string;
    fileUrl: string;
  }[];
}

const ChannelProposalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API로 제안 데이터 로드
    // fetchProposal(id);
    setIsLoading(false);
  }, [id]);

  const getProposalTypeText = (type: string) => {
    switch (type) {
      case "01":
        return "입점제안";
      case "02":
        return "상품제안";
      case "03":
        return "기타";
      default:
        return "알 수 없음";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "01":
        return "검토중";
      case "02":
        return "승인";
      case "03":
        return "반려";
      case "04":
        return "보류";
      default:
        return "알 수 없음";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "01":
        return "text-yellow-600";
      case "02":
        return "text-green-600";
      case "03":
        return "text-red-600";
      case "04":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            제안을 찾을 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">
            요청하신 제안이 존재하지 않거나 삭제되었을 수 있습니다.
          </p>
          <Link
            to="/mypage/biz/channel/proposal/status"
            className="text-blue-600 hover:text-blue-800"
          >
            제안 목록으로 돌아가기
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
                <h1 className="text-2xl font-bold">{proposal.channelName}</h1>
                <div className="text-sm text-gray-500 mt-1">
                  <span>채널 제안</span>
                  <span className="mx-2">/</span>
                  <span>제안 상세</span>
                </div>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                    proposal.status
                  )}`}
                >
                  {getStatusText(proposal.status)}
                </span>
              </div>
            </div>
          </div>

          {/* 제안 내용 */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-4">기본 정보</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600">제안 유형</p>
                    <p className="font-medium">
                      {getProposalTypeText(proposal.proposalType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">등록일</p>
                    <p className="font-medium">{proposal.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">수정일</p>
                    <p className="font-medium">{proposal.updatedAt}</p>
                  </div>
                </div>
              </div>

              {proposal.status === "03" && proposal.rejectionReason && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">반려 사유</h2>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-700 whitespace-pre-wrap">
                      {proposal.rejectionReason}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">제안 내용</h2>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {proposal.description}
                </p>
              </div>
            </div>

            {/* 첨부 파일 */}
            {proposal.attachments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">첨부 파일</h2>
                <ul className="space-y-2">
                  {proposal.attachments.map((file) => (
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

          {/* 하단 버튼 */}
          <div className="p-6 border-t">
            <div className="flex justify-end space-x-3">
              <Link
                to="/mypage/biz/channel/proposal/status"
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
              >
                목록으로
              </Link>
              {proposal.status === "01" && (
                <Link
                  to={`/mypage/biz/channel/proposal/edit/${proposal.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  수정하기
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelProposalDetailPage;
