interface PlayButtonProps {
  onClick: () => void;
}

export const PlayButton = ({ onClick }: PlayButtonProps) => {
  return (
    <div
      className="absolute inset-0 bg-black/20 flex items-center justify-center"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
