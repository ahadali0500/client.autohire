type StickySaveBarProps = {
  onSave: () => void;
};

export default function StickySaveBar({ onSave }: StickySaveBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-bg via-bg/95 to-transparent backdrop-blur-md py-2 px-1 flex justify-end border-t border-theme z-40">
      <button
        onClick={onSave}
        className="px-5 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-hover shadow-md hover:shadow-lg transition"
      >
        Save Setting
      </button>
    </div>
  );
}