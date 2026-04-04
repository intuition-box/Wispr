import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { colors } from "../../tokens";

const meta: Meta = {
  title: "Branding/Colors",
};

export default meta;

const Swatch: React.FC<{ name: string; hex: string; dark?: boolean }> = ({ name, hex, dark }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <div
      style={{
        width: 80,
        height: 80,
        borderRadius: 10,
        background: hex,
        border: dark ? "none" : "1px solid #e0e0e0",
      }}
    />
    <span style={{ fontSize: 11, fontWeight: 600, color: "#333", fontFamily: "Inter, system-ui, sans-serif" }}>{name}</span>
    <span style={{ fontSize: 10, color: "#888", fontFamily: "'JetBrains Mono', monospace" }}>{hex}</span>
  </div>
);

const PaletteRow: React.FC<{ title: string; shades: Record<string, string> }> = ({ title, shades }) => (
  <div style={{ marginBottom: 40 }}>
    <h3 style={{
      margin: "0 0 16px",
      fontSize: 14,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      color: "#444",
      fontFamily: "Inter, system-ui, sans-serif",
    }}>
      {title}
    </h3>
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {Object.entries(shades).map(([name, hex]) => (
        <Swatch key={name} name={name} hex={hex} dark={parseInt(name, 10) <= 200} />
      ))}
    </div>
  </div>
);

type Story = StoryObj;

export const Palette: Story = {
  render: () => (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", maxWidth: 800 }}>
      <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: "#121433" }}>
        Color Palette
      </h2>
      <p style={{ margin: "0 0 40px", fontSize: 14, color: "#666", lineHeight: 1.6 }}>
        Fresh greens and soft gradients anchored by deep purple neutrals and electric blue accents.
        <br />
        The palette should feel <em>intelligent, not fruity</em> — AI companion, not grocery store.
      </p>

      <PaletteRow title="Pear — Primary" shades={colors.pear} />
      <PaletteRow title="Accent — Electric Blue / Teal" shades={colors.accent} />
      <PaletteRow title="Neutral — Deep Purple" shades={colors.neutral} />

      <div style={{ marginBottom: 40 }}>
        <h3 style={{
          margin: "0 0 16px",
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          color: "#444",
        }}>
          Base
        </h3>
        <div style={{ display: "flex", gap: 16 }}>
          <Swatch name="white" hex={colors.white} />
          <Swatch name="black" hex={colors.black} dark />
        </div>
      </div>

      {/* Gradient examples */}
      <h3 style={{
        margin: "0 0 16px",
        fontSize: 14,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 1.5,
        color: "#444",
      }}>
        Gradients
      </h3>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{
            width: 200,
            height: 80,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.pear[200]}, ${colors.accent[500]})`,
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#333" }}>Pear → Accent</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{
            width: 200,
            height: 80,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.neutral[700]}, ${colors.neutral[500]})`,
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#333" }}>Dark BG</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{
            width: 200,
            height: 80,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${colors.pear[200]}, ${colors.pear[400]}, ${colors.accent[400]})`,
          }} />
          <span style={{ fontSize: 11, fontWeight: 600, color: "#333" }}>Full Brand</span>
        </div>
      </div>
    </div>
  ),
};
