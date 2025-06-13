import { useMediaMobile } from "@/lib/mediaQuery";
import { useEffect } from "react";
import ReactPlayer from "react-player";

const youtubeUrl = [
  "https://youtu.be/0qmAQpOPqw0",
  "https://youtu.be/-BusdfwyKWo",
  "https://youtu.be/LfDH_d1nZTE",
  "https://youtu.be/ujwgqsepvic",
  "https://youtu.be/FL4XZPcYbMI",
  "https://youtu.be/pqM_6j2w11A",
  "https://youtu.be/jL3iQwcyFmI",
  "https://youtu.be/nUd4MPwrrCg",
  "https://youtu.be/ygPM22stfCM",
];

const EduPage = () => {
  const isMediaMobile = useMediaMobile();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] py-16 px-2 md:px-0">
      <div className="mx-auto max-w-7xl mt-16">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col items-center md:gap-20 gap-10">
          {/* 인트로 카드 */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-primary-600 text-2xl md:text-3xl font-extrabold tracking-tight">
                Viewtong
              </span>
              <span className="text-[#4c6aff] text-2xl md:text-3xl font-extrabold tracking-tight">
                World
              </span>
            </div>
            <div className="w-full md:mt-0 mt-5">
              <img
                src={require("@/assets/images/edu_img.png")}
                alt="edu_main"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* 유튜브 카드 */}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-2 md:mb-20 mb-10">
              <span className="text-primary-600 text-2xl md:text-3xl font-extrabold tracking-tight">
                Viewtong
              </span>
              <span className="text-[#4c6aff] text-2xl md:text-3xl font-extrabold tracking-tight">
                Youtube
              </span>
            </div>
            <div
              className={`w-full grid gap-6 ${
                isMediaMobile ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {youtubeUrl.map((url) => (
                <div
                  key={url}
                  className="rounded-xl overflow-hidden shadow-sm"
                  style={{ aspectRatio: "16/9" }}
                >
                  <ReactPlayer url={url} width="100%" height="100%" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EduPage;
