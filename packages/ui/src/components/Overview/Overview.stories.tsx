import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Logo } from "../Logo/Logo";
import { colors, brand, typography } from "../../tokens";

const meta: Meta = {
  title: "Branding/Overview",
};

export default meta;
type Story = StoryObj;

export const BrandOverview: Story = {
  render: () => {
    const section: React.CSSProperties = { marginBottom: 56 };
    const sectionTitle: React.CSSProperties = {
      margin: "0 0 8px",
      fontSize: 13,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 2,
      color: colors.neutral[300],
      fontFamily: typography.fontFamily.body,
    };
    const body: React.CSSProperties = {
      margin: 0,
      fontSize: 15,
      color: colors.neutral[400],
      lineHeight: 1.7,
      fontFamily: typography.fontFamily.body,
      maxWidth: 640,
    };

    return (
      <div style={{ fontFamily: typography.fontFamily.body, maxWidth: 840, padding: "0 0 80px" }}>
        {/* Hero */}
        <div style={{
          background: `linear-gradient(145deg, ${colors.neutral[700]}, ${colors.neutral[600]})`,
          borderRadius: 16,
          padding: "60px 56px",
          marginBottom: 56,
          textAlign: "center",
        }}>
          <Logo variant="combined" theme="dark" width={520} height={163} />
          <p style={{
            margin: "24px 0 0",
            fontSize: 20,
            fontWeight: 500,
            color: colors.accent[200],
            fontStyle: "italic",
            fontFamily: typography.fontFamily.heading,
            letterSpacing: 0.5,
          }}>
            "{brand.slogan}"
          </p>
        </div>

        {/* What is Wispear */}
        <div style={section}>
          <h3 style={sectionTitle}>What is Wispear</h3>
          <p style={body}>
            {brand.tagline}
            {" "}Users describe their need, Wispear recommends the right tools — skills, LLMs, MCP servers, APIs — validated by a community of curators on an on-chain knowledge graph.
          </p>
        </div>

        {/* Name Origin */}
        <div style={section}>
          <h3 style={sectionTitle}>Name Origin</h3>
          <p style={body}>
            <strong>Wispear</strong> = <em>whisper</em> + <em>pear</em>. A pear that whispers to your AI agent what tools to use.
          </p>
          <div style={{
            display: "flex",
            gap: 16,
            marginTop: 16,
            flexWrap: "wrap",
          }}>
            {[
              { label: "wisp-ear", desc: "The ear is embedded" },
              { label: "wis-peer", desc: "Peer-to-peer curation" },
              { label: "≈ whisper", desc: "Sounds like whisper" },
            ].map((item) => (
              <div key={item.label} style={{
                background: colors.neutral[50],
                border: `1px solid ${colors.neutral[100]}`,
                borderRadius: 8,
                padding: "12px 20px",
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: colors.accent[400], fontFamily: typography.fontFamily.mono }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12, color: colors.neutral[300], marginTop: 2 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Slogan */}
        <div style={section}>
          <h3 style={sectionTitle}>Slogan</h3>
          <blockquote style={{
            margin: 0,
            padding: "20px 28px",
            borderLeft: `4px solid ${colors.accent[200]}`,
            background: colors.neutral[50],
            borderRadius: "0 10px 10px 0",
            fontSize: 22,
            fontWeight: 600,
            color: colors.neutral[700],
            fontFamily: typography.fontFamily.heading,
            fontStyle: "italic",
          }}>
            {brand.slogan}
          </blockquote>
        </div>

        {/* Tone */}
        <div style={section}>
          <h3 style={sectionTitle}>Tone & Style</h3>
          <p style={body}>
            Confident, minimal, slightly playful. Like a senior dev who also has good taste.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            {["Clean", "Modern", "Tech-forward", "Playful", "Smart", "Approachable"].map((tag) => (
              <span key={tag} style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: `linear-gradient(135deg, ${colors.pear[200]}22, ${colors.accent[500]}22)`,
                border: `1px solid ${colors.pear[400]}33`,
                fontSize: 13,
                fontWeight: 600,
                color: colors.neutral[500],
              }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
            {["Not corporate", "Not cute", "No 3D", "No skeuomorphism"].map((tag) => (
              <span key={tag} style={{
                padding: "6px 14px",
                borderRadius: 20,
                background: "#fff0f0",
                border: "1px solid #ffcccc",
                fontSize: 13,
                fontWeight: 600,
                color: "#cc4444",
              }}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div style={section}>
          <h3 style={sectionTitle}>Typography</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <div style={{ fontSize: 11, color: colors.neutral[300], marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Heading — Montserrat
              </div>
              <div style={{ fontFamily: typography.fontFamily.heading, fontSize: 36, fontWeight: 900, color: colors.neutral[700] }}>
                Collective wisdom
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.neutral[300], marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Body — Inter
              </div>
              <div style={{ fontFamily: typography.fontFamily.body, fontSize: 16, fontWeight: 400, color: colors.neutral[400], lineHeight: 1.6 }}>
                Wispear recommends the right tools to use, validated by a community of curators on an on-chain knowledge graph.
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: colors.neutral[300], marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Mono — JetBrains Mono
              </div>
              <div style={{ fontFamily: typography.fontFamily.mono, fontSize: 14, fontWeight: 400, color: colors.accent[400] }}>
                {'@wispr/agent → skill.recommend("embeddings")'}
              </div>
            </div>
          </div>
        </div>

        {/* Quick logo strip */}
        <div style={section}>
          <h3 style={sectionTitle}>Logo Variants</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div style={{ background: colors.neutral[700], borderRadius: 12, padding: 32, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Logo variant="icon" theme="dark" width={80} height={86} />
            </div>
            <div style={{ background: colors.neutral[700], borderRadius: 12, padding: 32, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Logo variant="wordmark" theme="dark" width={240} height={46} />
            </div>
            <div style={{ background: colors.neutral[700], borderRadius: 12, padding: 32, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Logo variant="combined" theme="dark" width={280} height={88} />
            </div>
            <div style={{ background: colors.neutral[50], borderRadius: 12, padding: 32, display: "flex", justifyContent: "center", alignItems: "center", border: `1px solid ${colors.neutral[100]}` }}>
              <Logo variant="icon" theme="light" width={80} height={86} />
            </div>
            <div style={{ background: colors.neutral[50], borderRadius: 12, padding: 32, display: "flex", justifyContent: "center", alignItems: "center", border: `1px solid ${colors.neutral[100]}` }}>
              <Logo variant="wordmark" theme="light" width={240} height={46} />
            </div>
            <div style={{ background: colors.neutral[50], borderRadius: 12, padding: 32, display: "flex", justifyContent: "center", alignItems: "center", border: `1px solid ${colors.neutral[100]}` }}>
              <Logo variant="combined" theme="light" width={280} height={88} />
            </div>
          </div>
        </div>
      </div>
    );
  },
};
