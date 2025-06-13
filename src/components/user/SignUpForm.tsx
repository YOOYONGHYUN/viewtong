import {
  companiesControllerVerifyBusiness,
  emailVerificationControllerSendVerificationEmail,
  emailVerificationControllerVerifyCode,
  mediaFileControllerInitializeUpload,
} from "@/queries";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserType } from "@/pages/auth/SignUpPage";
import { Dialog, Modal } from "@mui/material";
import TermsOfUse from "./TermsOfUse";
import PrivacyPolicy from "./PrivacyPolicy";

interface SignUpFormProps {
  onSubmit: (userData: SignUpFormData) => void;
  userType: UserType;
}

export interface SignUpFormData {
  email: string;
  password: string;
  company: {
    name: string;
    representativeName: string;
    number: string;
    certificate?: string;
  };
  pic: {
    lastName: string;
    firstName: string;
    phone: string;
    email: string;
  };
  agreements: {
    terms: boolean;
    privacy: boolean;
  };
}

const SignUpForm = ({ onSubmit, userType }: SignUpFormProps) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [isBusinessNumberVerified, setIsBusinessNumberVerified] =
    useState(false);
  const [businessCertificate, setBusinessCertificate] = useState<File | null>(
    null
  );

  const [picLastName, setPicLastName] = useState("");
  const [picFirstName, setPicFirstName] = useState("");
  const [picPhone, setPicPhone] = useState("");
  const [picEmail, setPicEmail] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);
  const [isFinishedTimer, setIsFinishedTimer] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const prevEmailTimerRef = useRef(emailTimer);
  const [brCertFilePath, setBrCertFilePath] = useState("");

  useEffect(() => {
    if (emailTimer > 0) {
      timerRef.current = setTimeout(
        () => setEmailTimer(emailTimer - 1000),
        1000
      );
    }

    if (prevEmailTimerRef.current > 0 && emailTimer === 0) {
      setIsFinishedTimer(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    prevEmailTimerRef.current = emailTimer;

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [emailTimer]);

  // 이메일 인증 코드 발송 (실제로는 API 호출로 구현)
  const handleSendVerificationCode = async () => {
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
    try {
      setErrors({ ...errors, email: "" });

      const response = await emailVerificationControllerSendVerificationEmail({
        email,
      });

      if (response.status === "duplicated") {
        setErrors({ ...errors, email: "이미 사용중인 이메일입니다." });
        return;
      }

      setEmailTimer(180 * 1000);
      toast.success("인증 코드가 이메일로 발송되었습니다.");
    } catch (error) {
      toast.error("인증 코드 발송에 실패했습니다.");
    }
  };

  // 이메일 인증 확인 (실제로는 API 호출로 구현)
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setErrors({ ...errors, verificationCode: "인증 코드를 입력해주세요." });
      return;
    } else {
      setErrors({ ...errors, verificationCode: "" });
    }

    // 실제 구현에서는 API 호출
    try {
      const response = await emailVerificationControllerVerifyCode({
        email,
        code: verificationCode,
      });

      if (response.status === "verified") {
        setIsEmailVerified(true);
        setErrors({ ...errors, verificationCode: "" });
        toast.success("이메일이 인증되었습니다.");
      } else {
        setErrors({
          ...errors,
          verificationCode: "인증 코드가 일치하지 않습니다.",
        });
      }
    } catch (error) {
      toast.error("인증 코드 확인에 실패했습니다.");
      setErrors({
        ...errors,
        verificationCode: "인증 코드가 일치하지 않습니다.",
      });
    }
  };

  // 사업자 번호 인증 (실제로는 API 호출로 구현)
  const handleVerifyBusinessNumber = async () => {
    if (!companyNumber) {
      setErrors({ ...errors, companyNumber: "사업자 번호를 입력해주세요." });
      return;
    }

    try {
      // 실제 구현에서는 API 호출
      const response = await companiesControllerVerifyBusiness({
        businessNumber: companyNumber,
        companyName: companyName,
        representativeName: representativeName,
      });

      if (response.data && response.data.valid) {
        setIsBusinessNumberVerified(true);
        setErrors({ ...errors, companyNumber: "" });
        toast.success("사업자 번호가 인증되었습니다.");
      } else {
        setErrors({
          ...errors,
          companyNumber: "사업자 번호가 인증되지 않았습니다.",
        });
        toast.error("사업자 번호 인증에 실패했습니다.");
      }
    } catch (error) {
      toast.error("사업자 번호 인증에 실패했습니다.");
    }
  };

  // 파일 업로드 처리
  const handleChangeFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const response = await mediaFileControllerInitializeUpload({
          entityType: "company",
          fileName: e.target.files[0].name,
          mimeType: e.target.files[0].type,
          size: e.target.files[0].size,
        });

        await uploadFileToS3(e.target.files[0], response.data?.uploadUrl || "");

        setBusinessCertificate(e.target.files[0]);
        setBrCertFilePath(response.data?.imgSrc || "");
        setErrors({ ...errors, businessCertificate: "" });
      } catch (error) {
        setErrors({
          ...errors,
          businessCertificate: "파일 업로드에 실패했습니다.",
        });
        setBusinessCertificate(null);
      }
    } else {
      setBusinessCertificate(null);
      setBrCertFilePath("");
    }
  };

  const uploadFileToS3 = async (file: File, uploadUrl: string) => {
    try {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!response.ok) {
        toast.error("파일 업로드에 실패했습니다.");
      }

      return true;
    } catch (error) {
      toast.error("파일 업로드에 실패했습니다.");
      return false;
    }
  };

  // 다음 단계로 이동
  const goToNextStep = (currentStep: number) => {
    if (currentStep === 1) {
      // 1단계 유효성 검사
      const stepErrors: { [key: string]: string } = {};

      if (!email) stepErrors.email = "이메일을 입력해주세요.";
      if (!isEmailVerified && verificationCode)
        stepErrors.verificationCode = "인증 코드가 일치하지 않습니다.";
      if (!isEmailVerified && !verificationCode)
        stepErrors.verificationCode = "인증 코드를 입력해주세요.";
      if (!password) stepErrors.password = "비밀번호를 입력해주세요.";
      if (password !== passwordConfirm)
        stepErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";

      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }

    if (currentStep === 2) {
      // 2단계 유효성 검사
      const stepErrors: { [key: string]: string } = {};

      if (!companyName) stepErrors.companyName = "회사명을 입력해주세요.";
      if (!representativeName)
        stepErrors.representativeName = "대표자명을 입력해주세요.";
      if (!companyNumber && !isBusinessNumberVerified)
        stepErrors.companyNumber = "사업자 등록번호를 입력해주세요.";
      if (companyNumber && !isBusinessNumberVerified)
        stepErrors.companyNumber = "사업자 등록번호가 인증되지 않았습니다.";
      if (userType === "01" && !businessCertificate) {
        stepErrors.businessCertificate = "사업자 등록증을 업로드해주세요.";
      }

      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }

    setStep(currentStep + 1);
    setErrors({});
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: "" });
  };

  const handleChangeVerificationCode = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(e.target.value);
    setErrors({ ...errors, verificationCode: "" });
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors({ ...errors, password: "" });
  };

  const handleChangeCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
    setErrors({ ...errors, companyName: "" });
  };

  const handleChangeRepresentativeName = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRepresentativeName(e.target.value);
    setErrors({ ...errors, representativeName: "" });
  };

  const handleChangeCompanyNumber = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCompanyNumber(e.target.value);
    setErrors({ ...errors, companyNumber: "" });
  };

  const handleChangePicLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPicLastName(e.target.value);
    setErrors({ ...errors, picLastName: "" });
  };

  const handleChangePicFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPicFirstName(e.target.value);
    setErrors({ ...errors, picFirstName: "" });
  };

  const handleChangePicPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPicPhone(e.target.value);
    setErrors({ ...errors, picPhone: "" });
  };

  const handleChangePicEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPicEmail(e.target.value);
    setErrors({ ...errors, picEmail: "" });
  };

  const handleOpenTermsModal = () => {
    setIsTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    setIsTermsModalOpen(false);
  };

  const handleOpenPrivacyModal = () => {
    setIsPrivacyModalOpen(true);
  };

  const handleClosePrivacyModal = () => {
    setIsPrivacyModalOpen(false);
  };

  // 회원가입 제출
  const handleSubmit = () => {
    // 3단계 유효성 검사
    const stepErrors: { [key: string]: string } = {};

    if (!picLastName) stepErrors.picLastName = "담당자 성을 입력해주세요.";
    if (!picFirstName) stepErrors.picFirstName = "담당자 이름을 입력해주세요.";
    if (!picPhone) stepErrors.picPhone = "담당자 전화번호를 입력해주세요.";
    if (!picEmail) stepErrors.picEmail = "담당자 이메일을 입력해주세요.";
    if (!agreeTerms) stepErrors.agreeTerms = "이용약관에 동의해주세요.";
    if (!agreePrivacy)
      stepErrors.agreePrivacy = "개인정보 이용/수집에 동의해주세요.";

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    // 데이터 준비
    const formData: SignUpFormData = {
      email,
      password,
      company: {
        name: companyName,
        representativeName,
        number: companyNumber,
        certificate: brCertFilePath,
      },
      pic: {
        lastName: picLastName,
        firstName: picFirstName,
        phone: picPhone,
        email: picEmail,
      },
      agreements: {
        terms: agreeTerms,
        privacy: agreePrivacy,
      },
    };

    // 제출
    onSubmit(formData);

    // 완료 페이지로 이동
    setStep(4);
  };

  return (
    <div className="pt-[64px] min-h-[900px] flex items-center justify-center">
      <div className="container mx-auto px-4">
        {/* 1단계: 계정 정보 입력 */}
        {step === 1 && (
          <Card className="max-w-md mx-auto bg-white">
            <CardHeader>
              <div className="text-center mb-2">
                <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
                <p className="text-gray-600 mt-2">회원가입</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold">계정 정보 입력</div>
                <div className="text-gray-500">1 / 3</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="email ">이메일</Label>
                <div className="flex mt-2">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleChangeEmail}
                    disabled={isEmailVerified}
                    placeholder="이메일 입력"
                    className="rounded-l-m"
                  />
                  <Button
                    type="button"
                    onClick={handleSendVerificationCode}
                    disabled={isEmailVerified}
                    className="rounded-r-md border border-gray-300 ml-2"
                    variant="secondary"
                  >
                    {!isEmailVerified && emailTimer > 0
                      ? Math.floor((emailTimer % 60000) / 1000) === 0
                        ? `인증번호 재발송 (${Math.floor(
                            emailTimer / 60000
                          )}분)`
                        : `인증번호 재발송 (${Math.floor(
                            emailTimer / 60000
                          )}분 ${Math.floor((emailTimer % 60000) / 1000)}초)`
                      : isFinishedTimer
                      ? "인증번호 재발송"
                      : "인증번호 발송"}
                  </Button>
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="verificationCode">인증번호</Label>
                <div className="flex mt-2">
                  <Input
                    id="verificationCode"
                    type="text"
                    value={verificationCode}
                    onChange={handleChangeVerificationCode}
                    disabled={isEmailVerified}
                    placeholder="인증번호 입력"
                    className="rounded-l-md"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={isEmailVerified}
                    className="rounded-r-md border border-gray-300 ml-2"
                    variant="secondary"
                  >
                    인증확인
                  </Button>
                </div>
                {errors.verificationCode && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.verificationCode}
                  </p>
                )}
                {isEmailVerified && (
                  <p className="text-green-500 text-xs mt-1">
                    입력하신 번호가 일치합니다.
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={handleChangePassword}
                  placeholder="비밀번호 입력"
                  className="mt-2"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div className="mb-6">
                <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호 확인"
                  className="mt-2"
                />
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                onClick={() => goToNextStep(1)}
                className="w-full"
              >
                다음
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* 2단계: 기업 정보 입력 */}
        {step === 2 && (
          <Card className="max-w-md mx-auto bg-white">
            <CardHeader>
              <div className="text-center mb-2">
                <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
                <p className="text-gray-600 mt-2">회원가입</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold">기업 정보 입력</div>
                <div className="text-gray-500">2 / 3</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="companyName">회사명</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={handleChangeCompanyName}
                  placeholder="회사명 입력"
                  className="mt-2"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="representativeName">대표자명</Label>
                <Input
                  id="representativeName"
                  type="text"
                  value={representativeName}
                  onChange={handleChangeRepresentativeName}
                  placeholder="대표자명 입력"
                  className="mt-2"
                />
                {errors.representativeName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.representativeName}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <Label htmlFor="companyNumber">사업자 등록번호</Label>
                <div className="flex mt-2">
                  <Input
                    id="companyNumber"
                    type="text"
                    value={companyNumber}
                    onChange={handleChangeCompanyNumber}
                    placeholder="사업자 등록번호 입력"
                    className="rounded-l-md"
                  />
                  <Button
                    type="button"
                    onClick={handleVerifyBusinessNumber}
                    className="rounded-r-md border border-gray-300 ml-2"
                    variant="secondary"
                  >
                    인증
                  </Button>
                </div>
                {errors.companyNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.companyNumber}
                  </p>
                )}
              </div>
              {userType === "01" && (
                <div className="mb-6">
                  <Label htmlFor="businessCertificate">사업자 등록증</Label>
                  <Input
                    id="businessCertificate"
                    type="file"
                    onChange={handleChangeFile}
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="text-gray-700 mt-2 cursor-pointer"
                  />
                  {errors.businessCertificate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.businessCertificate}
                    </p>
                  )}
                  {businessCertificate && (
                    <>
                      {["image/jpeg", "image/png", "image/jpg"].includes(
                        businessCertificate.type
                      ) && (
                        <img
                          src={URL.createObjectURL(businessCertificate)}
                          alt="사업자 등록증 미리보기"
                          className="mt-2 max-w-xs border rounded"
                          style={{ maxHeight: 200 }}
                        />
                      )}
                      {businessCertificate.type === "application/pdf" && (
                        <p className="text-gray-500 text-xs mt-1">
                          PDF 파일은 미리보기를 지원하지 않습니다.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="button"
                onClick={() => goToNextStep(2)}
                className="w-full"
              >
                다음
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* 3단계: 담당자 정보 입력 */}
        {step === 3 && (
          <Card className="max-w-md mx-auto bg-white">
            <CardHeader>
              <div className="text-center mb-2">
                <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
                <p className="text-gray-600 mt-2">회원가입</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold">담당자 입력</div>
                <div className="text-gray-500">3 / 3</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:space-x-4">
                  <div className="flex-1 mb-4 sm:mb-0">
                    <Label htmlFor="picLastName">담당자 성</Label>
                    <Input
                      id="picLastName"
                      type="text"
                      value={picLastName}
                      onChange={handleChangePicLastName}
                      placeholder="담당자 성 입력"
                      className="mt-2"
                    />
                    {errors.picLastName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.picLastName}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="picFirstName">담당자 이름</Label>
                    <Input
                      id="picFirstName"
                      type="text"
                      value={picFirstName}
                      onChange={handleChangePicFirstName}
                      placeholder="담당자 이름 입력"
                      className="mt-2"
                    />
                    {errors.picFirstName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.picFirstName}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <Label htmlFor="picPhone">담당자 전화번호</Label>
                <Input
                  id="picPhone"
                  type="text"
                  value={picPhone}
                  onChange={handleChangePicPhone}
                  placeholder="담당자 전화번호"
                  className="mt-2"
                />
                {errors.picPhone && (
                  <p className="text-red-500 text-xs mt-1">{errors.picPhone}</p>
                )}
              </div>
              <div className="mb-6">
                <Label htmlFor="picEmail">담당자 회사 이메일</Label>
                <Input
                  id="picEmail"
                  type="email"
                  value={picEmail}
                  onChange={handleChangePicEmail}
                  placeholder="담당자 회사 이메일"
                  className="mt-2"
                />
                {errors.picEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.picEmail}</p>
                )}
              </div>
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label
                    htmlFor="agreeTerms"
                    className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    이용약관 동의
                  </Label>
                  <Button
                    type="button"
                    className="ml-2 text-sm text-blue-600"
                    variant="link"
                    onClick={handleOpenTermsModal}
                  >
                    내용보기
                  </Button>
                </div>
                {errors.agreeTerms && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    checked={agreePrivacy}
                    onChange={(e) => setAgreePrivacy(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <Label
                    htmlFor="agreePrivacy"
                    className="ml-2 text-sm font-medium text-gray-700 cursor-pointer"
                  >
                    개인정보이용/수집 동의
                  </Label>
                  <Button
                    type="button"
                    className="ml-2 text-sm text-blue-600"
                    variant="link"
                    onClick={handleOpenPrivacyModal}
                  >
                    내용보기
                  </Button>
                </div>
                {errors.agreePrivacy && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.agreePrivacy}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" onClick={handleSubmit} className="w-full">
                가입하기
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* 4단계: 가입 완료 */}
        {step === 4 && (
          <Card className="max-w-2xl mx-auto bg-white">
            <CardHeader>
              <div className="text-center mb-2">
                <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
                <p className="text-gray-600 mt-2">회원가입</p>
              </div>
              <div className="flex justify-between items-center">
                <div className="font-semibold">신청이 완료 되었습니다.</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="mb-4 text-gray-700">
                  가입 신청 완료 - 가입 승인 대기 - 가입 승인 완료(1~3일 승인
                  영업일 기준)
                </p>
                <p className="mb-4 text-red-600">
                  가입 반려 시, 기존에 입력하신 정보는 삭제됩니다. 처음부터 가입
                  절차를 진행해 주셔야 합니다.
                </p>
                <p className="text-gray-700">
                  가입 신청이 반려되는 경우 담당자 이메일로 반려 사유를 안내해
                  드립니다.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <Dialog open={isTermsModalOpen} onClose={handleCloseTermsModal}>
        <TermsOfUse onClose={handleCloseTermsModal} />
      </Dialog>
      <Dialog open={isPrivacyModalOpen} onClose={handleClosePrivacyModal}>
        <PrivacyPolicy onClose={handleClosePrivacyModal} />
      </Dialog>
    </div>
  );
};

export default SignUpForm;
