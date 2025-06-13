import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import ChangePasswordForm from "../../components/user/ChangePasswordForm";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleChangePassword = (
    email: string,
    verificationCode: string,
    newPassword: string
  ) => {
    // 실제 구현에서는 API 호출을 통해 비밀번호 변경 처리
    console.log("비밀번호 변경 시도:", {
      email,
      verificationCode,
      newPassword,
    });

    // 예시 로직 (실제로는 API 호출 및 응답 처리로 대체)
    alert("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
    navigate("/signin");
  };

  return <ChangePasswordForm onSubmit={handleChangePassword} />;
};

export default ChangePasswordPage;
