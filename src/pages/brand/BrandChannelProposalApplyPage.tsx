import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Step,
  StepButton,
  Stepper,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import { Checkbox } from "@/components/ui/checkbox";
import { isEqual } from "lodash";
import { Asterisk, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  channelProposalControllerCreate,
  sourcingControllerCreate,
} from "@/queries";
import { useCategoryStore } from "@/stores/category";
import {
  CategoryResponseDto,
  CreateProductSourcingDtoAplyCn,
} from "@/queries/model";
import { useMediaMobile } from "@/lib/mediaQuery";
import { useNavigate } from "react-router-dom";

const channel = [
  {
    id: 1,
    name: "코스트코",
  },
  {
    id: 2,
    name: "트레이더스",
  },
  {
    id: 3,
    name: "카카오톡 선물하기",
  },
  {
    id: 4,
    name: "현대백화점 비클린",
  },
  {
    id: 5,
    name: "올리브영",
  },
  {
    id: 6,
    name: "기타",
  },
];

const BrandChannelProposalApplyPage = () => {
  const isMediaMobile = useMediaMobile();
  const navigate = useNavigate();
  const [etc, setEtc] = useState("");
  const [form, setForm] = useState({
    channel: "",
    request: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const channelSelectRef = useRef<HTMLButtonElement>(null);
  const channelInputRef = useRef<HTMLInputElement>(null);
  const requestInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (openDialog) {
      setTimeout(() => {
        setOpenDialog(false);
        setForm({
          channel: "",
          request: "",
        });
      }, 3000);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }, 3100);
    }
  }, [openDialog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.channel === "") {
      toast.error("제안 채널을 입력해주세요.");
      channelSelectRef.current?.click();
      return;
    }

    if (form.channel === "기타" && etc === "") {
      toast.error("기타 채널을 입력해주세요.");
      channelInputRef.current?.focus();
      return;
    }

    if (form.request === "") {
      toast.error("요청사항을 입력해주세요.");
      requestInputRef.current?.focus();
      return;
    }

    try {
      await channelProposalControllerCreate({
        aplyCn: form.request,
        chnNm: form.channel === "기타" ? etc : form.channel,
      });
      setOpenDialog(true);
    } catch (error) {
      toast.error("제안 기획 신청에 실패했습니다.");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="w-full py-12 px-10 lg:px-20">
      <div className="space-y-6 bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold mb-8 text-[#4a81d4]">
          <span>제안 기획 신청</span>
          {!isMediaMobile && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-normal">
                    제안 기획 신청 관리
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className="cursor-pointer font-normal"
                  onClick={() => navigate("/brand/channel/proposal/status")}
                >
                  <BreadcrumbLink className="font-normal">
                    제안 기획 신청 리스트
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    제안 기획 신청
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label
              htmlFor="channel"
              className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-1"
            >
              <span>제안 채널을 입력해주세요.</span>
              <Asterisk size={10} stroke="red" />
            </Label>
            <Select
              value={form.channel}
              onValueChange={(value) => {
                setForm({ ...form, channel: value });
                if (value === "기타") {
                  setEtc("");
                }
              }}
            >
              <SelectTrigger ref={channelSelectRef} className="w-full">
                <SelectValue placeholder="제안 채널을 입력해주세요." />
              </SelectTrigger>
              <SelectContent className="w-full bg-white">
                {channel.map((item) => (
                  <SelectItem key={item.id} value={item.name}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.channel === "기타" && (
              <Input
                ref={channelInputRef}
                id="etc"
                name="etc"
                className="text-sm md:text-base mt-2"
                value={etc}
                onChange={(e) => setEtc(e.target.value)}
                placeholder="기타 채널을 입력해주세요."
              />
            )}
          </div>

          <div>
            <Label
              htmlFor="request"
              className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-1"
            >
              <span>요청사항을 입력해주세요.</span>
              <Asterisk size={10} stroke="red" />
            </Label>
            <Textarea
              ref={requestInputRef}
              id="request"
              name="request"
              className="text-sm md:text-base"
              rows={6}
              maxLength={500}
              value={form.request}
              onChange={(e) => setForm({ ...form, request: e.target.value })}
              placeholder={`요청사항을 입력해주세요.`}
            />
          </div>
        </div>

        {/* 등록 버튼 */}
        <Button
          className="w-full h-12 text-base md:text-lg font-bold bg-[#4a81d4] hover:bg-[#3561a7] text-white rounded-lg"
          onClick={handleSubmit}
        >
          저장하기
        </Button>
      </div>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{ borderRadius: "8px" }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: "center" }}>
          💌 접수가 완료되었습니다.
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            제안 기획 신청이 완료되었습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          <Button
            onClick={handleCloseDialog}
            className="text-lg font-bold bg-[#4a81d4] hover:bg-[#3561a7] text-white rounded-lg"
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BrandChannelProposalApplyPage;
