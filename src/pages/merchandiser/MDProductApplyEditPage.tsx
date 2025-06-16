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
import toast from "react-hot-toast";
import { NumericFormat } from "react-number-format";
import { Checkbox } from "@/components/ui/checkbox";
import { isEqual } from "lodash";
import { Asterisk, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate, useParams } from "react-router-dom";
import {
  BrandModelType,
  BrandModelUsage,
  model,
  offline,
  OfflineType,
  OfflineUsage,
  popupStore,
  PopupStoreType,
  PopupStoreUsage,
  ProductApplyForm,
  reviewProduct,
  salesChannel,
  SalesChannelType,
  SalesChannelUsage,
  steps,
  trendProduct,
} from "./MDProductApplyPage";
import { useCategoryStore } from "@/stores/category";
import {
  CategoryResponseDto,
  CreateProductSourcingDtoAplyCn,
  UpdateProductSourcingDtoAplyCn,
  UpdateProductSourcingDtoAplyStts,
} from "@/queries/model";
import {
  categoryControllerFindAll,
  sourcingControllerCreate,
  sourcingControllerFindOne,
  sourcingControllerUpdate,
} from "@/queries";
import { Autocomplete, TextField } from "@mui/material";
import { useUserStore } from "@/stores/user";

import { useMediaMobile } from "@/lib/mediaQuery";

const initialForm = {
  channel: "",
  category: [] as { id: number; name: string }[],
  description: "",
  price: "",
  target: "",
  sku: "",
  sample: "",
  event: "",
  preservation: "",
  verification: "",
  competitor: "",
  review: [] as string[],
  trend: [] as string[],
  model: "",
  offline: [] as string[],
  popupStore: [] as string[],
  tag: [] as string[],
  marketingPlan: "",
  recommend: false,
  concept: "",
  request: "",
  quantity: "",
  salesChannel: [] as string[],
  brandStory: "",
  etc: "",
};

const MDProductApplyEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [originalForm, setOriginalForm] = useState(initialForm);

  const [form, setForm] = useState(initialForm);
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const [hoveredRemove, setHoveredRemove] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [modelCustomInput, setModelCustomInput] = useState("");
  const [offlineCustomInput, setOfflineCustomInput] = useState("");
  const [popupStoreCustomInput, setPopupStoreCustomInput] = useState("");
  const [salesChannelCustomInput, setSalesChannelCustomInput] = useState("");
  const channelInputRef = useRef<HTMLInputElement>(null);
  const modelInputRef = useRef<HTMLInputElement>(null);
  const offlineInputRef = useRef<HTMLInputElement>(null);
  const popupStoreInputRef = useRef<HTMLInputElement>(null);
  const recommendRef = useRef<HTMLDivElement>(null);
  const conceptInputRef = useRef<HTMLInputElement>(null);
  const salesChannelInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<{
    first: { id: number | undefined; cd: string } | undefined;
    second: { id: number | undefined; cd: string } | undefined;
    third: { id: number | undefined; cd: string } | undefined;
    fourth: { id: number | undefined; cd: string } | undefined;
  }>({
    first: { id: undefined, cd: "" },
    second: { id: undefined, cd: "" },
    third: { id: undefined, cd: "" },
    fourth: { id: undefined, cd: "" },
  });
  const { productCategory, productTag } = useCategoryStore();
  const user = useUserStore((state) => state.user);
  const isMediaMobile = useMediaMobile();

  useEffect(() => {
    getProduct();
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    if (openDialog) {
      setTimeout(() => {
        setOpenDialog(false);
        setActiveStep(0);
        setCompleted({});
        setForm(initialForm);
        setCategory({
          first: { id: undefined, cd: "" },
          second: { id: undefined, cd: "" },
          third: { id: undefined, cd: "" },
          fourth: { id: undefined, cd: "" },
        });
      }, 3000);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }, 3100);
    }
  }, [openDialog]);

  const getProduct = async () => {
    try {
      // 1. 카테고리 데이터 준비
      let categoryList: CategoryResponseDto[] = productCategory;
      if (categoryList.length === 0) {
        const res = await categoryControllerFindAll({
          page: 1,
          limit: 1000,
          cdClsfNm: "category",
        });
        categoryList = res.data || [];
      }

      // 2. 공통 유틸 함수
      const splitAndClean = (str: string | null | undefined) =>
        str
          ? str
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : [];

      const findCategoryName = (cat: string) =>
        categoryList.find((item) => item.cd === cat)?.cdNm || "";

      const product = await sourcingControllerFindOne(Number(id));
      if (!product.data) return;
      const applyCn = JSON.parse(product.data?.aplyCn) as ProductApplyForm;

      setOriginalForm({
        ...form,
        channel: product.data.aplymNm,
        category: splitAndClean(product.data.prdctClsfVl).map((cat) => {
          const id = categoryList.find((item) => item.cd === cat)?.id || 0;

          return {
            id: id || 0,
            name: findCategoryName(cat),
          };
        }),
        description: applyCn.description,
        price: applyCn.price,
        target: applyCn.target,
        sku: applyCn.sku,
        sample: applyCn.sample,
        event: applyCn.event,
        preservation: applyCn.preservation,
        verification: applyCn.verification,
        competitor: applyCn.competitor,
        review: applyCn.review,
        trend: applyCn.trend,
        model: applyCn.model.type,
        offline: applyCn.offline.type,
        popupStore: applyCn.popupStore.type,
        tag: typeof applyCn.tag === "string" ? getTagList(applyCn.tag) : [],
        marketingPlan: applyCn.marketingPlan,
        recommend: applyCn.recommend,
        concept: applyCn.concept,
        request: applyCn.request,
        quantity: applyCn.quantity,
        salesChannel: applyCn.salesChannel.type,
        brandStory: applyCn.brandStory,
        etc: applyCn.etc,
      });

      setForm({
        ...form,
        channel: product.data.aplymNm,
        category: splitAndClean(product.data.prdctClsfVl).map((cat) => {
          const id = categoryList.find((item) => item.cd === cat)?.id || 0;

          return {
            id: id || 0,
            name: findCategoryName(cat),
          };
        }),
        description: applyCn.description,
        price: applyCn.price,
        target: applyCn.target,
        sku: applyCn.sku,
        sample: applyCn.sample,
        event: applyCn.event,
        preservation: applyCn.preservation,
        verification: applyCn.verification,
        competitor: applyCn.competitor,
        review: applyCn.review,
        trend: applyCn.trend,
        model: applyCn.model.type,
        offline: applyCn.offline.type,
        popupStore: applyCn.popupStore.type,
        tag: typeof applyCn.tag === "string" ? getTagList(applyCn.tag) : [],
        marketingPlan: applyCn.marketingPlan,
        recommend: applyCn.recommend,
        concept: applyCn.concept,
        request: applyCn.request,
        quantity: applyCn.quantity,
        salesChannel: applyCn.salesChannel.type,
        brandStory: applyCn.brandStory,
        etc: applyCn.etc,
      });

      setModelCustomInput(applyCn.model.customInput ?? "");
      setOfflineCustomInput(applyCn.offline.customInput ?? "");
      setPopupStoreCustomInput(applyCn.popupStore.customInput ?? "");
      setSalesChannelCustomInput(applyCn.salesChannel.customInput ?? "");
    } catch (error) {
      toast.error("상품 정보를 불러오는데 실패했습니다.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCategory = (order: number, value: string) => {
    const orderKey = ["first", "second", "third", "fourth"] as const;
    const selectedKey = orderKey[order];
    const newValue = Number(value);

    setCategory((prev) => {
      const updated = { ...prev, [selectedKey]: newValue };
      orderKey.forEach((key, idx) => {
        if (idx > order) updated[key] = { id: undefined, cd: "" };
      });
      return updated;
    });
  };

  const handleChangeCategoryForm = (value: { id: number; name: string }) => {
    setForm((prev) => ({
      ...prev,
      category: [...prev.category, { id: value.id, name: value.name }],
    }));
  };

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (form.channel === "") {
        window.scrollTo({ top: 240, behavior: "smooth" });
        toast.error("유통채널명을 입력해주세요.");
        setTimeout(() => {
          channelInputRef.current?.focus();
        }, 1000);
        return;
      }

      if (form.category.length === 0) {
        window.scrollTo({ top: 240, behavior: "smooth" });
        toast.error("상품분류군을 선택해주세요.");
        return;
      }

      if (form.model === "customInput" && modelCustomInput === "") {
        modelInputRef.current?.focus();
        toast.error("모델 사용 여부를 입력해주세요.");
        return;
      }

      if (form.offline.includes("customInput") && offlineCustomInput === "") {
        offlineInputRef.current?.focus();
        toast.error("오프라인 매장 입점 레퍼런스 여부를 입력해주세요.");
        return;
      }

      if (
        form.popupStore.includes("customInput") &&
        popupStoreCustomInput === ""
      ) {
        popupStoreInputRef.current?.focus();
        toast.error("팝업스토어 행사 이력 여부를 입력해주세요.");
        return;
      }
    }

    if (
      activeStep === 2 &&
      form.salesChannel.includes("customInput") &&
      salesChannelCustomInput === ""
    ) {
      salesChannelInputRef.current?.focus();
      toast.error("판매 예정 채널를 입력해주세요.");
      return;
    }

    const newActiveStep = isLastStep()
      ? steps.findIndex((step, i) => !(i in completed))
      : activeStep + 1;
    setActiveStep(newActiveStep);

    window.scrollTo({ top: 0 });
  };

  const getCategoryOptions = (step: number, cd: string) => {
    if (!productCategory) return [];

    if (step === 0) {
      return productCategory.filter(
        (cat) => cat.cdLvl === 1
      ) as CategoryResponseDto[];
    }

    return productCategory.filter(
      (cat) => cat.cdLvl === step + 1 && cat.cd.startsWith(cd)
    ) as CategoryResponseDto[];
  };

  const handleAddCategory = () => {
    const selectedCategory = productCategory?.find(
      (cat) => cat.id === category.fourth?.id
    );

    if (!selectedCategory) {
      toast.error("카테고리를 추가해주세요.");
      return;
    }

    if (form.category.some((cat) => cat.id === selectedCategory.id)) {
      toast.success("이미 추가된 카테고리입니다.");
      return;
    }

    handleChangeCategoryForm({
      id: selectedCategory.id,
      name: selectedCategory.cdNm,
    });
  };

  const handleRemoveCategory = (id: number) => {
    setForm((prev) => ({
      ...prev,
      category: prev.category.filter((cat) => cat.id !== id),
    }));
  };

  const handleChangeReviewProduct = (checked: string | boolean, id: string) => {
    checked
      ? setForm({
          ...form,
          review: [...form.review, id],
        })
      : setForm({
          ...form,
          review: form.review.filter((review) => !isEqual(review, id)),
        });
  };

  const handleChangeTrendProduct = (checked: string | boolean, id: string) => {
    checked
      ? setForm({
          ...form,
          trend: [...form.trend, id],
        })
      : setForm({
          ...form,
          trend: form.trend.filter((trend) => !isEqual(trend, id)),
        });
  };

  const handleChangeModel = (value: string) => {
    setForm({
      ...form,
      model: value,
    });

    setTimeout(() => {
      if (value === "customInput" && modelInputRef.current) {
        modelInputRef.current.focus();
      }
    }, 100);
  };

  const handleChangeOffline = (checked: string | boolean, id: string) => {
    checked
      ? setForm({ ...form, offline: [...form.offline, id] })
      : setForm({
          ...form,
          offline: form.offline.filter((offline) => offline !== id),
        });

    setTimeout(() => {
      if (id === "customInput" && offlineInputRef.current) {
        offlineInputRef.current.focus();
      }
    }, 100);
  };

  const handleChangePopupStore = (checked: string | boolean, id: string) => {
    if (checked) {
      setForm((prev) => {
        if (id === "popupStoreNone") {
          return { ...prev, popupStore: [id] };
        }
        return {
          ...prev,
          popupStore: [
            ...prev.popupStore.filter(
              (item) => item !== "popupStoreNone" && item !== id
            ),
            id,
          ],
        };
      });
    } else {
      setForm((prev) => ({
        ...prev,
        popupStore: prev.popupStore.filter((item) => item !== id),
      }));
    }

    setTimeout(() => {
      if (id === "customInput" && popupStoreInputRef.current) {
        popupStoreInputRef.current.focus();
      }
    }, 100);
  };

  const handleChangeTag = (value: string) => {
    if (value === "" || value === null) return;

    if (form.tag.includes(value)) {
      toast.success("이미 추가된 태그입니다.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      tag: [...prev.tag, value],
    }));
  };

  const handleRemoveTag = (value: string) => {
    setForm((prev) => ({
      ...prev,
      tag: prev.tag.filter((tag) => tag !== value),
    }));
  };

  const handleChangeRecommend = (checked: boolean | string) => {
    setForm((prev) => ({
      ...prev,
      recommend: checked as boolean,
      concept: checked ? "" : prev.concept,
      request: checked ? "" : prev.request,
    }));
    if (checked) {
      setTimeout(() => {
        conceptInputRef.current?.focus();
      }, 500);
    }
  };

  const handleChangeSalesChannel = (checked: string | boolean, id: string) => {
    if (id === "customInput") {
      setTimeout(() => {
        salesChannelInputRef.current?.focus();
      }, 100);
    }

    checked
      ? setForm({ ...form, salesChannel: [...form.salesChannel, id] })
      : setForm({
          ...form,
          salesChannel: form.salesChannel.filter(
            (salesChannel) => salesChannel !== id
          ),
        });
  };

  const handleChangeModelCustomInput = (value: string) => {
    setModelCustomInput(value);
  };

  const handleChangeOfflineCustomInput = (value: string) => {
    setOfflineCustomInput(value);
  };

  const handleChangePopupStoreCustomInput = (value: string) => {
    setPopupStoreCustomInput(value);
  };

  const handleChangeSalesChannelCustomInput = (value: string) => {
    setSalesChannelCustomInput(value);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickEdit = async () => {
    if (form.channel === "") {
      toast.error("유통채널명을 입력해주세요.");
      channelInputRef.current?.focus();
      return;
    }

    if (form.category.length === 0) {
      toast.error("상품분류군을 선택해주세요.");
      window.scrollTo({ top: 0 });
      return;
    }

    if (form.model === "customInput" && modelCustomInput === "") {
      toast.error("브랜드 모델 유무를 입력해주세요.");
      modelInputRef.current?.focus();
      return;
    }

    if (form.offline.includes("customInput") && offlineCustomInput === "") {
      toast.error("오프라인 매장 입점 레퍼런스를 입력해주세요.");
      offlineInputRef.current?.focus();
      return;
    }

    if (
      form.popupStore.includes("customInput") &&
      popupStoreCustomInput === ""
    ) {
      toast.error("팝업스토어 행사 이력 여부를 입력해주세요.");
      popupStoreInputRef.current?.focus();
      return;
    }

    if (
      form.salesChannel.includes("customInput") &&
      salesChannelCustomInput === ""
    ) {
      toast.error("판매 예정 채널을 입력해주세요.");
      salesChannelInputRef.current?.focus();
      return;
    }

    const convertCategory = form.category
      .map((cat) => {
        const category = productCategory?.find(
          (c) => c.id === cat.id
        ) as CategoryResponseDto;
        return category.cdWholNm;
      })
      .join(",");

    const convertTag = form.tag
      .map((tag) => {
        const convertedTag = productTag?.find((t) => t.cdWholNm === tag);
        return convertedTag?.cd;
      })
      .join(",");

    const modelUsage: BrandModelUsage = {
      type: form.model as BrandModelType,
      customInput: modelCustomInput,
    };

    const offlineUsage: OfflineUsage = {
      type: form.offline as OfflineType[],
      customInput: offlineCustomInput,
    };

    const popupStoreUsage: PopupStoreUsage = {
      type: form.popupStore as PopupStoreType[],
      customInput: popupStoreCustomInput,
    };

    const salesChannelUsage: SalesChannelUsage = {
      type: form.salesChannel as SalesChannelType[],
      customInput: salesChannelCustomInput,
    };

    const aplyCn: UpdateProductSourcingDtoAplyCn = {
      description: form.description,
      price: form.price,
      target: form.target,
      sku: form.sku,
      sample: form.sample,
      event: form.event,
      preservation: form.preservation,
      verification: form.verification,
      competitor: form.competitor,
      review: form.review,
      trend: form.trend,
      model: modelUsage,
      offline: offlineUsage,
      popupStore: popupStoreUsage,
      tag: convertTag,
      marketingPlan: form.marketingPlan,
      recommend: form.recommend,
      concept: form.concept,
      request: form.request,
      quantity: form.quantity,
      salesChannel: salesChannelUsage,
      brandStory: form.brandStory,
      etc: form.etc,
    };

    try {
      const response = await sourcingControllerUpdate(Number(id), {
        aplymNm: form.channel,
        aplyCn: aplyCn,
        aplyStts: user?.mbrSeCd as UpdateProductSourcingDtoAplyStts,
        prdctClsfVl: convertCategory,
      });

      if (response.data) {
        toast.success("상품발굴의뢰 신청 수정에 성공했습니다.");
        setTimeout(() => {
          navigate(`/md/product/apply/detail/${id}`);
        }, 1000);
      }
    } catch (error) {
      toast.error("상품발굴의뢰 신청 수정에 실패했습니다.");
    }
  };

  const getTagList = (tagCd: string | null | undefined) => {
    if (!tagCd) return [];
    const convertToList = tagCd.split(",").map((tag) => tag.trim());
    const tagList = convertToList.map((tag) => {
      return `${
        productTag?.find((productTag) => productTag.cd === tag)?.cdWholNm
      }`;
    });

    return tagList;
  };

  return (
    <div className="w-full min-h-screen py-12 px-10 lg:px-20">
      <div className="flex flex-col space-y-6 bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold mb-8 text-[#4a81d4]">
          <span>상품발굴의뢰 신청 수정</span>
          {!isMediaMobile && (
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink className="font-normal">
                    상품발굴
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem
                  className="cursor-pointer font-normal"
                  onClick={() => navigate("/md/product/apply/status")}
                >
                  <BreadcrumbLink>상품발굴의뢰 신청 현황</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage
                    className="cursor-pointer font-normal"
                    onClick={() => navigate(`/md/product/apply/detail/${id}`)}
                  >
                    상세보기
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold">
                    수정하기
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
        {/* 카테고리 */}
        <div>
          <Label
            htmlFor="channel"
            className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-1"
          >
            <span>유통채널명을 입력해주세요.</span>
            <Asterisk size={10} stroke="red" />
          </Label>
          <Input
            ref={channelInputRef}
            id="channel"
            name="channel"
            className="text-sm md:text-base"
            value={form.channel}
            onChange={handleChange}
            placeholder={`ex) 현대백화점 '비클린', 현대백화점 '나이스웨더', CJ 올리브영`}
          />
        </div>
        {/* 상품분류군 */}
        <div>
          <Label
            htmlFor="category"
            className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-1"
          >
            <span>찾는 상품의 상품분류군을 선택해주세요.</span>
            <Asterisk size={10} stroke="red" />
          </Label>
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2">
            <Select
              value={category.first?.toString()}
              onValueChange={(value) => handleChangeCategory(0, value)}
            >
              <SelectTrigger className="w-full md:w-auto text-sm md:text-base">
                <SelectValue placeholder="1차 분류" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {getCategoryOptions(0, "").map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id.toString()}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {cat.cdNm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              disabled={category.first?.id === undefined}
              value={category.second?.toString()}
              onValueChange={(value) => handleChangeCategory(1, value)}
            >
              <SelectTrigger className="w-full md:w-auto text-sm md:text-base">
                <SelectValue placeholder="2차 분류" />
              </SelectTrigger>
              <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                {getCategoryOptions(1, category.first?.cd || "").map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id.toString()}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {cat.cdNm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              disabled={category.second?.id === undefined}
              value={category.third?.toString()}
              onValueChange={(value) => handleChangeCategory(2, value)}
            >
              <SelectTrigger className="w-full md:w-auto text-sm md:text-base">
                <SelectValue placeholder="3차 분류" />
              </SelectTrigger>
              <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                {getCategoryOptions(2, category.second?.cd || "").map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id.toString()}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {cat.cdNm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              disabled={category.third?.id === undefined}
              value={category.fourth?.toString()}
              onValueChange={(value) => handleChangeCategory(3, value)}
            >
              <SelectTrigger className="w-full md:w-auto text-sm md:text-base">
                <SelectValue placeholder="4차 분류" />
              </SelectTrigger>
              <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                {getCategoryOptions(3, category.third?.cd || "").map((cat) => (
                  <SelectItem
                    key={cat.id}
                    value={cat.id.toString()}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {cat.cdNm}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="bg-blue-500 text-white w-full md:w-auto"
              size="sm"
              onClick={handleAddCategory}
            >
              추가
            </Button>
          </div>
          {form.category.length > 0 && (
            <div className="flex flex-row items-center gap-2 mt-4">
              <span className="text-sm font-bold">선택된 상품분류군</span>
              {form.category.map((cat, idx) => (
                <div
                  key={idx}
                  className="flex flex-row items-center gap-1 bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-sm cursor-pointer"
                  onMouseEnter={() => setHoveredRemove(idx)}
                  onMouseLeave={() => setHoveredRemove(null)}
                >
                  <span>{cat.name}</span>
                  {hoveredRemove === idx && (
                    <X
                      size={16}
                      className="text-white"
                      onClick={() => handleRemoveCategory(cat.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 구체적인 신청사항 */}
        <div>
          <Label
            htmlFor="description"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            구체적인 신청사항을 입력해주세요.
          </Label>
          <Textarea
            id="description"
            name="description"
            className="text-sm md:text-base"
            value={form.description}
            onChange={handleChange}
            placeholder="ex) 구체적인 신청사항을 입력해주세요."
            rows={6}
          />
        </div>
        {/* 판매가격 */}
        <div>
          <Label
            htmlFor="price"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            찾는 상품의 평균 판매가격을 입력해주세요.
          </Label>
          <NumericFormat
            name="price"
            className="text-sm md:text-base"
            value={form.price}
            customInput={Input}
            thousandSeparator
            suffix="원"
            onChange={handleChange}
            size={100}
            style={{ minWidth: "200px" }}
            placeholder="찾는 상품의 평균 판매가격을 숫자로 입력해주세요."
          />
        </div>
        {/* 타겟 소비자층 */}
        <div>
          <Label
            htmlFor="target"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            타겟 소비자층을 입력해주세요.
          </Label>
          <div className="text-sm md:text-base mb-2 text-gray-600">
            찾는 상품이 타겟하고 있는 특정 소비자 그룹(연령, 성별, 피부타입
            등)을 간단히 기입해주세요.
          </div>
          <Input
            id="target"
            name="target"
            className="text-sm md:text-base"
            value={form.target}
            onChange={handleChange}
            placeholder="ex) 30·40대 주부, 친환경 소비자, 안티에이징 소비자"
          />
        </div>
        {/* 보유 SKU 수 */}
        <div>
          <Label
            htmlFor="sku"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            찾는 상품의 보유 SKU 수를 입력해주세요.
          </Label>
          <Input
            id="sku"
            name="sku"
            className="text-sm md:text-base"
            value={form.sku}
            onChange={handleChange}
            placeholder="ex) 6개 이상 보유 필요, 총 6개 중 스킨케어 4개 이상, 기타 - 상관없음(헤어, 바디 등)"
          />
        </div>
        {/* 샘플 운영 여부 */}
        <div>
          <Label
            htmlFor="sample"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            찾는 상품의 샘플 운영이 필요하신가요?
          </Label>
          <Input
            id="sample"
            name="sample"
            className="text-sm md:text-base"
            value={form.sample}
            onChange={handleChange}
            placeholder="ex) 샤쉐 또는 미니용기 운영 필요"
          />
        </div>
        {/* 특정 시즌, 이벤트용 상품을 찾고 있으신가요? */}
        <div>
          <Label
            htmlFor="event"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            특정 시즌, 이벤트용 상품을 찾고 있으신가요?
          </Label>
          <Input
            id="event"
            name="event"
            className="text-sm md:text-base"
            value={form.event}
            onChange={handleChange}
            placeholder="ex) 여름철 계절성 상품(SS,FW 등), 명절 선물 등"
          />
        </div>
        {/* 제품의 유통기한, 보존성 */}
        <div>
          <Label
            htmlFor="preservation"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            제품의 유통기한, 보존성을 입력해주세요.
          </Label>
          <Input
            id="preservation"
            name="preservation"
            className="text-sm md:text-base"
            value={form.preservation}
            onChange={handleChange}
            placeholder="ex) 유통기한 2/3 이상 필요"
          />
        </div>
        {/* 필요한 안정성, 인증 테스트 */}
        <div>
          <Label
            htmlFor="verification"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            필요한 안정성, 인증 테스트를 입력해주세요.
          </Label>
          <Input
            id="verification"
            name="verification"
            className="text-sm md:text-base"
            value={form.verification}
            onChange={handleChange}
            placeholder="ex) 친환경 관련 인증(FSC, VEGAN 등) 유기농"
          />
        </div>
        {/* 경쟁사 브랜드 */}
        <div>
          <Label
            htmlFor="competitor"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            찾고 있는 상품과 유사한 경쟁사 브랜드가 있나요?
          </Label>
          <Input
            id="competitor"
            name="competitor"
            className="text-sm md:text-base"
            value={form.competitor}
            onChange={handleChange}
            placeholder="ex) 경쟁사 브랜드명을 입력해주세요. 유사한 신규 상품을 발굴해드립니다."
          />
        </div>
        {/* 리뷰&평점 관련 상품 발굴 */}
        <div>
          <Label
            htmlFor="competitor"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            리뷰&평점 관련 상품 발굴
          </Label>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
            {reviewProduct.map((product) => (
              <div
                key={product.id}
                className="flex flex-row items-center gap-2"
              >
                <Checkbox
                  id={product.id}
                  className="border-gray-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 data-[state=checked]:text-white cursor-pointer"
                  checked={form.review.includes(product.id)}
                  onCheckedChange={(checked) => {
                    handleChangeReviewProduct(checked, product.id);
                  }}
                />
                <Label className="cursor-pointer" htmlFor={product.id}>
                  {product.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        {/* 트렌드 상품 발굴 */}
        <div>
          <Label
            htmlFor="trend"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            SNS 트렌드 관련 상품 발굴
          </Label>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
            {trendProduct.map((product) => (
              <div
                key={product.id}
                className="flex flex-row items-center gap-2"
              >
                <Checkbox
                  id={product.id}
                  className="border-gray-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 data-[state=checked]:text-white cursor-pointer"
                  checked={form.trend.includes(product.id)}
                  onCheckedChange={(checked) => {
                    handleChangeTrendProduct(checked, product.id);
                  }}
                />
                <Label className="cursor-pointer" htmlFor={product.id}>
                  {product.name}
                </Label>
              </div>
            ))}
          </div>
        </div>
        {/* 모델 사용 여부 */}
        <div>
          <Label
            htmlFor="model"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            브랜드 모델 사용 여부
          </Label>
          <RadioGroup
            onValueChange={(value) => {
              handleChangeModel(value);
            }}
            defaultValue={form.model}
            className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0"
          >
            {model.map((model, index) => (
              <div className="flex items-center space-x-2" key={model.id}>
                <RadioGroupItem
                  id={model.id}
                  className="border-gray-400 cursor-pointer"
                  value={model.id}
                />
                <Label className="cursor-pointer" htmlFor={model.id}>
                  {model.name}
                </Label>
              </div>
            ))}
            {form.model === "customInput" && (
              <Input
                ref={modelInputRef}
                className="w-[200px] text-sm md:text-base"
                value={modelCustomInput}
                onChange={(e) => {
                  handleChangeModelCustomInput(e.target.value);
                }}
              />
            )}
          </RadioGroup>
        </div>
        {/* 오프라인 판매 여부 */}
        <div>
          <Label
            htmlFor="offline"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            오프라인 매장 입점 레퍼런스 여부
          </Label>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
            {offline.map((offline) => (
              <div
                key={offline.id}
                className="flex flex-row items-center gap-2"
              >
                <Checkbox
                  id={offline.id}
                  className="border-gray-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 data-[state=checked]:text-white cursor-pointer"
                  checked={form.offline.includes(offline.id)}
                  onCheckedChange={(checked) => {
                    handleChangeOffline(checked, offline.id);
                  }}
                />
                <Label className="cursor-pointer" htmlFor={offline.id}>
                  {offline.name}
                </Label>
              </div>
            ))}
            {form.offline.includes("customInput") && (
              <Input
                ref={offlineInputRef}
                className="w-[200px] text-sm md:text-base"
                value={offlineCustomInput}
                onChange={(e) => {
                  handleChangeOfflineCustomInput(e.target.value);
                }}
              />
            )}
          </div>
        </div>
        {/* 팝업 매장 여부 */}
        <div>
          <Label
            htmlFor="popupStore"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            팝업스토어 행사 이력 여부
          </Label>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
            {popupStore.map((popupStore) => (
              <div
                key={popupStore.id}
                className="flex flex-row items-center gap-2"
              >
                <Checkbox
                  id={popupStore.id}
                  className="border-gray-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 data-[state=checked]:text-white cursor-pointer"
                  checked={form.popupStore.includes(popupStore.id)}
                  onCheckedChange={(checked) => {
                    handleChangePopupStore(checked, popupStore.id);
                  }}
                />
                <Label className="cursor-pointer" htmlFor={popupStore.id}>
                  {popupStore.name}
                </Label>
                {form.popupStore.includes("customInput") &&
                  popupStore.id === "customInput" && (
                    <Input
                      ref={popupStoreInputRef}
                      className="w-[200px] text-sm md:text-base"
                      value={popupStoreCustomInput}
                      onChange={(e) => {
                        handleChangePopupStoreCustomInput(e.target.value);
                      }}
                    />
                  )}
              </div>
            ))}
          </div>
        </div>
        {/* 태그 */}
        <div className="flex flex-row items-center gap-8">
          <Label htmlFor="tag" className="text-base md:text-lg font-bold block">
            찾는 상품의 구체적인 태그 입력 시 조금 더 빠른 발굴이 가능합니다!
          </Label>
          <Autocomplete
            options={
              productTag
                ? Array.from(
                    new Set(
                      productTag
                        .filter((tag) => tag.cd.length > 3)
                        .map((tag) => tag.cdWholNm)
                    )
                  )
                : []
            }
            renderInput={(params) => <TextField {...params} />}
            onChange={(event, value) => {
              handleChangeTag(value!);
            }}
            sx={{ width: 300 }}
          />
        </div>
        {form.tag.length > 0 && (
          <div className="flex flex-row items-center gap-2 mt-4">
            <span className="text-sm font-bold">선택된 태그</span>
            {form.tag.map((tag, idx) => (
              <div
                key={idx}
                className="flex flex-row items-center gap-1 bg-blue-500 text-white font-bold px-2 py-1 rounded-md text-sm cursor-pointer"
                onMouseEnter={() => setHoveredRemove(idx)}
                onMouseLeave={() => setHoveredRemove(null)}
              >
                <span>{`#${tag.split(">")[1]}`}</span>
                {hoveredRemove === idx && (
                  <X
                    size={16}
                    className="text-white"
                    onClick={() => handleRemoveTag(tag)}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {/* 마케팅 플랜 */}
        <div>
          <Label
            htmlFor="marketingPlan"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            유통사 입점시 필요한 신규 브랜드의 마케팅 플랜을 입력해주세요.
          </Label>
          <Input
            id="marketingPlan"
            name="marketingPlan"
            className="text-sm md:text-base"
            value={form.marketingPlan}
            onChange={handleChange}
            placeholder={`ex) 체험단, 인플루언서, 증정품 활용 등`}
          />
        </div>
        {/* 단독 기획 구성 여부 */}
        <div>
          <div className="flex flex-row items-center gap-2 mb-2">
            <Label className="text-base md:text-lg font-bold">
              유통사 단독 기획 구성이 필요하신가요?
            </Label>
            <div className="flex flex-row items-center gap-2 ml-2">
              <Checkbox
                id="recommend"
                className="border-gray-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 data-[state=checked]:text-white cursor-pointer"
                checked={form.recommend}
                onCheckedChange={handleChangeRecommend}
              />
              <Label className="cursor-pointer" htmlFor="recommend">
                유통사 단독 기획 구성이 필요하신가요?
              </Label>
            </div>
          </div>
          <div
            style={{
              height: form.recommend
                ? recommendRef.current?.clientHeight
                : "0px",
              transition:
                "height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              overflow: "hidden",
            }}
          >
            <div
              ref={recommendRef}
              className={`flex flex-col gap-2 bg-gray-100 p-6 rounded-md transition-all duration-300 overflow-hidden`}
            >
              <span className="text-sm mb-2 flex flex-row items-center gap-1">
                <Asterisk size={10} stroke="red" />
                {`아래 항목 추가 시, 유통사 단독 '기획 상품 목업본'으로 추천 제안을 해드립니다.`}
              </span>
              <div>
                <Label
                  htmlFor="concept"
                  className="mb-2 text-base md:text-lg font-bold block"
                >
                  유통채널 컨셉 기입
                </Label>
                <Input
                  ref={conceptInputRef}
                  className="bg-white border-gray-400 text-sm md:text-base"
                  id="concept"
                  name="concept"
                  value={form.concept}
                  onChange={handleChange}
                  placeholder={`ex) '선물' 목적에 맞는 서비스를 제공하는 메신저 기반의 커머스 플랫폼`}
                />
              </div>
              <div>
                <Label
                  htmlFor="request"
                  className="mb-2 text-base md:text-lg font-bold block"
                >
                  기획 요청 사항
                </Label>
                <Input
                  className="bg-white border-gray-400 text-sm md:text-base"
                  id="request"
                  name="request"
                  value={form.request}
                  onChange={handleChange}
                  placeholder={`ex) '선물' 목적에 맞는 세트 구성 기획(기프트 패키지 필수)`}
                />
              </div>
            </div>
          </div>
        </div>
        {/* 매입 수량 */}
        <div>
          <Label
            htmlFor="quantity"
            className="mb-1 text-base md:text-lg font-bold block"
          >
            희망 초도 매입 수량을 입력해주세요.
          </Label>
          <div className="text-sm text-gray-500 mb-3">
            화장품 브랜드사 아웃박스(완박스) 기준으로 협의가 가능합니다.
          </div>
          <NumericFormat
            name="quantity"
            value={form.quantity}
            customInput={Input}
            thousandSeparator
            suffix="box"
            onChange={handleChange}
            size={100}
            style={{ minWidth: "200px" }}
            className="text-sm md:text-base"
            placeholder="ex) 10box"
          />
        </div>
        {/* 판매 예정 채널 */}
        <div>
          <Label
            htmlFor="salesChannel"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            판매 예정 채널을 입력해주세요.
          </Label>
          <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
            {salesChannel.map((salesChannel) => (
              <div
                key={salesChannel.id}
                className="flex flex-row items-center gap-2"
              >
                <Checkbox
                  id={salesChannel.id}
                  className="border-gray-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 data-[state=checked]:text-white cursor-pointer"
                  checked={form.salesChannel.includes(salesChannel.id)}
                  onCheckedChange={(checked) => {
                    handleChangeSalesChannel(checked, salesChannel.id);
                  }}
                />
                <Label className="cursor-pointer" htmlFor={salesChannel.id}>
                  {salesChannel.name}
                </Label>
              </div>
            ))}
            {form.salesChannel.includes("customInput") && (
              <Input
                ref={salesChannelInputRef}
                className="w-[200px] text-sm md:text-base"
                value={salesChannelCustomInput}
                onChange={(e) => {
                  handleChangeSalesChannelCustomInput(e.target.value);
                }}
              />
            )}
          </div>
        </div>
        {/* 브랜드 스토리 */}
        <div>
          <Label
            htmlFor="brandStory"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            {`소비자와 공감대를 형성할 '브랜드 스토리, 철학, 세계관, 가치관 등'을 상세하게 기입해주세요. (생략 가능)`}
          </Label>
          <Textarea
            id="brandStory"
            name="brandStory"
            className="text-sm md:text-base"
            rows={6}
            value={form.brandStory}
            onChange={handleChange}
            placeholder={`ex) 브랜드 스토리, 철학, 세계관, 가치관 등`}
          />
        </div>
        {/* 추가 전달 내용 */}
        <div>
          <Label
            htmlFor="etc"
            className="mb-2 text-base md:text-lg font-bold block"
          >
            {`추가로 전달할 내용이 있으면 자유롭게 기입해주세요. (500자 이내)`}
          </Label>
          <Textarea
            id="etc"
            name="etc"
            className="text-sm md:text-base"
            rows={6}
            maxLength={500}
            value={form.etc}
            onChange={handleChange}
            placeholder={`ex) 추가로 전달할 내용`}
          />
        </div>
        <Button
          className="text-blue-500 hover:text-blue-600 font-bold"
          onClick={handleClickEdit}
          disabled={isEqual(form, originalForm)}
        >
          수정완료
        </Button>
      </div>
    </div>
  );
};

export default MDProductApplyEditPage;
