"use client";

const LoadingOverlay = ({ text = "Processing..." }: { text?: string }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-card border border-theme p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl animate-fade-in-up">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <span className="text-base font-medium mt-2">{text}</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;
