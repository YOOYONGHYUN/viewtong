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
import { isEqual, set } from "lodash";
import { Asterisk, Check, ChevronsUpDown, CircleAlert, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  categoryControllerFindAll,
  mediaFileControllerInitializeUpload,
  productsControllerCreate,
  productsControllerFindOne,
  productsControllerUpdate,
  sourcingControllerCreate,
} from "@/queries";
import { useCategoryStore } from "@/stores/category";
import {
  CategoryResponseDto,
  CreateProductDto,
  CreateProductSourcingDtoAplyCn,
  UpdateProductDto,
} from "@/queries/model";
import { useMediaMobile } from "@/lib/mediaQuery";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import QuillEditor from "@/components/common/QuillEditor";
import DOMPurify from "dompurify";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "@/stores/user";

const INITIAL_FORM = {
  category: [] as { id: number; name: string }[],
  brand: "",
  name: "",
  thumbnail1: null as File | null,
  thumbnail1ImgSrc: "",
  thumbnail2: null as File | null,
  thumbnail2ImgSrc: "",
  addImg1: null as File | null,
  addImg1ImgSrc: "",
  addImg2: null as File | null,
  addImg2ImgSrc: "",
  capacity: "",
  price: "",
  offerPrice: "",
  quantity: "",
  inQuantity: "",
  preservation: "",
  country: "",
  container: [] as string[],
  composition: "",
  size: "",
  releaseDate: "",
  usage: "",
  ingredient: "",
  effect: [] as string[],
  recommend: "",
  sellingPoint: "",
  salesChannel: "",
  license: null as File | null,
  licenseImgSrc: "",
  reference: null as File | null,
  referenceImgSrc: "",
  tag: [] as string[],
  editor: "",
};

const INITIAL_CATEGORY = {
  first: { id: undefined, cd: "" },
  second: { id: undefined, cd: "" },
  third: { id: undefined, cd: "" },
  fourth: { id: undefined, cd: "" },
};

export const containerProduct = [
  { id: "Pump", name: "Pump" },
  { id: "Tube", name: "Tube" },
  { id: "Glass", name: "Glass" },
  { id: "Stick", name: "Stick" },
  { id: "Jar", name: "Jar" },
  { id: "Spray/Mist", name: "Spray/Mist" },
  { id: "Dropper", name: "Dropper" },
  { id: "Roll-on", name: "Roll-on" },
  { id: "Pen", name: "Pen" },
  { id: "Pad", name: "Pad" },
  { id: "Sample Sachet", name: "Sample Sachet" },
  { id: "Refill Pouch", name: "Refill Pouch" },
  { id: "Pot", name: "Pot" },
  { id: "Applicator", name: "Applicator" },
];

export const effects = [
  { id: "moisture", name: "수분공급" },
  { id: "nutrient", name: "영양공급" },
  { id: "sensitive", name: "저자극" },
  { id: "trouble", name: "트러블케어" },
  { id: "exfoliation", name: "각질케어" },
  { id: "oilControl", name: "피지케어" },
  { id: "pore", name: "모공케어" },
  { id: "elasticity", name: "피부탄력" },
  { id: "calm", name: "피부진정" },
  { id: "brightening", name: "브라이트닝" },
  { id: "antiAging", name: "안티에이징" },
  { id: "whitening", name: "화이트닝" },
  { id: "balance", name: "유수분밸런스" },
  { id: "highMoisture", name: "고보습" },
  { id: "sunscreen", name: "자외선차단" },
  { id: "makeupBase", name: "메이크업베이스 겸용" },
  { id: "shine", name: "윤기부여" },
];

const ProductRegisterAndEditPage = () => {
  const { id } = useParams();
  const cloudFrontUrl = process.env.REACT_APP_NEW_CLOUDFRONT_URL;
  const isMediaMobile = useMediaMobile();
  const navigate = useNavigate();
  const [originalForm, setOriginalForm] = useState(INITIAL_FORM);
  const [form, setForm] = useState(INITIAL_FORM);
  const [hoveredRemove, setHoveredRemove] = useState<number | null>(null);
  const [category, setCategory] = useState<{
    first: { id: number | undefined; cd: string } | undefined;
    second: { id: number | undefined; cd: string } | undefined;
    third: { id: number | undefined; cd: string } | undefined;
    fourth: { id: number | undefined; cd: string } | undefined;
  }>(INITIAL_CATEGORY);
  const { productCategory, productTag } = useCategoryStore();

  const thumbnail1Ref = useRef<HTMLInputElement>(null);
  const thumbnail2Ref = useRef<HTMLInputElement>(null);
  const addImg1Ref = useRef<HTMLInputElement>(null);
  const addImg2Ref = useRef<HTMLInputElement>(null);
  const licenseRef = useRef<HTMLInputElement>(null);
  const referenceRef = useRef<HTMLInputElement>(null);
  const brandInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const preservationInputRef = useRef<HTMLInputElement>(null);
  const releaseDateInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLButtonElement>(null);
  const [openTag, setOpenTag] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [openLicenseDialog, setOpenLicenseDialog] = useState(false);
  const [previewThumbnailImage, setPreviewThumbnailImage] =
    useState<string>("");

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  console.log("111", form);
  console.log("111", form.tag);

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

      // 3. 상품 데이터 fetch
      const response = await productsControllerFindOne(Number(id));
      if (!response.data) return;

      const data = response.data;

      setForm({
        category: splitAndClean(data.ctgrCd).map((cat) => {
          const id = categoryList.find((item) => item.cd === cat)?.id || 0;

          return {
            id: id || 0,
            name: findCategoryName(cat),
          };
        }),
        brand: data.brandNm,
        name: data.prdctNm,
        thumbnail1: null,
        thumbnail1ImgSrc: data.thumbImgPathVl || "",
        thumbnail2: null,
        thumbnail2ImgSrc: data.thumbImgPath2Vl || "",
        addImg1: null,
        addImg1ImgSrc: data.addImgPath1Vl || "",
        addImg2: null,
        addImg2ImgSrc: data.addImgPath2Vl || "",
        capacity: data.cpctVl || "",
        price: data.prdctAmt || "",
        offerPrice: data.prpslAmt || "",
        quantity: data.rcvQntVl || "",
        inQuantity: data.inRcvQntVl || "",
        preservation: data.rtlTermYmd || "",
        country: data.mnftrNtnNm || "",
        container: splitAndClean(data.bttlShp),
        composition: data.cmpsVl || "",
        size: data.prdctSpcfctVl || "",
        releaseDate: data.rlsDt || "",
        usage: data.useMthdCn || "",
        ingredient: data.mainIgdVl || "",
        effect: splitAndClean(data.mainEffcncVl),
        recommend: data.rcmdtnCustNm || "",
        sellingPoint: data.rcmdtnPntCn || "",
        salesChannel: data.prdctNtslChnVl || "",
        license: null,
        licenseImgSrc: data.lcpmtCertFilePathVl || "",
        reference: null,
        referenceImgSrc: data.explnAtchFilePathVl || "",
        tag: typeof data.tagCd === "string" ? getTagListToList(data.tagCd) : [],
        editor: data.prdctCn || "",
      });

      setOriginalForm({
        category: splitAndClean(data.ctgrCd).map((cat) => {
          const id = categoryList.find((item) => item.cd === cat)?.id || 0;

          return {
            id: id || 0,
            name: findCategoryName(cat),
          };
        }),
        brand: data.brandNm,
        name: data.prdctNm,
        thumbnail1: null,
        thumbnail1ImgSrc: data.thumbImgPathVl || "",
        thumbnail2: null,
        thumbnail2ImgSrc: data.thumbImgPath2Vl || "",
        addImg1: null,
        addImg1ImgSrc: data.addImgPath1Vl || "",
        addImg2: null,
        addImg2ImgSrc: data.addImgPath2Vl || "",
        capacity: data.cpctVl || "",
        price: data.prdctAmt || "",
        offerPrice: data.prpslAmt || "",
        quantity: data.rcvQntVl || "",
        inQuantity: data.inRcvQntVl || "",
        preservation: data.rtlTermYmd || "",
        country: data.mnftrNtnNm || "",
        container: splitAndClean(data.bttlShp),
        composition: data.cmpsVl || "",
        size: data.prdctSpcfctVl || "",
        releaseDate: data.rlsDt || "",
        usage: data.useMthdCn || "",
        ingredient: data.mainIgdVl || "",
        effect: splitAndClean(data.mainEffcncVl),
        recommend: data.rcmdtnCustNm || "",
        sellingPoint: data.rcmdtnPntCn || "",
        salesChannel: data.prdctNtslChnVl || "",
        license: null,
        licenseImgSrc: data.lcpmtCertFilePathVl || "",
        reference: null,
        referenceImgSrc: data.explnAtchFilePathVl || "",
        tag: typeof data.tagCd === "string" ? getTagListToList(data.tagCd) : [],
        editor: data.prdctCn || "",
      });
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
    const cd = productCategory?.find((cat) => cat.id === newValue)?.cd;

    setCategory((prev) => {
      const updated = { ...prev, [selectedKey]: { id: newValue, cd: cd } };
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.category.length === 0) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.error("상품분류군을 선택해주세요.");
      return;
    }

    if (form.brand === "") {
      window.scrollTo({ top: 120, behavior: "smooth" });
      toast.error("브랜드명을 입력해주세요.");
      setTimeout(() => {
        brandInputRef.current?.focus();
      }, 1000);
      return;
    }

    if (form.name === "") {
      window.scrollTo({ top: 120, behavior: "smooth" });
      toast.error("상품명을 입력해주세요.");
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 1000);
      return;
    }

    if (form.thumbnail1ImgSrc === "") {
      window.scrollTo({ top: 300, behavior: "smooth" });
      toast.error("연출컷 이미지를 추가해주세요.");
      setTimeout(() => {
        thumbnail1Ref.current?.click();
      }, 1000);
      return;
    }

    if (form.thumbnail2ImgSrc === "") {
      window.scrollTo({ top: 300, behavior: "smooth" });
      toast.error("제품 누끼컷 이미지를 추가해주세요.");
      setTimeout(() => {
        thumbnail2Ref.current?.click();
      }, 1000);
      return;
    }

    if (form.preservation === "") {
      window.scrollTo({ top: 1000, behavior: "smooth" });
      toast.error("보존기한을 입력해주세요.");
      setTimeout(() => {
        preservationInputRef.current?.focus();
      }, 1000);
      return;
    }

    if (form.releaseDate === "") {
      window.scrollTo({ top: 1500, behavior: "smooth" });
      toast.error("출시일을 입력해주세요.");
      setTimeout(() => {
        releaseDateInputRef.current?.focus();
      }, 1000);
      return;
    }

    const convertTag = form.tag
      .map((tag) => {
        const convertedTag = productTag?.find((t) => t.cdWholNm === tag);
        return convertedTag?.cd;
      })
      .join(",");

    const categoryCdList = form.category
      .map((cat) => {
        if (!cat?.id) return undefined;
        const found = productCategory.find((item) => item.id === cat.id);
        return found?.cd;
      })
      .filter((cd): cd is string => !!cd);

    const createProductDto: CreateProductDto = {
      addImgPath1Vl: form.addImg1ImgSrc,
      addImgPath2Vl: form.addImg2ImgSrc,
      brandNm: form.brand,
      bttlShp: form.container.join(","),
      cmpsVl: form.composition,
      cpctVl: form.capacity,
      ctgrCd: categoryCdList.join(","),
      delYn: "N",
      explnAtchFilePathVl: form.referenceImgSrc,
      rcvQntVl: form.quantity.split("개")[0],
      inRcvQntVl: form.inQuantity.split("개")[0],
      lcpmtCertFilePathVl: form.licenseImgSrc,
      mainEffcncVl: form.effect.join(","),
      mainIgdVl: form.ingredient,
      mnftrNtnNm: form.country,
      prdctAmt: form.price.split("원")[0],
      prdctCn: form.editor,
      prdctNm: form.name,
      prdctNtslChnVl: form.salesChannel,
      prdctSpcfctVl: form.size,
      prpslAmt: form.offerPrice.split("원")[0],
      rcmdtnCustNm: form.recommend,
      rcmdtnPntCn: form.sellingPoint,
      rlsDt: form.releaseDate,
      rtlTermYmd: form.preservation,
      tagCd: convertTag,
      thumbImgPath2Vl: form.thumbnail2ImgSrc,
      thumbImgPathVl: form.thumbnail1ImgSrc,
      useMthdCn: form.usage,
    };

    try {
      await productsControllerCreate(createProductDto);
      toast.success("상품 등록에 성공했습니다.");
      setTimeout(() => {
        navigate(`/brand/product/list`);
      }, 1000);
    } catch (error) {
      toast.error("상품 등록에 실패했습니다.");
    }
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

  const handleChangeFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type:
      | "thumbnail1"
      | "thumbnail2"
      | "addImg1"
      | "addImg2"
      | "license"
      | "reference"
  ) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const response = await mediaFileControllerInitializeUpload({
          entityType: "product",
          fileName: e.target.files[0].name,
          mimeType: e.target.files[0].type,
          size: e.target.files[0].size,
        });

        await uploadFileToS3(e.target.files[0], response.data?.uploadUrl || "");

        setForm((prev) => ({
          ...prev,
          [type]: e.target.files?.[0] || null,
          [`${type}ImgSrc`]: response.data?.imgSrc || "",
        }));

        fileErrors[type] = false;
      } catch (error) {
        fileErrors[type] = true;
        toast.error("파일 업로드에 실패했습니다.");
      }
    } else {
      setForm((prev) => ({
        ...prev,
        [type]: null,
        [`${type}ImgSrc`]: "",
      }));
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

  const handleChangeContainerProduct = (
    checked: string | boolean,
    id: string
  ) => {
    checked
      ? setForm({ ...form, container: [...form.container, id] })
      : setForm({
          ...form,
          container: form.container.filter((container) => container !== id),
        });
  };

  const handleChangeEffect = (checked: string | boolean, id: string) => {
    checked
      ? setForm({ ...form, effect: [...form.effect, id] })
      : setForm({
          ...form,
          effect: form.effect.filter((effect) => effect !== id),
        });
  };

  const handleChangeEditor = (value: string) => {
    setForm({
      ...form,
      editor: value,
    });
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
  };

  const handleCloseLicenseDialog = () => {
    setOpenLicenseDialog(false);
  };

  const handleChangePreviewThumbnailImage = (path: string) => {
    setPreviewThumbnailImage(`${cloudFrontUrl}${path}`);
  };

  const handlePreview = () => {
    setOpenPreview(true);
    setPreviewThumbnailImage(`${cloudFrontUrl}${form.thumbnail1ImgSrc}`);
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tag: prev.tag.filter((t) => t !== tag),
    }));
  };

  const handleEdit = async () => {
    try {
      if (form.category.length === 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        toast.error("상품분류군을 선택해주세요.");
        return;
      }

      if (form.brand === "") {
        window.scrollTo({ top: 120, behavior: "smooth" });
        toast.error("브랜드명을 입력해주세요.");
        setTimeout(() => {
          brandInputRef.current?.focus();
        }, 1000);
        return;
      }

      if (form.name === "") {
        window.scrollTo({ top: 120, behavior: "smooth" });
        toast.error("상품명을 입력해주세요.");
        setTimeout(() => {
          nameInputRef.current?.focus();
        }, 1000);
        return;
      }

      if (form.thumbnail1ImgSrc === "") {
        window.scrollTo({ top: 300, behavior: "smooth" });
        toast.error("연출컷 이미지를 추가해주세요.");
        setTimeout(() => {
          thumbnail1Ref.current?.click();
        }, 1000);
        return;
      }

      if (form.thumbnail2ImgSrc === "") {
        window.scrollTo({ top: 300, behavior: "smooth" });
        toast.error("제품 누끼컷 이미지를 추가해주세요.");
        setTimeout(() => {
          thumbnail2Ref.current?.click();
        }, 1000);
        return;
      }

      if (form.preservation === "") {
        window.scrollTo({ top: 1000, behavior: "smooth" });
        toast.error("보존기한을 입력해주세요.");
        setTimeout(() => {
          preservationInputRef.current?.focus();
        }, 1000);
        return;
      }

      if (form.releaseDate === "") {
        window.scrollTo({ top: 1500, behavior: "smooth" });
        toast.error("출시일을 입력해주세요.");
        setTimeout(() => {
          releaseDateInputRef.current?.focus();
        }, 1000);
        return;
      }

      const convertTag = form.tag
        .map((tag) => {
          const convertedTag = productTag?.find((t) => t.cdWholNm === tag);
          return convertedTag?.cd;
        })
        .join(",");

      const categoryCdList = form.category
        .map((cat) => {
          if (!cat?.id) return undefined;
          const found = productCategory.find((item) => item.id === cat.id);
          return found?.cd;
        })
        .filter((cd): cd is string => !!cd);

      const updateProductDto: UpdateProductDto = {
        addImgPath1Vl: form.addImg1ImgSrc,
        addImgPath2Vl: form.addImg2ImgSrc,
        brandNm: form.brand,
        bttlShp: form.container.join(","),
        cmpsVl: form.composition,
        cpctVl: form.capacity,
        ctgrCd: categoryCdList.join(","),
        delYn: "N",
        explnAtchFilePathVl: form.referenceImgSrc,
        rcvQntVl: form.quantity.split("개")[0],
        inRcvQntVl: form.inQuantity.split("개")[0],
        lcpmtCertFilePathVl: form.licenseImgSrc,
        mainEffcncVl: form.effect.join(","),
        mainIgdVl: form.ingredient,
        mnftrNtnNm: form.country,
        prdctAmt: form.price.split("원")[0],
        prdctCn: form.editor,
        prdctNm: form.name,
        prdctNtslChnVl: form.salesChannel,
        prdctSpcfctVl: form.size,
        prpslAmt: form.offerPrice.split("원")[0],
        rcmdtnCustNm: form.recommend,
        rcmdtnPntCn: form.sellingPoint,
        rlsDt: form.releaseDate,
        rtlTermYmd: form.preservation,
        tagCd: convertTag,
        thumbImgPath2Vl: form.thumbnail2ImgSrc,
        thumbImgPathVl: form.thumbnail1ImgSrc,
        useMthdCn: form.usage,
      };

      await productsControllerUpdate(Number(id), updateProductDto);
      toast.success("상품 수정에 성공했습니다.");
      setTimeout(() => {
        navigate(`/brand/product/view/detail/${id}`);
      }, 1000);
    } catch (error) {
      toast.error("상품 수정에 실패했습니다.");
    }
  };

  const getTagListToList = (tagCd: string | null | undefined) => {
    if (!tagCd) return [];
    const convertToList = tagCd.split(",").map((tag) => tag.trim());
    const tagList = convertToList.map((tag) => {
      return `${
        productTag?.find((productTag) => productTag.cd === tag)?.cdWholNm
      }`;
    });

    return tagList;
  };

  const getTagListToString = (tagCd: string | null | undefined) => {
    if (!tagCd) return "태그 미등록";
    const convertToList = tagCd.split(",").map((tag) => tag.trim());
    const tagList = convertToList.map((tag) => {
      return `#${
        productTag?.find((productTag) => productTag.cd === tag)?.cdNm
      }`;
    });

    return tagList.join(", ");
  };

  const fileErrors = {
    thumbnail1: false,
    thumbnail2: false,
    addImg1: false,
    addImg2: false,
    license: false,
    reference: false,
  };

  console.log("111", previewThumbnailImage);

  return (
    <div className="w-full min-h-screen py-12 px-10 lg:px-20">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex flex-row justify-center md:justify-between items-center text-lg md:text-2xl font-bold text-blue-500">
          <span>{id ? "상품 수정" : "상품 등록"}</span>
          {!isMediaMobile &&
            (id ? (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="font-normal">
                      상품 관리
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="cursor-pointer font-normal"
                      onClick={() => navigate("/brand/product/list")}
                    >
                      상품 리스트
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="cursor-pointer font-normal"
                      onClick={() =>
                        navigate(`/brand/product/view/detail/${id}`)
                      }
                    >
                      상품 상세보기
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold">
                      상품 수정하기
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            ) : (
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink className="font-normal">
                      상품 관리
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold">
                      상품 등록
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            ))}
        </div>

        <div>
          <div>
            <div className="w-full text-xl md:text-xl font-bold flex mt-8 mb-6">
              메인 정보
            </div>
            <div className="space-y-6">
              {/* 카테고리 */}
              <div>
                <Label
                  htmlFor="category"
                  className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-1"
                >
                  <span>카테고리</span>
                  <Asterisk size={10} stroke="red" />
                </Label>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-2">
                  <Select
                    value={category.first?.id?.toString() ?? ""}
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
                    disabled={category.first === undefined}
                    value={category.second?.id?.toString() ?? ""}
                    onValueChange={(value) => handleChangeCategory(1, value)}
                  >
                    <SelectTrigger className="w-full md:w-auto text-sm md:text-base">
                      <SelectValue placeholder="2차 분류" />
                    </SelectTrigger>
                    <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                      {getCategoryOptions(1, category.first?.cd || "").map(
                        (cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id.toString()}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            {cat.cdNm}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <Select
                    disabled={category.second === undefined}
                    value={category.third?.id?.toString() ?? ""}
                    onValueChange={(value) => handleChangeCategory(2, value)}
                  >
                    <SelectTrigger className="w-full md:w-auto text-sm md:text-base">
                      <SelectValue placeholder="3차 분류" />
                    </SelectTrigger>
                    <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                      {getCategoryOptions(2, category.second?.cd || "").map(
                        (cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id.toString()}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            {cat.cdNm}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <Select
                    disabled={category.third === undefined}
                    value={category.fourth?.id?.toString() ?? ""}
                    onValueChange={(value) => handleChangeCategory(3, value)}
                  >
                    <SelectTrigger className="w-full md:w-auto text-sm md:text-base">
                      <SelectValue placeholder="4차 분류" />
                    </SelectTrigger>
                    <SelectContent className="bg-white overflow-y-auto max-h-[300px]">
                      {getCategoryOptions(3, category.third?.cd || "").map(
                        (cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id.toString()}
                            className="cursor-pointer hover:bg-gray-100"
                          >
                            {cat.cdNm}
                          </SelectItem>
                        )
                      )}
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
              <Separator className="bg-gray-200" />
              {/* 브랜드명, 상품명 */}
              <div className="flex flex-row items-center gap-4">
                {/* 브랜드명 */}
                <div className="w-full">
                  <Label
                    htmlFor="brand"
                    className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-1"
                  >
                    <span>브랜드명</span>
                    <Asterisk size={10} stroke="red" />
                  </Label>
                  <Input
                    ref={brandInputRef}
                    name="brand"
                    className="text-sm md:text-base border-gray-300"
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="브랜드명을 입력해주세요."
                  />
                </div>
                {/* 상품명 */}
                <div className="w-full">
                  <Label
                    htmlFor="name"
                    className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-1"
                  >
                    <span>상품명</span>
                    <Asterisk size={10} stroke="red" />
                  </Label>
                  <Input
                    ref={nameInputRef}
                    name="name"
                    className="text-sm md:text-base border-gray-300"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="상품명을 입력해주세요."
                  />
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* 대표이미지 */}
              <div>
                <Label
                  htmlFor="thumbnail1"
                  className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-2"
                >
                  <span>대표 이미지</span>
                  <span className="text-sm text-gray-400 flex flex-row items-center gap-1">
                    <CircleAlert size={14} stroke="gray" /> 권장 사이즈 1000 x
                    1000px
                  </span>
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor="mainImage"
                      className="mb-1 text-sm md:text-base font-bold block flex flex-row items-center gap-1 text-gray-500"
                    >
                      <span>연출컷</span>
                      <Asterisk size={10} stroke="red" />
                    </Label>
                    <Input
                      ref={thumbnail1Ref}
                      id="thumbnail1"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChangeFile(e, "thumbnail1")}
                      className="h-12 file:font-semibold file:bg-primary/10 file:text-primary file:h-full py-0 px-0 border-gray-300"
                    />
                    {fileErrors.thumbnail1 && (
                      <p className="text-red-500 text-sm mt-1">
                        파일 업로드에 실패했습니다.
                      </p>
                    )}
                    {form.thumbnail1 && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(form.thumbnail1)}
                          alt="첨부 이미지 미리보기"
                          className="max-h-40 rounded border"
                        />
                      </div>
                    )}
                    {id && form.thumbnail1ImgSrc && (
                      <div className="mt-2">
                        <img
                          src={`${cloudFrontUrl}${form.thumbnail1ImgSrc}`}
                          alt="첨부 이미지 미리보기"
                          className="max-h-40 rounded border"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="thumbnail2"
                      className="mb-1 text-sm md:text-base font-bold block flex flex-row items-center gap-1 text-gray-500"
                    >
                      <span>제품 누끼컷</span>
                      <Asterisk size={10} stroke="red" />
                    </Label>
                    <Input
                      ref={thumbnail2Ref}
                      id="thumbnail2"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleChangeFile(e, "thumbnail2")}
                      className="h-12 file:font-semibold file:bg-primary/10 file:text-primary file:h-full py-0 px-0 border-gray-300"
                    />
                    {fileErrors.thumbnail2 && (
                      <p className="text-red-500 text-sm mt-1">
                        파일 업로드에 실패했습니다.
                      </p>
                    )}
                    {form.thumbnail2 && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(form.thumbnail2)}
                          alt="첨부 이미지 미리보기"
                          className="max-h-40 rounded border"
                        />
                      </div>
                    )}
                    {id && form.thumbnail2ImgSrc && (
                      <div className="mt-2">
                        <img
                          src={`${cloudFrontUrl}${form.thumbnail2ImgSrc}`}
                          alt="첨부 이미지 미리보기"
                          className="max-h-40 rounded border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* 추가 이미지 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="addImg1"
                    className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-2"
                  >
                    <span>추가 이미지 1</span>
                    <span className="text-sm text-gray-400 flex flex-row items-center gap-1">
                      <CircleAlert size={14} stroke="gray" /> 권장 사이즈 1000 x
                      1000px
                    </span>
                  </Label>
                  <Input
                    id="addImg1"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChangeFile(e, "addImg1")}
                    className="h-12 file:font-semibold file:bg-primary/10 file:text-primary file:h-full py-0 px-0 border-gray-300"
                  />
                  {fileErrors.addImg1 && (
                    <p className="text-red-500 text-sm mt-1">
                      파일 업로드에 실패했습니다.
                    </p>
                  )}
                  {form.addImg1 && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(form.addImg1)}
                        alt="첨부 이미지 미리보기"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  )}
                  {id && form.addImg1ImgSrc && (
                    <div className="mt-2">
                      <img
                        src={`${cloudFrontUrl}${form.addImg1ImgSrc}`}
                        alt="첨부 이미지 미리보기"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="addImg2"
                    className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-2"
                  >
                    <span>추가 이미지 2</span>
                    <span className="text-sm text-gray-400 flex flex-row items-center gap-1">
                      <CircleAlert size={14} stroke="gray" /> 권장 사이즈 1000 x
                      1000px
                    </span>
                  </Label>
                  <Input
                    id="addImg2"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChangeFile(e, "addImg2")}
                    className="h-12 file:font-semibold file:bg-primary/10 file:text-primary file:h-full py-0 px-0"
                  />
                  {fileErrors.addImg2 && (
                    <p className="text-red-500 text-sm mt-1">
                      파일 업로드에 실패했습니다.
                    </p>
                  )}
                  {form.addImg2 && (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(form.addImg2)}
                        alt="첨부 이미지 미리보기"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  )}
                  {id && form.addImg2ImgSrc && (
                    <div className="mt-2">
                      <img
                        src={`${cloudFrontUrl}${form.addImg2ImgSrc}`}
                        alt="첨부 이미지 미리보기"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  )}
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* 용량, 판매가, 제안가*/}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="capacity"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    용량(ml, g)
                  </Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    className="text-sm md:text-base border-gray-300"
                    value={form.capacity}
                    onChange={handleChange}
                    placeholder="ex) 100ml, 500ml, 1000ml 등"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="price"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    판매가(정가) VAT+
                  </Label>
                  <NumericFormat
                    name="price"
                    className="text-sm md:text-base border-gray-300"
                    value={form.price}
                    customInput={Input}
                    thousandSeparator
                    suffix="원"
                    onChange={handleChange}
                    size={100}
                    style={{ minWidth: "200px" }}
                    placeholder="ex) 10,000원"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="offerPrice"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    제안가(유통사 납품가) VAT-
                  </Label>
                  <NumericFormat
                    name="offerPrice"
                    className="text-sm md:text-base border-gray-300"
                    value={form.offerPrice}
                    customInput={Input}
                    thousandSeparator
                    suffix="원"
                    onChange={handleChange}
                    size={100}
                    style={{ minWidth: "200px" }}
                    placeholder="ex) 10,000원"
                  />
                </div>
              </div>
              <Separator className="bg-gray-200" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="quantity"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    입수량[소박스]
                  </Label>
                  <NumericFormat
                    id="quantity"
                    name="quantity"
                    className="text-sm md:text-base border-gray-300"
                    value={form.quantity}
                    customInput={Input}
                    thousandSeparator
                    suffix="개"
                    onChange={handleChange}
                    placeholder="1개의 소박스 내, 입수된 상품 수"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="inQuantity"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    인입수량[1box 아웃박스]
                  </Label>
                  <NumericFormat
                    name="inQuantity"
                    value={form.inQuantity}
                    customInput={Input}
                    thousandSeparator
                    suffix="개"
                    onChange={handleChange}
                    className="text-sm md:text-base border-gray-300"
                    placeholder="1개의 아웃박스 내, 총 상품 수"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="preservation"
                    className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-2"
                  >
                    유통기한 및 사용기한
                    <Asterisk size={10} stroke="red" />
                  </Label>
                  <Input
                    ref={preservationInputRef}
                    name="preservation"
                    className="text-sm md:text-base border-gray-300"
                    value={form.preservation}
                    onChange={handleChange}
                    placeholder="유통기한: 2025.12.25, 개봉 후 사용기한: 36개월"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 상품 정보 */}
          <div>
            <div className="w-full text-xl md:text-xl font-bold flex mt-10 mb-6">
              상품 정보
            </div>
            <div className="space-y-6">
              {/* 제조국 */}
              <div>
                <Label
                  htmlFor="country"
                  className="mb-2 text-base md:text-lg font-bold block"
                >
                  제조국
                </Label>
                <Input
                  id="country"
                  name="country"
                  className="text-sm md:text-base border-gray-300"
                  value={form.country}
                  onChange={handleChange}
                  placeholder="ex) 한국, 미국, 일본 등"
                />
              </div>
              <Separator className="bg-gray-200" />
              {/* 용기 형태 */}
              <div>
                <Label
                  htmlFor="container"
                  className="mb-2 text-base md:text-lg font-bold block"
                >
                  용기 형태
                </Label>
                <div className="grid grid-cols-8 gap-4 border border-gray-300 rounded-lg p-4">
                  {containerProduct.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-row items-center gap-2"
                    >
                      <Checkbox
                        id={product.id}
                        className="border-gray-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 data-[state=checked]:text-white cursor-pointer"
                        checked={form.container.includes(product.id)}
                        onCheckedChange={(checked) => {
                          handleChangeContainerProduct(checked, product.id);
                        }}
                      />
                      <Label className="cursor-pointer" htmlFor={product.id}>
                        {product.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <Separator className="bg-gray-200" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="composition"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    구성
                  </Label>
                  <Input
                    id="composition"
                    name="composition"
                    className="text-sm md:text-base border-gray-300"
                    value={form.composition}
                    onChange={handleChange}
                    placeholder="구성"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="size"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    제품 규격
                  </Label>
                  <Input
                    id="size"
                    name="size"
                    className="text-sm md:text-base border-gray-300"
                    value={form.size}
                    onChange={handleChange}
                    placeholder="낱개, 케이스, 아웃박스 / 가로 mm x 세로 mm x 높이 mm 중량 g"
                  />
                </div>
                <div className="relative">
                  <Label
                    htmlFor="releaseDate"
                    className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-2"
                  >
                    <span>출시일</span>
                    <Asterisk size={10} stroke="red" />
                  </Label>
                  <Input
                    ref={releaseDateInputRef}
                    type="date"
                    id="releaseDate"
                    name="releaseDate"
                    className="text-sm md:text-base border-gray-300"
                    value={form.releaseDate}
                    onChange={handleChange}
                    placeholder="ex) 2025-01-01"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 사용 정보 */}
          <div>
            <div className="w-full text-xl md:text-xl font-bold flex mt-10 mb-6">
              사용 정보
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* 사용 방법 */}
                <div>
                  <Label
                    htmlFor="usage"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    사용 방법
                  </Label>
                  <Input
                    id="usage"
                    name="usage"
                    className="text-sm md:text-base border-gray-300"
                    value={form.usage}
                    onChange={handleChange}
                    placeholder="사용 방법"
                  />
                </div>
                {/* 주요 성분 */}
                <div>
                  <Label
                    htmlFor="ingredient"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    주요 성분
                  </Label>
                  <Input
                    id="ingredient"
                    name="ingredient"
                    className="text-sm md:text-base border-gray-300"
                    value={form.ingredient}
                    onChange={handleChange}
                    placeholder="주요 성분"
                  />
                </div>
              </div>
              <Separator className="bg-gray-200" />
              {/* 주요 효능 */}
              <div>
                <Label
                  htmlFor="effect"
                  className="mb-2 text-base md:text-lg font-bold block"
                >
                  주요 효능
                </Label>
                <div className="grid grid-cols-8 gap-4 border border-gray-300 rounded-lg p-4">
                  {effects.map((effect) => (
                    <div
                      key={effect.id}
                      className="flex flex-row items-center gap-2"
                    >
                      <Checkbox
                        id={effect.id}
                        className="border-gray-400 data-[state=checked]:bg-blue-400 data-[state=checked]:border-blue-400 data-[state=checked]:text-white cursor-pointer"
                        checked={form.effect.includes(effect.id)}
                        onCheckedChange={(checked) => {
                          handleChangeEffect(checked, effect.id);
                        }}
                      />
                      <Label className="cursor-pointer" htmlFor={effect.id}>
                        {effect.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 판매 정보 */}
          <div>
            <div className="w-full text-xl md:text-xl font-bold flex mt-10 mb-6">
              판매 정보
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* 사용 방법 */}
                <div>
                  <Label
                    htmlFor="recommend"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    권유 고객
                  </Label>
                  <Input
                    id="recommend"
                    name="recommend"
                    className="text-sm md:text-base border-gray-300"
                    value={form.recommend}
                    onChange={handleChange}
                    placeholder="권유 고객"
                  />
                </div>
                {/* 셀링 포인트 */}
                <div>
                  <Label
                    htmlFor="sellingPoint"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    셀링 포인트
                  </Label>
                  <Input
                    id="sellingPoint"
                    name="sellingPoint"
                    className="text-sm md:text-base border-gray-300"
                    value={form.sellingPoint}
                    onChange={handleChange}
                    placeholder="셀링 포인트"
                  />
                </div>
                {/* 상품 판매 채널 */}
                <div>
                  <Label
                    htmlFor="salesChannel"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    상품 판매 채널(타 레퍼런스)
                  </Label>
                  <Input
                    id="salesChannel"
                    name="salesChannel"
                    className="text-sm md:text-base border-gray-300"
                    value={form.salesChannel}
                    onChange={handleChange}
                    placeholder="상품 판매 채널(타 레퍼런스)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 기타 정보 */}
          <div>
            <div className="w-full text-xl md:text-xl font-bold flex mt-10 mb-6">
              기타 정보
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="license"
                    className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center"
                  >
                    <span>관련 허가 인증</span>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="size-4"
                      onClick={() => setOpenLicenseDialog(true)}
                    >
                      <CircleAlert />
                    </Button>
                  </Label>
                  <Input
                    id="license"
                    type="file"
                    onChange={(e) => handleChangeFile(e, "license")}
                    className="h-12 file:font-semibold file:bg-primary/10 file:text-primary file:h-full py-0 px-0 border-gray-300"
                  />
                  {fileErrors.license && (
                    <p className="text-red-500 text-sm mt-1">
                      파일 업로드에 실패했습니다.
                    </p>
                  )}
                  {form.license && form.license.type.startsWith("image/") ? (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(form.license)}
                        alt="첨부 이미지 미리보기"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        첨부파일: {form.license?.name}
                      </p>
                    </div>
                  )}
                  {id && form.licenseImgSrc && (
                    <div className="mt-2">
                      <img
                        src={`${cloudFrontUrl}${form.licenseImgSrc}`}
                        alt="첨부 이미지 미리보기"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label
                    htmlFor="reference"
                    className="mb-2 text-base md:text-lg font-bold block flex flex-row items-center gap-2"
                  >
                    <span>소개 자료 첨부</span>
                  </Label>
                  <Input
                    id="reference"
                    type="file"
                    onChange={(e) => handleChangeFile(e, "reference")}
                    className="h-12 file:font-semibold file:bg-primary/10 file:text-primary file:h-full py-0 px-0"
                  />
                  {fileErrors.reference && (
                    <p className="text-red-500 text-sm mt-1">
                      파일 업로드에 실패했습니다.
                    </p>
                  )}
                  {form.reference &&
                  form.reference.type.startsWith("image/") ? (
                    <div className="mt-2">
                      <img
                        src={URL.createObjectURL(form.reference)}
                        alt="첨부 이미지 미리보기"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        첨부파일: {form.reference?.name}
                      </p>
                    </div>
                  )}
                  {id && form.referenceImgSrc && (
                    <div className="mt-2">
                      <img
                        src={`${cloudFrontUrl}${form.referenceImgSrc}`}
                        alt="첨부 이미지 미리보기"
                        className="max-h-40 rounded border"
                      />
                    </div>
                  )}
                </div>
                {/* 제안 문서 */}
                <div>
                  <Label
                    htmlFor="recommend"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    제안 문서
                  </Label>
                  <Input
                    id="recommend"
                    name="recommend"
                    className="text-sm md:text-base border-gray-300"
                    value={form.recommend}
                    onChange={handleChange}
                    placeholder="권유 고객"
                  />
                </div>
                {/* 태그 */}
                <div>
                  <Label
                    htmlFor="tag"
                    className="mb-2 text-base md:text-lg font-bold block"
                  >
                    태그
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        InputProps={{
                          ...params.InputProps,
                          sx: {
                            height: 36,
                            padding: 0,
                            borderRadius: "8px",
                          },
                        }}
                      />
                    )}
                    onChange={(event, value) => {
                      handleChangeTag(value!);
                    }}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#d1d5db",
                      },

                      "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
                        {
                          borderColor: "#d1d5db",
                        },

                      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                        {
                          borderWidth: "3px",
                          borderColor: "#8db5f1",
                        },
                    }}
                  />
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
                </div>
              </div>
              <Separator className="bg-gray-200" />
              <div>
                <Label
                  htmlFor="editor"
                  className="mb-2 text-base md:text-lg font-bold block"
                >
                  내용(Editor)
                </Label>
                <QuillEditor
                  value={form.editor}
                  onChange={handleChangeEditor}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 등록 버튼 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 pt-4">
          <Button
            className="text-blue-500 hover:text-blue-600 font-bold"
            onClick={handlePreview}
          >
            미리보기
          </Button>
          <Button
            disabled={!!id && isEqual(originalForm, form)}
            className="text-blue-500 hover:text-blue-600 font-bold"
            onClick={id ? handleEdit : handleSubmit}
          >
            {id ? "수정하기" : "등록하기"}
          </Button>
        </div>
      </div>
      {/* 관련 허가 인증 dialog */}
      <Dialog open={openLicenseDialog} onClose={handleCloseLicenseDialog}>
        <DialogTitle
          sx={{
            color: "#4a81d4",
            marginBottom: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="text-lg md:text-2xl font-bold">
            관련 허가 인증 안내
          </span>
          <Button
            variant="secondary"
            size="icon"
            className="size-4"
            onClick={handleCloseLicenseDialog}
          >
            <X className="size-8" />
          </Button>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-6 text-sm md:text-base">
            <p>
              하단 내용을 확인 후 관련 서류를 압축하여 하나의 파일로 업로드
              해주세요.
            </p>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="font-bold">일반화장품:</p>
                <ul>
                  <li>A) 표시사항서(상품 표시 문안 시안)</li>
                  <li>
                    B) 완제품시험성적서 (완제품 품질검사 결과에 대한 성적서)
                  </li>
                  <li>
                    상기 두 서류(표시사항서, 완제품시험성적서)는 모든 카테고리
                    화장품에 동일하게 적용
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">기능성화장품:</p>
                <ul>
                  <li>
                    A, B + 기능성화장품심사보고서(기능성심사통지서 또는
                    심사제외품목보고서)
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">의료기기 (EX 질세정제, 콘돔 등):</p>
                <ul>
                  <li>
                    품질검사성적서_의료기기, 표시사항서_의료기기,
                    제품인증관련서류
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">식품:</p>
                <ul>
                  <li>
                    A + 품질검사성적서_식품 (자가품질검사성적서 1부,
                    완제품검사성적서 1부, 총 2부 제출)
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">건강기능식품:</p>
                <ul>
                  <li>
                    자가품질검사성적서, 표시광고심의결과통보서, 품목제조신고증
                    또는 수입신고서, 표시사항서
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">생활화학제품 (드레스퍼퓸 등):</p>
                <ul>
                  <li>표시사항서, 품질검사성적서_생활화학제품</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">의약외품 (치약 등):</p>
                <ul>
                  <li>표시사항서, 의약외품품목허가/신고증, 완제품성적서</li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-bold">잡화 (공산품):</p>
                <ul>
                  <li>표시사항서</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* 미리보기 dialog */}
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        sx={{
          "& .MuiDialog-paper": {
            minWidth: "calc(100% * 0.7)",
            maxWidth: "1000px",
          },
        }}
      >
        <DialogTitle sx={{ color: "#4a81d4" }}>
          <span className="text-lg md:text-2xl font-bold">미리보기</span>
        </DialogTitle>
        <DialogContent>
          {/* 상품 상세 */}
          <div className="flex flex-col gap-10">
            <span className="text-lg md:text-xl font-bold">상품 상세</span>
            <div className="w-full flex flex-col md:flex-row gap-4 md:gap-10">
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <img
                  src={previewThumbnailImage}
                  alt={previewThumbnailImage}
                  className="w-full h-60 md:h-[400px] object-contain"
                />
                <div className="flex flex-row gap-4 justify-center">
                  {form.thumbnail1ImgSrc && (
                    <div
                      className="bg-gray-100 border border-gray-200 rounded-lg p-2"
                      onMouseEnter={() =>
                        handleChangePreviewThumbnailImage(
                          form.thumbnail1ImgSrc ?? ""
                        )
                      }
                    >
                      <img
                        src={`${cloudFrontUrl}${form.thumbnail1ImgSrc}`}
                        alt={"thumbnail1ImgSrc"}
                        className="w-[100px] h-[100px] object-contain"
                      />
                    </div>
                  )}
                  {form.thumbnail2ImgSrc && (
                    <div
                      className="bg-gray-100 border border-gray-200 rounded-lg p-2"
                      onMouseEnter={() =>
                        handleChangePreviewThumbnailImage(
                          form.thumbnail2ImgSrc ?? ""
                        )
                      }
                    >
                      <img
                        src={`${cloudFrontUrl}${form.thumbnail2ImgSrc}`}
                        alt={"thumbnail2ImgSrc"}
                        className="w-[100px] h-[100px] object-contain"
                      />
                    </div>
                  )}
                  {form.addImg1ImgSrc && (
                    <div
                      className="bg-gray-100 border border-gray-200 rounded-lg p-2"
                      onMouseEnter={() =>
                        handleChangePreviewThumbnailImage(
                          form.addImg1ImgSrc ?? ""
                        )
                      }
                    >
                      <img
                        src={`${cloudFrontUrl}${form.addImg1ImgSrc}`}
                        alt={"addImg1ImgSrc"}
                        className="w-[100px] h-[100px] object-contain"
                      />
                    </div>
                  )}
                  {form.addImg2ImgSrc && (
                    <div
                      className="bg-gray-100 border border-gray-200 rounded-lg p-2"
                      onMouseEnter={() =>
                        handleChangePreviewThumbnailImage(
                          form.addImg2ImgSrc ?? ""
                        )
                      }
                    >
                      <img
                        src={`${cloudFrontUrl}${form.addImg2ImgSrc}`}
                        alt={"addImg2ImgSrc"}
                        className="w-[100px] h-[100px] object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <div className="flex flex-col md:flex-row justify-between">
                  <span className="text-sm md:text-base">{form?.name}</span>
                  <span className="text-sm md:text-base">
                    {form?.category.join(", ")}
                  </span>
                </div>
                <Separator className="bg-gray-200" />
                <span className="text-lg md:text-2xl font-bold mt-4">{`[${form?.brand}] ${form?.name}`}</span>
                <table className="w-full h-full mt-4">
                  <tbody>
                    <tr className="h-[60px] border-t border-b border-gray-200">
                      <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                        용량(ml, g)
                      </td>
                      <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                        {form?.container.join(", ")}
                      </td>
                    </tr>
                    <tr className="h-[60px] border-b border-gray-200">
                      <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                        판매가
                      </td>
                      <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                        {`${form?.price}원`}
                      </td>
                    </tr>
                    <tr className="h-[60px] border-b border-gray-200">
                      <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                        제안가
                      </td>
                      <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                        {form?.offerPrice}
                      </td>
                    </tr>
                    <tr className="h-[60px] border-b border-gray-200">
                      <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                        입수량(소박스)
                      </td>
                      <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                        {form?.quantity}
                      </td>
                    </tr>
                    <tr className="h-[60px] border-b border-gray-200">
                      <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                        입수량(1box 아웃박스)
                      </td>
                      <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                        {form?.inQuantity}
                      </td>
                    </tr>
                    <tr className="h-[60px] border-b border-gray-200">
                      <td className="w-[40%] text-center bg-gray-100 text-sm md:text-base">
                        유통기한 및 사용기한
                      </td>
                      <td className="w-full h-full flex justify-center items-center px-4 text-sm md:text-base">
                        {form?.preservation}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="flex flex-col gap-6 mt-10 md:mt-20">
            <span className="text-lg md:text-xl font-bold">상품 정보</span>
            <table className="w-full h-full">
              <tbody>
                <tr className="h-[60px] border-t border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    제조국
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.country}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    용기 형태
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.container.join(", ")}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    구성
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.composition}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    제품 규격
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.size}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    출시일
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.releaseDate}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 사용 정보 */}
          <div className="flex flex-col gap-6 mt-10 md:mt-20">
            <span className="text-lg md:text-xl font-bold">사용 정보</span>
            <table className="w-full h-full">
              <tbody>
                <tr className="h-[60px] border-t border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    사용 방법
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.usage}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    주요 성분
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.ingredient}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    주요 효능
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.effect.join(", ")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 판매 정보 */}
          <div className="flex flex-col gap-6 mt-10 md:mt-20">
            <span className="text-lg md:text-xl font-bold">판매 정보</span>
            <table className="w-full h-full">
              <tbody>
                <tr className="h-[60px] border-t border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    권유 고객
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.recommend}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    셀링 포인트
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.sellingPoint}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    상품 판매 채널
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.salesChannel}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 기타 정보 */}
          <div className="flex flex-col gap-6 mt-10 md:mt-20">
            <span className="text-lg md:text-xl font-bold">기타 정보</span>
            <table className="w-full h-full">
              <tbody>
                <tr className="h-[60px] border-t border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    인허가인증파일
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.license ? (
                      <a
                        href={`${cloudFrontUrl}${form.license}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 font-bold"
                      >
                        다운로드
                      </a>
                    ) : (
                      <span className="text-gray-500">
                        등록된 파일이 없습니다.
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    소개자료
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.reference ? (
                      <a
                        href={`${cloudFrontUrl}${form.reference}`}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 font-bold"
                      >
                        다운로드
                      </a>
                    ) : (
                      <span className="text-gray-500">
                        등록된 파일이 없습니다.
                      </span>
                    )}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    제안문서
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {/* {product?.prdctNtslChnVl ? "제안문서보기" : "미등록"} */}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    태그
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {getTagListToString(form.tag.join(","))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 추가 정보 */}
          <div className="flex flex-col gap-6 mt-10 md:mt-20">
            <span className="text-lg md:text-xl font-bold">추가 정보</span>
            <table className="w-full h-full">
              <tbody>
                <tr className="h-[60px] border-t border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    제조사
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {form.brand}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    회사 소개
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {/* {form.etc} */}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    대표자
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {/* {form.brandStory} */}
                  </td>
                </tr>
                <tr className="h-[60px] border-b border-gray-200">
                  <td className="w-[30%] text-center bg-gray-100 text-sm md:text-base">
                    연락처
                  </td>
                  <td className="w-full h-full flex justify-center items-center px-6 text-sm md:text-base">
                    {/* {form.etc} */}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 상품 정보 */}
          <div className="flex flex-col gap-6 mt-10 md:mt-20">
            <span className="text-lg md:text-xl font-bold">상품 설명</span>
            {form.editor !== "<p><br></p>" ? (
              <div
                className="w-full h-full flex flex-col justify-center items-center bg-gray-100 rounded-lg p-12 text-sm md:text-base"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(form.editor ?? ""),
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 rounded-lg p-12 text-sm md:text-base">
                <span className="text-gray-500">상품 설명이 없습니다.</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductRegisterAndEditPage;
