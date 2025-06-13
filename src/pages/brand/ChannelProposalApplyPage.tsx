import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Select } from "@/components/common/FormElements";
// import { Textarea } from "@/components/ui/textarea";

interface ProposalForm {
  channelName: string;
  proposalType: "01" | "02" | "03"; // 01: 입점제안, 02: 상품제안, 03: 기타
  description: string;
  attachments: File[];
}

const ChannelProposalApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProposalForm>({
    channelName: "",
    proposalType: "01",
    description: "",
    attachments: [],
  });
  const [errors, setErrors] = useState<Partial<ProposalForm>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<ProposalForm> = {};

    if (!form.channelName.trim()) {
      newErrors.channelName = "채널명을 입력해주세요.";
    }

    if (!form.description.trim()) {
      newErrors.description = "제안 내용을 입력해주세요.";
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
      // TODO: API로 제안서 제출
      // const response = await submitProposal(form);
      // if (response.success) {
      //   navigate("/mypage/biz/channel/proposal/status");
      // }

      // 임시로 성공 처리
      navigate("/mypage/biz/channel/proposal/status");
    } catch (error) {
      console.error("제안서 제출 중 오류가 발생했습니다:", error);
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
      navigate("/mypage/biz/channel/proposal/status");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          {/* 헤더 */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold">채널 제안하기</h1>
            <div className="text-sm text-gray-500 mt-1">
              <span>채널 제안</span>
              <span className="mx-2">/</span>
              <span>제안하기</span>
            </div>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* 채널명 */}
              <div>
                <label
                  htmlFor="channelName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  채널명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="channelName"
                  value={form.channelName}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      channelName: e.target.value,
                    }))
                  }
                  className={`w-full p-2 border rounded ${
                    errors.channelName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="채널명을 입력해주세요"
                />
                {errors.channelName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.channelName}
                  </p>
                )}
              </div>

              {/* 제안 유형 */}
              <div>
                <label
                  htmlFor="proposalType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  제안 유형 <span className="text-red-500">*</span>
                </label>
                {/* <Select
                    id="proposalType"
                    value={form.proposalType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        proposalType: e.target
                          .value as ProposalForm["proposalType"],
                      }))
                    }
                    className="w-full"
                  >
                    <option value="01">입점제안</option>
                    <option value="02">상품제안</option>
                    <option value="03">기타</option>
                  </Select> */}
              </div>

              {/* 제안 내용 */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  제안 내용 <span className="text-red-500">*</span>
                </label>
                {/* <TextArea
                    id="description"
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={`w-full h-40 p-2 border rounded resize-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="제안 내용을 상세히 입력해주세요"
                  /> */}
                {errors.description && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.description}
                  </p>
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
                      PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG, GIF (최대
                      10MB)
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
                {isSubmitting ? "제출 중..." : "제출하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChannelProposalApplyPage;
