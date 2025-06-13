import React, { useState } from "react";

interface ChangePasswordFormProps {
  onSubmit: (
    email: string,
    verificationCode: string,
    newPassword: string
  ) => void;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
}) => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 이메일 인증 코드 발송 (실제로는 API 호출로 구현)
  const sendVerificationCode = () => {
    if (!email) {
      setErrors({ ...errors, email: "이메일을 입력해주세요." });
      return;
    }

    // 이메일 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ ...errors, email: "유효한 이메일 주소를 입력해주세요." });
      return;
    }

    // 실제 구현에서는 API 호출
    alert("인증 코드가 이메일로 발송되었습니다.");
  };

  // 이메일 인증 확인 (실제로는 API 호출로 구현)
  const verifyCode = () => {
    if (!verificationCode) {
      setErrors({ ...errors, verificationCode: "인증 코드를 입력해주세요." });
      return;
    }

    // 실제 구현에서는 API 호출
    setIsEmailVerified(true);
    setErrors({ ...errors, verificationCode: "" });
    alert("이메일이 인증되었습니다.");
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    const formErrors: { [key: string]: string } = {};

    if (!email) formErrors.email = "이메일을 입력해주세요.";
    if (!isEmailVerified)
      formErrors.verificationCode = "이메일 인증이 필요합니다.";
    if (!newPassword) formErrors.newPassword = "새 비밀번호를 입력해주세요.";
    if (newPassword !== confirmPassword)
      formErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // 제출
    onSubmit(email, verificationCode, newPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-[900px]">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="px-8 py-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                비밀번호 찾기
              </h2>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                이메일
              </label>
              <div className="flex">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isEmailVerified}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이메일 입력"
                />
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  disabled={isEmailVerified}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-r-md transition-colors disabled:opacity-50"
                >
                  인증
                </button>
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="verificationCode"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                인증번호
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  disabled={isEmailVerified}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="인증번호 입력"
                />
                <button
                  type="button"
                  onClick={verifyCode}
                  disabled={isEmailVerified}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-r-md transition-colors disabled:opacity-50"
                >
                  인증확인
                </button>
              </div>
              {errors.verificationCode && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.verificationCode}
                </p>
              )}
              {isEmailVerified && (
                <p className="text-green-500 text-xs mt-1">인증되었습니다.</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                새 비밀번호
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="새 비밀번호 입력"
              />
              {errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                새 비밀번호 확인
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="새 비밀번호 확인"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;
