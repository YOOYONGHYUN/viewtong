import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignInFormProps {
  onSubmit: (email: string, password: string) => void;
  errorMessage?: string;
}

const SignInForm: React.FC<SignInFormProps> = ({ onSubmit, errorMessage }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 간단한 유효성 검사
    if (!email) {
      setLocalError("이메일을 입력해주세요.");
      return;
    }

    if (!password) {
      setLocalError("비밀번호를 입력해주세요.");
      return;
    }

    setLocalError("");
    onSubmit(email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-[900px] bg-gray-100 pt-[64px]">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="px-8 py-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">LOGIN</h2>
            </div>

            <div className="mb-4">
              <Label htmlFor="email" className="mb-2 block">
                이메일
              </Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 입력"
              />
            </div>

            <div className="mb-4">
              <Label htmlFor="password" className="mb-2 block">
                비밀번호
              </Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
              />
            </div>

            {(errorMessage || localError) && (
              <div className="mb-4 text-red-500 text-sm">
                {errorMessage || localError}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-gray-800 hover:bg-gray-700 text-white"
            >
              Login
            </Button>

            <div className="mt-4">
              <div className="mb-4 flex justify-between text-sm">
                <span className="text-gray-600">비밀번호를 잊으셨나요?</span>
                <Link
                  to="/change-password"
                  className="text-blue-600 hover:text-blue-800"
                >
                  비밀번호 찾기
                </Link>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-gray-600">처음이신가요?</span>
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-800"
                >
                  회원가입
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInForm;
