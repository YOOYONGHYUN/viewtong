import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import ReactPlayer from "react-player/lazy";
import Dialog from "@mui/material/Dialog";
import { TransitionProps } from "@mui/material/transitions";
import { Divider, Slide } from "@mui/material";
import { ChevronRightIcon } from "lucide-react";
import { useMediaMobile } from "@/lib/mediaQuery";
import Marquee from "react-fast-marquee";
import { Button } from "@/components/ui/button";

export const comparisonRows = [
  {
    label: (
      <span className="inline-flex items-center gap-1">거래/상담 방식</span>
    ),
    competitor: "오프라인",
    viewtong: "온라인",
  },
  {
    label: (
      <span className="inline-flex items-center gap-1">유통사 니즈 정보</span>
    ),
    competitor: "비공개",
    viewtong: "공개",
  },
  {
    label: <span className="inline-flex items-center gap-1">유통 단계</span>,
    competitor: "12단계 이상",
    viewtong: "5단계",
  },
  {
    label: (
      <span className="inline-flex items-center gap-1">유통사 추천/매칭</span>
    ),
    competitor: "수동/비공개",
    viewtong: "자동",
  },
  {
    label: (
      <span className="inline-flex items-center gap-1">매칭 소요기간</span>
    ),
    competitor: "평균 15일",
    viewtong: "1일",
  },
];
const HomePage = () => {
  const navigate = useNavigate();
  const [showMainVideo, setShowMainVideo] = useState<{
    open: boolean;
    video: number | null;
  }>({
    open: false,
    video: null,
  });
  const mainVideoRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const [mainVideoWidth, setMainVideoWidth] = useState<number | undefined>(
    undefined
  );
  const isMediaMobile = useMediaMobile();

  const scrollToSection2 = () => {
    section2Ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (mainVideoRef.current) {
      setMainVideoWidth(mainVideoRef.current.offsetWidth);
    }
    // 리사이즈 대응
    const handleResize = () => {
      if (mainVideoRef.current) {
        setMainVideoWidth(mainVideoRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* 메인 섹션 */}
      <section
        style={{
          background: "linear-gradient(104.04deg, #5533FF 0%, #7700B2 100%)",
        }}
        className="relative h-screen flex items-center text-white overflow-hidden"
      >
        <div className="container mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0 flex flex-col items-center md:items-start">
              <div
                className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left tracking-tight"
                style={{ lineHeight: "140%" }}
              >
                대형유통사의 진출
                <br />
                <span className="text-white decoration-green-500 underline decoration-8">
                  뷰통월드
                </span>
                와 함께하세요
                <br /> K-뷰티 B2B 거래 플랫폼
              </div>
              <div className="mt-10 space-x-4">
                <Button
                  className="bg-white text-purple-900 font-bold"
                  size="lg"
                  onClick={() => navigate("/signup")}
                >
                  유통사 MD 가입
                </Button>
                <Button
                  className="bg-white text-purple-900 font-bold"
                  size="lg"
                  onClick={() => navigate("/signup")}
                >
                  브랜드사 가입
                </Button>
              </div>
            </div>
            <div
              ref={mainVideoRef}
              className="relative md:w-1/2 flex justify-center"
            >
              <div
                className="relative w-full aspect-video rounded-lg overflow-hidden shadow-xl cursor-pointer border-4 border-white"
                onClick={() => setShowMainVideo({ open: true, video: 1 })}
              >
                <img
                  src={require("assets/images/main_youtube_1.png")}
                  alt="소개 비디오 썸네일"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute z-[-1] top-[-48%] left-[-17%] hidden md:block"
                style={
                  mainVideoWidth
                    ? { width: mainVideoWidth + mainVideoWidth * 0.3 }
                    : undefined
                }
              >
                <video
                  width="100%"
                  height="100%"
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  className="bg-transparent"
                >
                  <source
                    src={process.env.PUBLIC_URL + "/videos/pattern.mov"}
                    type="video/mov"
                  />
                  <source
                    src={process.env.PUBLIC_URL + "/videos/pattern.webm"}
                    type="video/webm"
                  />
                </video>
              </div>
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
          onClick={scrollToSection2}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </section>

      {/* 두 번째 섹션 */}
      <section ref={section2Ref} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-16 text-3xl md:text-4xl font-bold !leading-tight tracking-tight">
            <span className="text-[rgb(76,106,255)]">뷰통월드</span>
            에서 최적화된
            <br />
            온라인 유통 서비스를 경험하세요
          </div>
          <div className="relative flex flex-col md:flex-row justify-around gap-8">
            {/* 왼쪽 카드 */}
            <div className="bg-white flex flex-col items-center justify-between gap-2 md:gap-4 p-4 md:p-8 rounded-xl">
              <div className="flex justify-center border-4 border-[#4c6aff] p-6 lg:p-14 rounded-full">
                <img
                  src={require("assets/images/cosmetics.png")}
                  alt="화장품 사업가"
                  className="h-14 md:h-21"
                />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-center">
                  화장품 사업가
                </h3>
                <p className="text-gray-600 text-center mt-1 text-sm md:text-base">
                  브랜드사를 위한
                  <br />
                  제안서 작성에서 판로개척까지
                </p>
              </div>
              <div className="flex gap-1 md:gap-2">
                <span className="rounded-[100px] bg-gray-500 text-xs md:text-[16px] font-bold text-white text-center px-2 md:px-4 py-1 md:py-1.5">
                  #자금 절약
                </span>
                <span className="rounded-[100px] bg-gray-500 text-xs md:text-[16px] font-bold text-white text-center px-2 md:px-4 py-1 md:py-1.5">
                  #입점단계 최소화
                </span>
              </div>
            </div>

            {/* 중앙 카드 */}
            <div className="bg-white flex flex-col items-center justify-between gap-2 md:gap-4 p-4 md:p-8 rounded-xl z-0">
              <div className="outer-glow flex justify-center bg-[#4c6aff] p-6 lg:p-14 rounded-full">
                <img
                  src={require("assets/images/v_logo_wh.png")}
                  alt="유통 서비스"
                  className="h-14 md:h-21"
                />
              </div>
              <h3 className="text-base md:text-xl font-bold text-center text-[rgb(76,106,255)] mt-2 md:mt-0">
                뷰티 상품 유통 정보 공유 및
                <br />
                매칭 플랫폼 서비스 제공
              </h3>
              <span className="rounded-[100px] bg-black text-xs md:text-[16px] font-bold text-white text-center px-2 md:px-4 py-1 md:py-1.5">
                특허 출원 제10-2024-013823
              </span>
              <Divider
                orientation={
                  window.innerWidth < 768 ? "vertical" : "horizontal"
                }
                sx={{
                  width: "10%",
                  border: "1px dashed #4c6aff",
                  position: "absolute",
                  top: "27%",
                  left: "27%",
                  "@media (max-width: 768px)": {
                    width: "auto",
                    height: "4.5%",
                    top: "30.7%",
                    left: "50%",
                  },
                  "@media (min-width: 1024px)": {
                    width: "13%",
                    top: "34%",
                    left: "26%",
                  },
                }}
              />
              <Divider
                orientation={isMediaMobile ? "vertical" : "horizontal"}
                sx={{
                  width: "10%",
                  border: "1px dashed #4c6aff",
                  position: "absolute",
                  top: "27%",
                  left: "63%",
                  "@media (max-width: 768px)": {
                    width: "auto",
                    height: "4.5%",
                    top: "64.2%",
                    left: "50%",
                  },
                  "@media (min-width: 1024px)": {
                    width: "13%",
                    top: "34%",
                    left: "61%",
                  },
                }}
              />
            </div>

            {/* 오른쪽 카드 */}
            <div className="bg-white flex flex-col items-center justify-between gap-2 md:gap-4 p-4 md:p-8 rounded-xl">
              <div className="flex justify-center border-4 border-[#4c6aff] p-6 lg:p-14 rounded-full">
                <img
                  src={require("assets/images/box.png")}
                  alt="유통사MD,Buyer"
                  className="h-14 md:h-21"
                />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-center">
                  유통사 MD,Buyer
                </h3>
                <p className="text-gray-600 text-center mt-1 text-sm md:text-base">
                  유통사를 위한
                  <br />
                  뷰티 브랜드 발굴에서 매칭까지
                </p>
              </div>
              <div className="flex gap-1 md:gap-2">
                <span className="rounded-[100px] bg-gray-500 text-xs md:text-[16px] font-bold text-white text-center px-2 md:px-4 py-1 md:py-1.5">
                  #시간 절약
                </span>
                <span className="rounded-[100px] bg-gray-500 text-xs md:text-[16px] font-bold text-white text-center px-2 md:px-4 py-1 md:py-1.5">
                  #상품소싱 효율화
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <div className="text-center mb-10 text-3xl md:text-4xl font-bold tracking-tight">
            왜{" "}
            <span className="font-extrabold text-[rgb(76,106,255)]">
              뷰통월드
            </span>
            여야 하나요?
          </div>
          <div className="w-full max-w-4xl mx-auto overflow-hidden px-6">
            <div className="grid grid-cols-3 bg-white">
              {/* 헤더 */}
              <div className="flex items-center justify-center py-5 px-2 text-center font-bold text-gray-400 text-lg">
                <span className="text-gray-500 text-sm md:text-xl whitespace-pre-line">
                  {isMediaMobile ? "경쟁사\nA사, B사" : "경쟁사 A사, B사"}
                </span>
              </div>
              <div />
              <div className="flex items-center justify-center py-5 px-2 text-center font-extrabold text-[rgb(76,106,255)] text-lg">
                <span className="inline-flex items-center text-sm md:text-xl">
                  VIEWTONG
                  <br />
                  WORLD
                </span>
              </div>
            </div>
            {/* 비교 항목들 */}
            {comparisonRows.map((row, idx) => (
              <div className={`grid grid-cols-3`} key={idx}>
                {/* 경쟁사 */}
                <div
                  className={`relative w-full py-6 px-2 text-center text-gray-900 md:text-xl flex items-center justify-center flex-col font-bold bg-[#ebedf5]`}
                  style={{
                    borderTopLeftRadius: idx === 0 ? "20px" : "0px",
                    borderTopRightRadius: idx === 0 ? "20px" : "0px",
                    borderBottomLeftRadius: idx === 4 ? "20px" : "0px",
                    borderBottomRightRadius: idx === 4 ? "20px" : "0px",
                  }}
                >
                  {row.competitor}
                  {idx !== 4 && (
                    <Divider
                      sx={{
                        position: "absolute",
                        width: "70%",
                        border: "1px dashed #cbcbcb",
                        bottom: "0",
                      }}
                    />
                  )}
                </div>
                {/* 비교 항목 */}
                <div className="py-4 px-2 text-center text-gray-600 font-semibold flex items-center justify-center text-sm">
                  {row.label}
                </div>
                {/* 뷰통월드 */}
                <div
                  className={`relative py-4 px-2 text-center text-white md:text-xl flex items-center justify-center font-bold bg-[rgb(76,106,255)] shadow-lg`}
                  style={{
                    borderTopLeftRadius: idx === 0 ? "20px" : "0px",
                    borderTopRightRadius: idx === 0 ? "20px" : "0px",
                    borderBottomLeftRadius: idx === 4 ? "20px" : "0px",
                    borderBottomRightRadius: idx === 4 ? "20px" : "0px",
                  }}
                >
                  {row.viewtong}
                  {idx !== 4 && (
                    <Divider
                      sx={{
                        position: "absolute",
                        width: "70%",
                        border: "1px dashed #ffffff",
                        bottom: "0",
                      }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 세 번째 섹션 */}
      <section className="flex flex-col items-center bg-gray-100 py-20">
        <div className="text-[#4C6AFF] text-lg md:text-xl font-bold bg-blue-100 px-4 py-2 rounded-full">
          화장품 사업가
        </div>
        <div className="text-3xl md:text-4xl font-bold mt-6 text-center !leading-tight tracking-tight">
          {isMediaMobile ? (
            <>
              <span className="text-[#4C6AFF]">15분 만에</span> 완성되는
              <br />
              입점제안서 초안
            </>
          ) : (
            <>
              <span className="text-[#4C6AFF]">15분 만에</span> 완성되는
              입점제안서 초안
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-20 mt-10 md:mt-20">
          <div
            className="relative w-[80%] md:w-[40%] aspect-video rounded-lg overflow-hidden shadow-xl cursor-pointer border-4 border-white"
            onClick={() => setShowMainVideo({ open: true, video: 2 })}
          >
            <img
              src={require("assets/images/main_youtube_2.png")}
              alt="입점제안서 초안"
              className="w-full h-full object-cover"
            />
          </div>
          {!isMediaMobile && (
            <div className="flex flex-col gap-4">
              <div className="text-3xl font-bold leading-tight tracking-tight">
                입점제안서 자동완성 기능으로
                <br />
                판로개척 기회를 쉽고 빠르게!
              </div>
              <Button
                size="lg"
                className="w-[90%] h-[60px] bg-[#4C6AFF] text-white font-bold rounded-full text-2xl gap-4 mt-4"
              >
                <span>제안문서 작성 바로가기</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-10 md:gap-20 mt-20">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
            <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center bg-[#D6E5FF] rounded-full md:mr-20">
              <img
                src={require("assets/images/Group1.png")}
                alt="입점제안서 초안"
                className="h-16 md:h-21"
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4 leading-tight tracking-tight whitespace-pre-line">
              <span className="text-xl md:text-3xl text-center md:text-left font-bold">
                {`뷰통월드 템플릿을 이용하면\n빠르게 입점제안서가 완성!`}
              </span>
              <span className="text-sm md:text-lg text-center md:text-left font-semibold">
                {`실제 입점에 성공한 전문가들이 제공하는\n템플릿으로 유통 과정이 더욱 간편해집니다.`}
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
            <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center bg-[#faf0c6] rounded-full md:ml-20 md:order-1">
              <img
                src={require("assets/images/Group2.png")}
                alt="입점제안서 초안"
                className="h-16 md:h-21"
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4 leading-tight tracking-tight whitespace-pre-line">
              <span className="text-xl md:text-3xl text-center md:text-left font-bold">
                {`상품을 등록하면\n유통사에 맞는 기획까지`}
              </span>
              <span className="text-sm md:text-lg text-center md:text-left font-semibold">
                {`유통사 입점을 위한 채널별\n맞춤형 컨설팅을 지원합니다.`}
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-0">
            <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center bg-[#e5d9ff] rounded-full md:mr-20">
              <img
                src={require("assets/images/Group3.png")}
                alt="입점제안서 초안"
                className="h-16 md:h-21"
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4 leading-tight tracking-tight whitespace-pre-line">
              <span className="text-xl md:text-3xl text-center md:text-left font-bold">
                {`내 상품을 쉽게 소개할 수 있는\n스마트 매칭 시스템`}
              </span>
              <span className="text-sm md:text-lg text-center md:text-left font-semibold">
                {`유통사의 니즈와 상품 정보를 매칭해\n판로개척까지 한번에!`}
              </span>
            </div>
          </div>
        </div>
        {isMediaMobile && (
          <Button
            size="lg"
            className="w-[80%] h-[60px] bg-[#4C6AFF] text-white font-bold rounded-full text-lg mt-20"
          >
            <span>제안문서 작성 바로가기</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        )}
      </section>

      {/* 네 번째 섹션 */}
      <section className="flex flex-col items-center py-20">
        <div className="text-[#4C6AFF] text-lg md:text-xl font-bold bg-blue-100 px-4 py-2 rounded-full">
          유통사 MD
        </div>
        <div className="text-3xl md:text-4xl font-bold mt-6 text-center !leading-tight tracking-tight">
          {isMediaMobile ? (
            <>
              원하는 상품만
              <br />
              <span className="text-[#4C6AFF]">빠르게 발굴</span>
            </>
          ) : (
            <>
              원하는 상품만 <span className="text-[#4C6AFF]">빠르게 발굴</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-20 mt-10 md:mt-20">
          <div
            className="relative w-[80%] md:w-[40%] aspect-video rounded-lg overflow-hidden shadow-xl cursor-pointer border-4 border-white"
            onClick={() => setShowMainVideo({ open: true, video: 2 })}
          >
            <img
              src={require("assets/images/main_youtube_3.png")}
              alt="유통사 MD 발굴"
              className="w-full h-full object-cover"
            />
          </div>
          {!isMediaMobile && (
            <div className="flex flex-col gap-4">
              <div className="text-3xl font-bold leading-tight tracking-tight">
                MD니즈 기반의 상품소팅,
                <br />
                상품 검색과 매칭을 쉽고 편리하게!
              </div>
              <Button
                size="lg"
                className="w-[90%] h-[60px] bg-[#4C6AFF] text-white font-bold rounded-full text-2xl gap-4 mt-4"
              >
                <span>맞춤상품 발굴하기</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 mt-20">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center bg-[#D6E5FF] rounded-full">
              <img
                src={require("assets/images/Group4.png")}
                alt="상품 발굴"
                className="h-16 md:h-21"
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4 leading-tight tracking-tight whitespace-pre-line">
              <span className="text-xl md:text-3xl text-center md:text-left font-bold">
                {`니즈를 반영한 상품 발굴`}
              </span>
              <span className="text-sm md:text-lg text-center font-semibold">
                {`유통사 조건에 맞는\n상품 발굴을 시작하세요.`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center bg-[#faf0c6] rounded-full">
              <img
                src={require("assets/images/Group5.png")}
                alt="브랜드 탐색"
                className="h-16 md:h-21"
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4 leading-tight tracking-tight whitespace-pre-line">
              <span className="text-xl md:text-3xl text-center font-bold">
                {`선별된 브랜드 탐색`}
              </span>
              <span className="text-sm md:text-lg text-center font-semibold">
                {`뷰통월드가 검증한 브랜드를 한눈에\n확인하고 선택하세요.`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center bg-[#e5d9ff] rounded-full">
              <img
                src={require("assets/images/Group6.png")}
                alt="큐레이션 및 컨설팅"
                className="h-16 md:h-21"
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4 leading-tight tracking-tight whitespace-pre-line">
              <span className="text-xl md:text-3xl text-center font-bold">
                {`큐레이션 및 컨설팅`}
              </span>
              <span className="text-sm md:text-lg text-center font-semibold">
                {`스마트 매칭 시스템으로\n니즈에 맞는 브랜드를 추천해드립니다.`}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] flex items-center justify-center bg-[#e5d9ff] rounded-full">
              <img
                src={require("assets/images/Group7.png")}
                alt="입점제안서 초안"
                className="h-16 md:h-21"
              />
            </div>
            <div className="flex flex-col gap-2 md:gap-4 leading-tight tracking-tight whitespace-pre-line">
              <span className="text-xl md:text-3xl text-center font-bold">
                {`상품 검수 및 발주, 배송까지`}
              </span>
              <span className="text-sm md:text-lg text-center font-semibold">
                {`전문 물류 서비스로 효율적인 발주와\n배송을 원스톱으로 처리하세요.`}
              </span>
            </div>
          </div>
        </div>
        {isMediaMobile && (
          <Button
            size="lg"
            className="w-[80%] h-[60px] bg-[#4C6AFF] text-white font-bold rounded-full text-lg mt-20"
          >
            <span>맞춤상품 발굴하기</span>
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        )}
      </section>

      {/* 다섯 번째 섹션 */}
      <section className="flex flex-col items-center bg-gray-100 py-20">
        <div className="text-3xl md:text-4xl font-bold text-center !leading-tight tracking-tight">
          함께하는 분들의
          <br />
          <span className="text-[#4C6AFF]">다양한 이야기</span>를 들어보세요
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 mt-20">
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-[#4b6cf1] text-white rounded-lg py-4 px-6 text-center font-bold text-xl whitespace-pre-line relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-16px] after:w-0 after:h-0 after:border-l-[16px] after:border-r-[16px] after:border-t-[16px] after:border-l-transparent after:border-r-transparent after:border-t-[#4b6cf1]">
              <span>{`카*오톡 선물하기 입점\n뷰통월드와 함께 성공했어요!`}</span>
            </div>
            <div className="w-[150px] h-[150px] flex items-center justify-center bg-[#D6E5FF] rounded-full">
              <img
                src={require("assets/images/memoji1.png")}
                alt="A 브랜드사 미모지"
                className="h-16 md:h-21"
              />
            </div>
            <span className="text-xl md:text-3xl text-center md:text-left font-bold">
              {`A 브랜드사`}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-[#4b6cf1] text-white rounded-lg py-4 px-6 text-center font-bold text-xl whitespace-pre-line md:order-1 relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-16px] md:after:top-[-16px] after:w-0 after:h-0 after:border-l-[16px] after:border-r-[16px] after:border-t-[16px] md:after:border-t-[0px] md:after:border-b-[16px] after:border-l-transparent after:border-r-transparent after:border-t-[#4b6cf1] md:after:border-b-[#4b6cf1]">
              <span>{`원하는 상품을 빠르게 찾아서\n시즌 행사를 성공적으로 \n마무리 할 수 있었어요!`}</span>
            </div>
            <div className="w-[150px] h-[150px] flex items-center justify-center bg-[#faf0c6] rounded-full">
              <img
                src={require("assets/images/memoji2.png")}
                alt="유통사 MD 미모지"
                className="h-16 md:h-21"
              />
            </div>
            <span className="text-xl md:text-3xl text-center font-bold">
              {`유통사 MD`}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="bg-[#4b6cf1] text-white rounded-lg py-4 px-6 text-center font-bold text-xl whitespace-pre-line relative after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-16px] after:w-0 after:h-0 after:border-l-[16px] after:border-r-[16px] after:border-t-[16px] after:border-l-transparent after:border-r-transparent after:border-t-[#4b6cf1]">
              <span>{`제안서 기획도 쉽게 이용하고\n상품 판매처 확보까지 했어요!`}</span>
            </div>
            <div className="w-[150px] h-[150px] flex items-center justify-center bg-[#e5d9ff] rounded-full">
              <img
                src={require("assets/images/memoji3.png")}
                alt="B 브랜드사 미모지"
                className="h-16 md:h-21"
              />
            </div>
            <span className="text-xl md:text-3xl text-center font-bold">
              {`B 브랜드사`}
            </span>
          </div>
        </div>
      </section>

      {/* marquee 섹션 */}
      <section className="flex flex-col items-center py-20">
        <div className=" text-3xl md:text-4xl font-bold text-center !leading-tight tracking-tight">
          <span className="text-[#4C6AFF]">다양한 파트너</span>들과
          <br />
          함께 하고 있습니다
        </div>
        <div className="w-[100%] flex flex-col items-center justify-center gap-10 md:gap-20 mt-20 overflow-hidden">
          <Marquee autoFill gradient gradientWidth={isMediaMobile ? 0 : 400}>
            <img
              src={require("assets/images/partner_logo/01.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/02.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/03.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/04.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-4"
            />
            <img
              src={require("assets/images/partner_logo/05.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/06.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/07.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/08.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/09.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
          </Marquee>
          <Marquee
            autoFill
            direction="right"
            gradient
            gradientWidth={isMediaMobile ? 0 : 400}
          >
            <img
              src={require("assets/images/partner_logo/10.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/11.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/12.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/13.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/14.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/15.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/16.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/17.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/18.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
          </Marquee>
          <Marquee autoFill gradient gradientWidth={isMediaMobile ? 0 : 400}>
            <img
              src={require("assets/images/partner_logo/19.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/20.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/21.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/22.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/23.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/24.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/25.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/26.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
            <img
              src={require("assets/images/partner_logo/27.png")}
              alt="파트너 이미지"
              className="h-[30px] mx-6"
            />
          </Marquee>
        </div>
      </section>

      {/* 신청 섹션 */}
      <section
        className="flex flex-col items-center py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${require("assets/images/back4.png")})`,
        }}
      >
        <div className="text-3xl md:text-4xl mt-6 text-center !leading-tight tracking-tight text-white">
          대형 유통사의 진출 <br />
          <span className="font-bold">뷰통월드와 함께하세요!</span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 mt-10">
          <Button
            size="lg"
            className="w-[200px] h-[60px] bg-white text-black font-bold rounded-full text-lg"
            onClick={() => navigate("/signup")}
          >
            유통사 MD 가입
          </Button>
          <Button
            size="lg"
            className="w-[200px] h-[60px] bg-white text-black font-bold rounded-full text-lg"
            onClick={() => navigate("/signup")}
          >
            브랜드사 가입
          </Button>
          <Button
            size="lg"
            className="w-[200px] h-[60px] bg-transparent border border-white text-white font-bold rounded-full text-lg"
            onClick={() => navigate("/contact")}
          >
            서비스 문의하기
          </Button>
        </div>
      </section>

      <Dialog
        open={showMainVideo.open}
        slots={{
          transition: Transition,
        }}
        onClose={() => setShowMainVideo({ open: false, video: null })}
        sx={{
          "& .MuiDialog-paper": {
            maxWidth: "100%",
          },
        }}
      >
        <ReactPlayer
          url={
            showMainVideo.video === 1
              ? "https://www.youtube.com/watch?v=jRa278OVZx8"
              : "https://www.youtube.com/watch?v=i2CPEc-LkXk"
          }
          style={{
            backgroundColor: "#000000",
          }}
        />
      </Dialog>
    </div>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" timeout={5000} ref={ref} {...props} />;
});

export default HomePage;
