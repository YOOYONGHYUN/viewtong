import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SelectUserType from "@/components/user/SelectUserType";
import SignUpForm, { SignUpFormData } from "@/components/user/SignUpForm";
import {
  authControllerSignUp,
  authControllerSignUpWithCompany,
} from "@/queries";
import { SignUpAuthDtoRole, UserCompanySignUpAuthDto } from "@/queries/model";
import toast from "react-hot-toast";

const userType = {
  BUSINESS: "02",
  MD: "01",
  ADMIN: "09",
} as const;

export type UserType = (typeof userType)[keyof typeof userType];

const SignUpPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const handleSignUp = async (userData: SignUpFormData) => {
    // 실제 구현에서는 API 호출을 통해 회원가입 처리
    const userCompanySignUpAuthDto: UserCompanySignUpAuthDto = {
      user: {
        email: userData.email,
        password: userData.password,
        role: userType as SignUpAuthDtoRole,
      },
      company: {
        companyName: userData.company.name,
        bossName: userData.company.representativeName,
        companyNumber: userData.company.number,
        brCertFilePathVl: userData.company.certificate
          ? userData.company.certificate
          : undefined,
        picEmail: userData.pic.email,
        picFlNm: userData.pic.lastName,
        picNm: userData.pic.firstName,
        picTelno: userData.pic.phone,
      },
    };

    try {
      await authControllerSignUpWithCompany(userCompanySignUpAuthDto);
      toast.success("회원가입이 완료되었습니다.");
    } catch (error) {
      toast.error("회원가입에 실패했습니다.");
      return;
    }
  };

  const handleUserTypeChange = (userType: UserType) => {
    setUserType(userType);
  };

  return (
    <div className="bg-gray-100">
      {!userType ? (
        <SelectUserType onUserTypeChange={handleUserTypeChange} />
      ) : (
        <SignUpForm onSubmit={handleSignUp} userType={userType} />
      )}
    </div>
  );
};

export default SignUpPage;
