interface EmailDenyPolicyProps {
  onClose: () => void;
}

const EmailDenyPolicy = ({ onClose }: EmailDenyPolicyProps) => {
  return (
    <div className="modal-content rounded-lg shadow-lg bg-white overflow-hidden max-w-2xl mx-auto">
      <div className="modal-header flex justify-between items-center px-6 py-4 border-b">
        <h5 className="modal-title text-xl font-semibold text-gray-900">
          이메일주소무단수집거부
        </h5>
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 transition"
          aria-label="Close"
          onClick={onClose}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <path
              d="M6 6l8 8M14 6l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <div className="modal-body px-6 py-6 max-h-[70vh] overflow-y-auto text-sm text-gray-800 leading-relaxed space-y-2">
        {/* 약관 본문 시작 */}
        <p>
          본 서비스(웹 등)에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그
          밖의 기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를
          위반시 정보통신망법에 의해 형사처벌됨을 유념하시기 바랍니다. 본
          홈페이지에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의
          기술적 장치를 이용하여 무단으로 수집되는 것을 거부하며, 이를 위반시
          정보통신망 이용촉진 및 정보보호 등에 관한 법률 제50조의 2 규정에
          의하여 1년 이하의 징역 또는 1천만원 이하의 벌금형에 처함을 유념하시기
          바랍니다.
        </p>
        <div style={{ margin: "16px 0" }} />
        <p>정보통신망법 제50조의2 (전자우편주소의 무단 수집행위 등 금지)</p>
        <p>
          ● 누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷
          홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램 그 밖의 기술적
          장치를 이용하여 전자우편주소를 수집하여서는 아니된다.
        </p>
        <p>
          ● 누구든지 제1항의 규정을 위반하여 수집된 전자우편주소를
          판매·유통하여서는 아니된다.
        </p>
        <p>
          ● 누구든지 제1항 및 제2항의 규정에 의하여 수집·판매 및 유통이 금지된
          전자우편주소임을 알고 이를 정보전송에 이용하여서는 아니된다.
        </p>
      </div>
    </div>
  );
};

export default EmailDenyPolicy;
