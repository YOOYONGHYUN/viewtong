import { Dialog } from "@mui/material";
import React, { useState } from "react";
import TermsOfUse from "../user/TermsOfUse";
import PrivacyPolicy from "../user/PrivacyPolicy";
import EmailDenyPolicy from "../user/EmailDenyPolicy";

const Footer = () => {
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showEmailDenyModal, setShowEmailDenyModal] = useState(false);
  const cloudFrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

  return (
    <footer className="bg-black text-white border-t border-gray-200 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <div className="text-lg font-bold mb-2">주식회사 인스피라</div>
            <div className="md:hidden text-lg font-bold mb-2">
              뷰통월드
              <br />
              VIEWTONG WORLD
            </div>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div>대표 : 염지예</div>
                <div>사업자번호 : 552-86-03273</div>
                <div>통신판매번호 : 2025-대전유성-1313</div>
              </div>

              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <div>대표번호 : 010-7409-0526</div>
                <div>이메일 : ceo@viewtongworld.com</div>
              </div>

              <div>
                주소 : 대전광역시 유성구 대학로 99, 산학연교육연구관 W1 별관
                313호 (궁동, 충남대학교)
              </div>
            </div>

            <div className="flex mt-4 space-x-2">
              <button
                onClick={() => setShowAgreementModal(true)}
                className="hover:text-blue-600 cursor-pointer"
              >
                이용약관
              </button>
              <div className="border-r border-gray-300"></div>
              <button
                onClick={() => setShowPrivacyModal(true)}
                className="hover:text-blue-600 cursor-pointer"
              >
                개인정보 처리방침
              </button>
              <div className="border-r border-gray-300"></div>
              <button
                onClick={() => setShowEmailDenyModal(true)}
                className="hover:text-blue-600 cursor-pointer"
              >
                이메일 수집거부
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="w-[160px] mb-4">
              <img
                src={`${cloudFrontUrl}static/assets/img/footer_logo.png`}
                alt="footer_logo"
                className=""
              />
            </div>
            <div className="text-left text-sm">
              COPYRIGHT © VIEWTONG WORLD.
              <br />
              ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={showAgreementModal}
        onClose={() => setShowAgreementModal(false)}
      >
        <TermsOfUse onClose={() => setShowAgreementModal(false)} />
      </Dialog>

      <Dialog
        open={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      >
        <PrivacyPolicy onClose={() => setShowPrivacyModal(false)} />
      </Dialog>

      <Dialog
        open={showEmailDenyModal}
        onClose={() => setShowEmailDenyModal(false)}
      >
        <EmailDenyPolicy onClose={() => setShowEmailDenyModal(false)} />
      </Dialog>
    </footer>
  );
};

export default Footer;
