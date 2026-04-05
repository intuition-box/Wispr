import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSwipeEngine } from "@/hooks/useSwipeEngine";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { usePublishProfile } from "@/hooks/usePublishProfile";
import { useComponentVoting } from "@/hooks/useComponentVoting";
import { getQuestion, loadTree } from "@/lib/decisionTree";
import { CardDeck } from "@/components/CardDeck";
import { SwipeButtons } from "@/components/SwipeButtons";
import { ProgressBar } from "@/components/ProgressBar";
import { PhaseLabel } from "@/components/PhaseLabel";
import { ProfileCard } from "@/components/ProfileCard";
import { WalletConnect } from "@/components/WalletConnect";
import { PublishButton } from "@/components/PublishButton";
import { ComponentSwipeCard } from "@/components/ComponentSwipeCard";
import { Logo, WispearLogoAnimated } from "@wispr/ui";

export default function SwipeFlow() {
  const { state, currentQuestion, profile, progress, swipe, reset } =
    useSwipeEngine();
  const { wallet, isConnected, loading: walletLoading, error: walletError } =
    useWalletConnection();
  const {
    state: publishState,
    publish,
    reset: resetPublish,
  } = usePublishProfile();

  const [showComponents, setShowComponents] = useState(false);

  const tree = useMemo(() => loadTree(), []);
  const voting = useComponentVoting(profile?.role ?? "full-stack-web3");

  const nextQuestionLike = currentQuestion
    ? getQuestion(tree, currentQuestion.next.like)
    : null;
  const nextQuestionDislike = currentQuestion
    ? getQuestion(tree, currentQuestion.next.dislike)
    : null;
  const peekQuestion = nextQuestionLike ?? nextQuestionDislike;

  const handleStartOver = () => {
    resetPublish();
    reset();
    setShowComponents(false);
  };

  // ── Swipe phase (role + maturity) ──────────────────────────
  if (state.phase !== "result" && currentQuestion) {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <div className="flex flex-col items-center gap-4 px-7 pt-14 pb-4">
          <PhaseLabel phase={state.phase} />
          <ProgressBar progress={progress} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-7 pb-8">
          <CardDeck
            currentQuestion={currentQuestion}
            nextQuestion={peekQuestion}
            onSwipe={swipe}
          />
          <SwipeButtons onSwipe={swipe} />
        </div>

        <div className="text-center pb-8">
          <span className="text-[11px] text-ink-muted tracking-wide">
            ← swipe left for no · swipe right for yes →
          </span>
        </div>
      </div>
    );
  }

  // ── Component voting — summary ─────────────────────────────
  if (showComponents && profile && voting.isComplete) {
    const forVotes = voting.votes.filter((v) => v.direction === "for");
    const againstVotes = voting.votes.filter((v) => v.direction === "against");

    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <div className="flex-1 flex flex-col items-center px-7 py-14 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6 w-full max-w-[400px]"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <motion.div
                className="inline-block"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 15 }}
              >
                <Logo variant="icon" theme="dark" width={48} height={53} />
              </motion.div>
              <h1 className="font-display text-[26px] text-ink font-bold">
                Your picks for {voting.useCase.label}
              </h1>
            </div>

            {/* Useful votes */}
            {forVotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="w-full"
              >
                <div className="text-[11px] text-green font-bold tracking-[0.1em] uppercase mb-2.5 px-1">
                  Agree ({forVotes.length})
                </div>
                <div className="bg-card rounded-2xl border border-line overflow-hidden divide-y divide-line">
                  {forVotes.map((vote) => (
                    <div
                      key={vote.component.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span className="text-[16px] leading-none">{vote.component.typeEmoji}</span>
                      <span className="text-[13px] text-ink font-medium flex-1">
                        {vote.component.name}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider text-green bg-green/10 px-2 py-0.5 rounded-md">
                        ✓
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Skipped votes */}
            {againstVotes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="w-full"
              >
                <div className="text-[11px] text-red font-bold tracking-[0.1em] uppercase mb-2.5 px-1">
                  Disagree ({againstVotes.length})
                </div>
                <div className="bg-card/50 rounded-2xl border border-red/10 overflow-hidden divide-y divide-line/50">
                  {againstVotes.map((vote) => (
                    <div
                      key={vote.component.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span className="text-[16px] leading-none">{vote.component.typeEmoji}</span>
                      <span className="text-[13px] text-ink font-medium flex-1">
                        {vote.component.name}
                      </span>
                      <span className="text-[10px] font-bold tracking-wider text-red bg-red/10 px-2 py-0.5 rounded-md">
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-4 w-full pt-2"
            >
              {isConnected && wallet && (
                <>
                  {voting.submitState.status === "idle" && forVotes.length > 0 && (
                    <button
                      onClick={() => voting.submit(wallet)}
                      className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold text-[14px] py-3.5 rounded-2xl shadow-glow-accent hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Invest in your wisdom
                    </button>
                  )}

                  {voting.submitState.status === "submitting" && (
                    <div className="flex items-center gap-3 py-3">
                      <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                      <span className="text-[13px] text-ink-muted">
                        Depositing votes on-chain...
                      </span>
                    </div>
                  )}

                  {voting.submitState.status === "success" && (
                    <div className="w-full flex flex-col items-center gap-5">
                      <div className="w-full flex flex-col items-center gap-3 bg-green/5 rounded-2xl p-5 border border-green/10">
                        <div className="flex items-center gap-2 text-green font-bold text-[14px]">
                          <span>✓</span> Wisdom recorded on-chain
                        </div>
                        <a
                          href={voting.submitState.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] text-accent hover:underline font-medium"
                        >
                          View on Explorer →
                        </a>
                        <span className="text-[11px] text-ink-muted font-mono bg-bg rounded-lg px-3 py-1.5">
                          {voting.submitState.txHash.slice(0, 10)}...
                          {voting.submitState.txHash.slice(-8)}
                        </span>
                      </div>

                      <a
                        href={`https://app.wispear.ai/dashboard/${wallet.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-ink-inverse font-bold text-[15px] py-4 rounded-2xl shadow-glow transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Track your wisdom PNL →
                      </a>
                    </div>
                  )}

                  {voting.submitState.status === "error" && (
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-[12px] text-red text-center max-w-[280px]">
                        {voting.submitState.message}
                      </span>
                      <button
                        onClick={() => voting.submit(wallet)}
                        className="text-[13px] text-accent hover:underline font-semibold bg-transparent"
                      >
                        Try again
                      </button>
                    </div>
                  )}
                </>
              )}

              {voting.submitState.status !== "success" && (
                <button
                  onClick={handleStartOver}
                  className="text-[13px] text-ink-muted hover:text-ink-secondary transition-colors bg-transparent"
                >
                  ← Start over
                </button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Component voting — swiping ─────────────────────────────
  if (showComponents && profile) {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        {/* Top bar with logo */}
        <div className="px-5 pt-5">
          <Logo variant="icon" theme="dark" width={28} height={31} />
        </div>

        {/* Context header */}
        <div className="flex flex-col items-center gap-5 px-7 pt-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-soft border border-accent/10 text-[10px] font-bold tracking-[0.12em] uppercase text-accent">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-soft" />
              Context
            </span>
            <h2 className="text-[22px] font-display font-bold text-ink text-center leading-tight">
              {voting.useCase.label}
            </h2>
            <p className="text-[13px] text-ink-muted">
              Is this tool useful for you?
            </p>
          </motion.div>
          <ProgressBar progress={voting.progress} />
        </div>

        {/* Card deck */}
        <div className="flex-1 flex flex-col items-center justify-center px-7 pb-8">
          <div className="relative w-full max-w-[380px] h-[280px] mx-auto my-2">
            {voting.nextComponent && (
              <ComponentSwipeCard
                key={voting.nextComponent.id}
                component={voting.nextComponent}
                onSwipe={() => {}}
                isFront={false}
              />
            )}
            <AnimatePresence mode="popLayout">
              {voting.currentComponent && (
                <ComponentSwipeCard
                  key={voting.currentComponent.id}
                  component={voting.currentComponent}
                  onSwipe={voting.swipe}
                  isFront
                />
              )}
            </AnimatePresence>
          </div>
          <SwipeButtons onSwipe={voting.swipe} />
        </div>

        {/* Skip — full width bottom */}
        <div className="px-7 pb-8">
          <button
            onClick={voting.skip}
            className="w-full py-3.5 rounded-2xl bg-bg-raised border border-line hover:border-line-strong text-[14px] font-medium text-ink-muted hover:text-ink-secondary shadow-xs hover:shadow-sm active:scale-[0.98] transition-all duration-200"
          >
            Skip — I don't know
          </button>
        </div>
      </div>
    );
  }

  // ── Result phase ───────────────────────────────────────────
  if (profile) {
    const handlePublish = () => {
      if (wallet && profile) publish(wallet, profile);
    };

    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <div className="flex-1 flex flex-col items-center justify-center px-7 gap-6 py-14">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-7 w-full max-w-[400px]"
            >
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
                >
                  <WispearLogoAnimated mode="ambient" theme="dark" className="h-28 w-auto" />
                </motion.div>
                <h1 className="font-display text-[32px] text-ink font-bold -mt-2">
                  Bravo!
                </h1>
              </div>

              <ProfileCard profile={profile} />

              <p className="text-[14px] text-ink-secondary text-center max-w-[300px] leading-[1.6]">
                You are a{" "}
                <strong className="text-ink font-semibold">
                  {profile.role.replace(/-/g, " ")}
                </strong>{" "}
                with an{" "}
                <strong className="text-ink font-semibold">{profile.level}</strong>{" "}
                level in AI.
              </p>

              <div className="w-12 h-px bg-line-strong" />

              <WalletConnect />

              {isConnected && walletLoading && (
                <div className="flex items-center gap-2 py-2">
                  <div className="w-5 h-5 border-2 border-pear border-t-transparent rounded-full animate-spin" />
                  <span className="text-[13px] text-ink-muted">Setting up contract...</span>
                </div>
              )}

              {isConnected && walletError && (
                <span className="text-[12px] text-red text-center max-w-[280px]">
                  Wallet error: {walletError}
                </span>
              )}

              {isConnected && wallet && (
                <>
                  {publishState.status !== "success" && (
                    <PublishButton
                      status={publishState.status}
                      txHash={undefined}
                      explorerUrl={undefined}
                      errorMessage={
                        publishState.status === "error"
                          ? publishState.message
                          : undefined
                      }
                      onPublish={handlePublish}
                    />
                  )}

                  {publishState.status === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex flex-col items-center gap-5"
                    >
                      <div className="flex flex-col items-center gap-2 bg-green/5 rounded-2xl px-6 py-4 border border-green/10">
                        <span className="text-green font-bold text-[13px]">
                          ✓ Profile published
                        </span>
                        <a
                          href={publishState.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-accent hover:underline font-medium"
                        >
                          View on Explorer →
                        </a>
                      </div>

                      <button
                        onClick={() => setShowComponents(true)}
                        className="w-full max-w-[320px] flex items-center justify-center gap-2.5 bg-pear hover:bg-pear-hover text-ink-inverse font-bold text-[15px] py-4 rounded-2xl shadow-glow transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 animate-glow-pulse"
                      >
                        Share your wisdom →
                      </button>
                    </motion.div>
                  )}
                </>
              )}

              <button
                onClick={handleStartOver}
                className="text-[13px] text-ink-muted hover:text-ink-secondary transition-colors bg-transparent mt-2"
              >
                ← Start over
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return null;
}
