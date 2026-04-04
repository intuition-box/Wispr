"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSwipeEngine } from "@/hooks/useSwipeEngine";
import { useWalletConnection } from "@/hooks/useWalletConnection";
import { usePublishProfile } from "@/hooks/usePublishProfile";
import { getQuestion, loadTree } from "@/lib/decisionTree";
import { CardDeck } from "@/components/CardDeck";
import { SwipeButtons } from "@/components/SwipeButtons";
import { ProgressBar } from "@/components/ProgressBar";
import { PhaseLabel } from "@/components/PhaseLabel";
import { ProfileCard } from "@/components/ProfileCard";
import { WalletConnect } from "@/components/WalletConnect";
import { PublishButton } from "@/components/PublishButton";

export default function SwipeFlow() {
  const { state, currentQuestion, profile, progress, swipe, reset } =
    useSwipeEngine();
  const {
    wallet,
    address,
    isConnected,
    loading: walletLoading,
    error: walletError,
    connect,
    disconnect,
  } = useWalletConnection();
  const {
    state: publishState,
    publish,
    reset: resetPublish,
  } = usePublishProfile();

  const tree = useMemo(() => loadTree(), []);

  const nextQuestionLike = currentQuestion
    ? getQuestion(tree, currentQuestion.next.like)
    : null;
  const nextQuestionDislike = currentQuestion
    ? getQuestion(tree, currentQuestion.next.dislike)
    : null;
  const peekQuestion = nextQuestionLike ?? nextQuestionDislike;

  // Swipe phase
  if (state.phase !== "result" && currentQuestion) {
    return (
      <div className="flex flex-col min-h-screen bg-bg">
        {/* Header */}
        <div className="flex flex-col items-center gap-4 px-7 pt-14 pb-4">
          <PhaseLabel phase={state.phase} />
          <ProgressBar progress={progress} />
        </div>

        {/* Card area */}
        <div className="flex-1 flex flex-col items-center justify-center px-7 pb-8">
          <CardDeck
            currentQuestion={currentQuestion}
            nextQuestion={peekQuestion}
            onSwipe={swipe}
          />
          <SwipeButtons onSwipe={swipe} />
        </div>

        {/* Subtle hint */}
        <div className="text-center pb-8">
          <span className="text-[11px] text-ink-muted tracking-wide">
            ← swipe left for no · swipe right for yes →
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

              {/* Wallet + Publish */}
              <WalletConnect
                isConnected={isConnected}
                address={address}
                loading={walletLoading}
                error={walletError}
                onConnect={connect}
                onDisconnect={disconnect}
              />

              {isConnected && wallet && (
                <PublishButton
                  status={publishState.status}
                  txHash={
                    publishState.status === "success"
                      ? publishState.txHash
                      : undefined
                  }
                  explorerUrl={
                    publishState.status === "success"
                      ? publishState.explorerUrl
                      : undefined
                  }
                  errorMessage={
                    publishState.status === "error"
                      ? publishState.message
                      : undefined
                  }
                  onPublish={handlePublish}
                />
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
