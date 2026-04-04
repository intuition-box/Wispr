
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt();

  if (!canInstall) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 glass border border-line rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 max-w-[360px]">
      <span className="text-sm text-ink font-medium">
        Install WisPear for a better experience
      </span>
      <button
        onClick={promptInstall}
        className="bg-pear text-ink-inverse text-xs font-semibold px-4 py-2 rounded-lg border-none shrink-0"
      >
        Install
      </button>
    </div>
  );
}
