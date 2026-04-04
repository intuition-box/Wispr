
import type { Profile } from "@wispr/ontology";
import { Logo } from "@wispr/ui";

interface ProfileCardProps {
  profile: Profile;
}

const ROLE_LABELS: Record<string, string> = {
  "full-stack-web3": "Full Stack Web3 Developer",
  "smart-contract-dev": "Smart Contract Developer",
  "frontend-dev": "Frontend Developer",
  "backend-dev": "Backend Developer",
  designer: "Designer",
  "product-manager": "Product Manager",
  founder: "Founder",
};

const LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

const ROLE_EMOJI: Record<string, string> = {
  "full-stack-web3": "🌐",
  "smart-contract-dev": "📜",
  "frontend-dev": "🎨",
  "backend-dev": "⚙️",
  designer: "✏️",
  "product-manager": "📋",
  founder: "🚀",
};

const LEVEL_STYLE: Record<string, string> = {
  beginner: "bg-green-soft text-green",
  intermediate: "bg-accent-soft text-accent",
  advanced: "bg-pear-soft text-pear",
  expert: "bg-red-soft text-red",
};

export function ProfileCard({ profile }: ProfileCardProps) {
  const roleLabel = ROLE_LABELS[profile.role] ?? profile.role;
  const levelLabel = LEVEL_LABELS[profile.level] ?? profile.level;
  const emoji = ROLE_EMOJI[profile.role] ?? "👤";
  const levelStyle = LEVEL_STYLE[profile.level] ?? "bg-accent-soft text-accent";

  return (
    <div className="w-full max-w-[380px] mx-auto bg-card rounded-3xl border border-line shadow-md p-8 flex flex-col items-center gap-5 noise relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-pear/5 to-transparent pointer-events-none" />

      {/* Brand watermark */}
      <div className="absolute top-3 right-3 opacity-30">
        <Logo variant="icon" theme="dark" width={32} height={35} />
      </div>

      <div className="relative z-10 w-20 h-20 rounded-2xl bg-bg-raised flex items-center justify-center border border-line shadow-xs">
        <span className="text-4xl">{emoji}</span>
      </div>
      <div className="relative z-10 text-center">
        <h2 className="font-display text-[22px] text-ink mb-3 font-bold">
          {roleLabel}
        </h2>
        <span className={`inline-flex items-center px-4 py-2 rounded-full text-[13px] font-bold tracking-wide ${levelStyle}`}>
          {levelLabel} in AI
        </span>
      </div>
    </div>
  );
}
