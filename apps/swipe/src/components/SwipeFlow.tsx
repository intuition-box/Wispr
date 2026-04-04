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

  // Compute next question for the peek card
  const nextQuestionLike = currentQuestion
    ? getQuestion(tree, currentQuestion.next.like)
    : null;
  const nextQuestionDislike = currentQuestion
    ? getQuestion(tree, currentQuestion.next.dislike)
    : null;
  const peekQuestion = nextQuestionLike ?? nextQuestionDislike;

  // Swipe phase — show card deck
  if (state.phase !== "result" && currentQuestion) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-app">
        <div className="flex flex-col items-center gap-4 px-6 pt-12 pb-6">
          <PhaseLabel phase={state.phase} />
          <ProgressBar progress={progress} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <CardDeck
            currentQuestion={currentQuestion}
            nextQuestion={peekQuestion}
            onSwipe={swipe}
          />
          <SwipeButtons onSwipe={swipe} />
        </div>
      </div>
    );
  }

  // Result phase — show profile + wallet + publish
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
      <div className="flex flex-col min-h-screen bg-bg-app">
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6 py-12">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 w-full max-w-[400px]"
            >
              <h1 className="text-2xl font-extrabold text-text-primary text-center">
                Bravo!
              </h1>

              <ProfileCard profile={profile} />

              <p className="text-sm text-text-secondary text-center max-w-[300px]">
                You are a{" "}
                <strong className="text-text-primary">
                  {profile.role.replace(/-/g, " ")}
                </strong>{" "}
                with an{" "}
                <strong className="text-text-primary">{profile.level}</strong>{" "}
                level in AI.
              </p>

              {/* Divider */}
              <div className="w-full h-px bg-border" />

              {/* Wallet connection */}
              <WalletConnect
                isConnected={isConnected}
                address={address}
                loading={walletLoading}
                error={walletError}
                onConnect={connect}
                onDisconnect={disconnect}
              />

              {/* Publish on-chain (only visible when wallet connected) */}
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
                className="text-sm text-text-muted hover:text-text-secondary transition-colors bg-transparent border-none mt-2"
              >
                Start over
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return null;
}
