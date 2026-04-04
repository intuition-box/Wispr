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

export default function SwipeFlow() {
  const { state, currentQuestion, profile, progress, swipe, reset } =
    useSwipeEngine();
  const { wallet, isConnected, loading: walletLoading, error: walletError } = useWalletConnection();
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

  // Swipe phase (role + maturity questions)
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

  // Component voting phase
  if (showComponents && profile) {
    if (voting.isComplete) {
      const forCount = voting.votes.filter((v) => v.direction === "for").length;

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
                <div className="text-center">
                  <motion.span
                    className="inline-block text-4xl mb-3"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    🗳️
                  </motion.span>
                  <h1 className="font-display text-[28px] text-ink font-bold">
                    Votes ready!
                  </h1>
                  <p className="text-[14px] text-ink-secondary mt-2">
                    You marked{" "}
                    <strong className="text-ink">{forCount}</strong> component
                    {forCount !== 1 ? "s" : ""} as useful for{" "}
                    <strong className="text-ink">{voting.useCase.label}</strong>.
                  </p>
                </div>

                {/* Vote summary */}
                <div className="w-full bg-card rounded-2xl border border-line p-5 space-y-3">
                  {voting.votes.map((vote) => (
                    <div
                      key={vote.component.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {vote.component.typeEmoji}
                        </span>
                        <span className="text-[13px] text-ink font-medium">
                          {vote.component.name}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          vote.direction === "for"
                            ? "bg-green-soft text-green"
                            : "bg-red-soft text-red"
                        }`}
                      >
                        {vote.direction === "for" ? "USEFUL" : "SKIP"}
                      </span>
                    </div>
                  ))}
                </div>

                {isConnected && wallet && (
                  <>
                    {voting.submitState.status === "idle" && forCount > 0 && (
                      <button
                        onClick={() => voting.submit(wallet)}
                        className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold text-[14px] px-7 py-3.5 rounded-2xl shadow-glow-accent hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>⛓️</span>
                        Signal on-chain
                      </button>
                    )}

                    {voting.submitState.status === "submitting" && (
                      <div className="flex flex-col items-center gap-3 py-2">
                        <div className="w-7 h-7 border-2 border-pear border-t-transparent rounded-full animate-spin" />
                        <span className="text-[13px] text-ink-muted">
                          Depositing votes on-chain...
                        </span>
                      </div>
                    )}

                    {voting.submitState.status === "success" && (
                      <div className="flex flex-col items-center gap-3 bg-green-soft rounded-2xl p-5 border border-green/10">
                        <div className="flex items-center gap-2 text-green font-bold text-[14px]">
                          <span>✓</span> Votes recorded on-chain!
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

                <button
                  onClick={() => {
                    resetPublish();
                    reset();
                    setShowComponents(false);
                  }}
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

    // Component swiping
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        <div className="flex flex-col items-center gap-4 px-7 pt-14 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[11px] text-ink-muted tracking-wider uppercase">
              In the context of
            </span>
            <span className="text-[18px] font-display font-bold text-ink">
              {voting.useCase.label}
            </span>
            <span className="text-[13px] text-ink-secondary">
              Is this tool useful?
            </span>
          </motion.div>
          <ProgressBar progress={voting.progress} />
        </div>

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

        <div className="text-center pb-8">
          <span className="text-[11px] text-ink-muted tracking-wide">
            ← skip · useful for you →
          </span>
        </div>
      </div>
    );
  }

  // Result phase
  if (profile) {
    const handlePublish = () => {
      if (wallet && profile) {
        publish(wallet, profile);
      }
    };

    const handleStartOver = () => {
      resetPublish();
      reset();
      setShowComponents(false);
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
              {/* Confetti-like header */}
              <div className="text-center">
                <motion.span
                  className="inline-block text-4xl mb-3"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
                >
                  🎉
                </motion.span>
                <h1 className="font-display text-[32px] text-ink font-bold">
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

              {/* Divider */}
              <div className="w-12 h-px bg-line-strong" />

              {/* Dynamic wallet widget */}
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
                    <>
                      <div className="flex flex-col items-center gap-3 bg-green-soft rounded-2xl p-5 border border-green/10">
                        <div className="flex items-center gap-2 text-green font-bold text-[14px]">
                          <span>✓</span> Profile published!
                        </div>
                        <a
                          href={publishState.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[12px] text-accent hover:underline font-medium"
                        >
                          View on Explorer →
                        </a>
                      </div>

                      <button
                        onClick={() => setShowComponents(true)}
                        className="flex items-center gap-2 bg-pear hover:bg-pear/90 text-ink font-semibold text-[14px] px-7 py-3.5 rounded-2xl shadow-glow-pear hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <span>🔧</span>
                        Discover your tools
                      </button>
                    </>
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
