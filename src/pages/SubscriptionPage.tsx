import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle2, Lock } from "lucide-react";
import { useUserStore } from "@/stores/user";
import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "FREE",
    price: "무료 체험",
    features: ["제안문서작성 1건", "열람 무제한"],
    note: "30일 이상 미접속 시 회원 탈퇴",
    button: { text: "시작하기", action: "free", disabled: false },
    color: "border-gray-300",
  },
  {
    name: "BASIC",
    price: { monthly: "₩ 15,000원", yearly: "₩ 4,900/월" },
    features: [
      "제안문서작성 10건",
      "열람/편집 무제한",
      "제안문서 검토 컨설팅 5건",
    ],
    comingSoon: ["사본 생성", "내보내기 기능"],
    button: { text: "시작하기", action: "basic", disabled: false },
    color: "border-blue-400",
  },
  {
    name: "MASTER(BUSINESS)",
    price: { monthly: "₩ 30,000원", yearly: "₩ 14,900/월" },
    features: [
      "제안문서작성 무제한",
      "열람/편집 무제한",
      "제안문서 검토 컨설팅 10건",
      "상세페이지 컨설팅 10건",
      "MD 매칭 시 상위 노출",
    ],
    comingSoon: ["사본 생성", "내보내기 기능", "추가 템플릿"],
    button: { text: "시작하기", action: "master", disabled: false },
    color: "border-indigo-500",
  },
];

const refundPolicy = (
  <div className="space-y-2 text-sm text-gray-700">
    <p>
      - 본 구독권을 구매하고 제안문서를 작성하지 않은 경우 7일이내에 전액 환불이
      가능합니다.
    </p>
    <p>
      - 본 구독권을 구매하고 제안문서 작성시 하단의 기준에 따라 환불액이
      산정됩니다.
    </p>
    <p>1. 구독권 구매 후 10일 이하인 경우 : 결제금액 * 2/3</p>
    <p>2. 구독권 구매 후 10일 초과 ~ 20일 이하 : 결제금액 * 1/3</p>
    <p>3. 구독권 구매 후 20일 초과 : 환불 불가</p>
  </div>
);

const SubscriptionPage = () => {
  const [isYearly, setIsYearly] = useState(true);
  const [openDialog, setOpenDialog] = useState<
    null | "payment" | "refund" | "recur"
  >(null);
  const [selectedPlan, setSelectedPlan] = useState<
    null | "free" | "basic" | "master"
  >(null);
  const [agreeRefund, setAgreeRefund] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRecur, setAgreeRecur] = useState(false);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  const handleStart = (plan: "free" | "basic" | "master") => {
    if (!user) {
      navigate("/signin");
      return;
    }

    setSelectedPlan(plan);
    setOpenDialog("payment");
  };

  const handlePay = () => {
    // 결제 로직 구현 필요
    setOpenDialog(null);
    setAgreeRefund(false);
    setAgreeTerms(false);
    setAgreeRecur(false);
    alert("결제 기능은 추후 제공됩니다.");
  };

  return (
    <div className="min-h-[800px] flex flex-col items-center justify-center pt-[100px] pb-[100px]">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-center md:text-left">
          구독 정보 안내
        </h1>
        <div className="flex items-center justify-center mb-8 gap-4">
          <span
            className={
              !isYearly ? "font-bold text-[#5533fe] text-2xl" : "text-2xl"
            }
          >
            월간
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
            className="w-12 h-7 bg-[#5533fe]"
          />
          <span
            className={
              isYearly ? "font-bold text-[#5533fe] text-2xl" : "text-2xl"
            }
          >
            연간
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={plan.name}
              className={`min-h-[500px] border-2 ${plan.color} rounded-3xl shadow-lg flex flex-col h-full bg-white`}
            >
              <div className="p-6 flex flex-col flex-1">
                <h2 className="text-2xl font-bold mb-6 text-center">
                  {plan.name}
                </h2>
                <div className="text-4xl font-extrabold mb-2 text-center">
                  {typeof plan.price === "string"
                    ? plan.price
                    : isYearly
                    ? plan.price.yearly
                    : plan.price.monthly}
                </div>
                <div className="h-1 w-36 bg-gray-200 mx-auto my-4" />
                <div className="flex flex-col items-center">
                  <ul className="min-h-[150px] list-disc list-inside text-left space-y-2 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="h-1 w-36 bg-gray-200 mx-auto my-4" />
                {plan.comingSoon && (
                  <div className="rounded-lg">
                    <div className="font-semibold text-gray-700 mb-2 text-center">
                      Coming soon
                    </div>
                    <ul className="list-disc list-inside text-gray-500 text-sm">
                      {plan.comingSoon.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className=" mt-auto">
                  {plan.note && (
                    <div className="text-sm font-bold text-red-500 mt-auto text-center">
                      {plan.note}
                    </div>
                  )}
                  <Button
                    className={`w-full h-12 text-lg rounded-full font-bold ${
                      plan.name === "MASTER(BUSINESS)"
                        ? "bg-[#5533fe] text-white hover:bg-[#5533fe]/80"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    } mt-6`}
                    disabled={plan.button.disabled}
                    onClick={() =>
                      handleStart(
                        plan.button.action as "free" | "basic" | "master"
                      )
                    }
                  >
                    {plan.button.text}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 결제 안내 다이얼로그 */}
      <Dialog
        open={openDialog === "payment"}
        onOpenChange={() => setOpenDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>결제 안내</DialogTitle>
          </DialogHeader>
          <div className="mb-4">
            <div className="font-semibold mb-2">제품 정보</div>
            <div className="flex justify-between text-sm border-b pb-2 mb-2">
              <span>제품명</span>
              <span>
                {selectedPlan === "basic"
                  ? isYearly
                    ? "BASIC - 연간 정기구독"
                    : "BASIC - 월간구독"
                  : "MASTER - 연간 정기구독"}
              </span>
            </div>
            <div className="flex justify-between text-sm border-b pb-2 mb-2">
              <span>기간</span>
              <span>{isYearly ? "월간자동결제" : "1개월"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>결제 금액</span>
              <span>
                {selectedPlan === "basic"
                  ? isYearly
                    ? "4,900원"
                    : "15,000원"
                  : isYearly
                  ? "14,900원"
                  : "30,000원"}
              </span>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-2">결제자 정보</div>
            <div className="flex flex-col gap-1 text-sm">
              <span>이름: 담당자 정보가 등록되지 않았습니다.</span>
              <span>이메일: example@email.com</span>
              <span>연락처: 연락처가 등록되지 않았습니다.</span>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreeRefund}
                onChange={(e) => setAgreeRefund(e.target.checked)}
              />
              환불 정책을 확인 하였으며 내용에 동의합니다.
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={() => setOpenDialog("refund")}
                type="button"
              >
                환불정책 보기
              </Button>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              이용약관의 결제 관련 내용을 확인 하였으며 결제에 동의합니다.
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600"
                onClick={() => alert("이용약관은 추후 제공됩니다.")}
                type="button"
              >
                이용약관 보기
              </Button>
            </label>
            {isYearly && (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreeRecur}
                  onChange={(e) => setAgreeRecur(e.target.checked)}
                />
                정기구독 서비스 내용을 확인 하였으며 결제에 동의합니다.
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600"
                  onClick={() => setOpenDialog("recur")}
                  type="button"
                >
                  정기결제 서비스 약관 보기
                </Button>
              </label>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              disabled={
                !agreeRefund || !agreeTerms || (isYearly && !agreeRecur)
              }
              onClick={handlePay}
            >
              결제하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 환불정책 다이얼로그 */}
      <Dialog
        open={openDialog === "refund"}
        onOpenChange={() => setOpenDialog("payment")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>환불정책</DialogTitle>
          </DialogHeader>
          {refundPolicy}
          <DialogFooter>
            <Button onClick={() => setOpenDialog("payment")}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 정기결제 약관 다이얼로그 */}
      <Dialog
        open={openDialog === "recur"}
        onOpenChange={() => setOpenDialog("payment")}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>정기결제 약관</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-700 space-y-2">
            <p>
              제1조(목적) ... (약관 전문은 별도 파일 또는 페이지로 관리 권장)
            </p>
            <p>
              이 약관은 회사 뷰통월드가 제공하는 정기구독서비스의 이용과
              관련하여 회사와 회원과의 권리 및 의무 기타 필요한 사항에 대해
              규정함을 목적으로 합니다.
            </p>
            {/* 실제 약관 내용은 별도 컴포넌트/페이지로 분리 권장 */}
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenDialog("payment")}>닫기</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPage;
