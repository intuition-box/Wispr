import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Logo } from "./Logo";
import { colors, brand, typography } from "../../tokens";

const meta: Meta<typeof Logo> = {
  title: "Branding/Logo",
  component: Logo,
  argTypes: {
    variant: { control: "select", options: ["icon", "wordmark", "combined"] },
    theme: { control: "select", options: ["dark", "light"] },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

const darkBg = { background: colors.neutral[700], padding: 40, borderRadius: 12, display: "flex" as const, justifyContent: "center" as const };
const lightBg = { background: colors.neutral[50], padding: 40, borderRadius: 12, display: "flex" as const, justifyContent: "center" as const };

// Individual stories
export const IconDark: Story = {
  args: { variant: "icon", theme: "dark" },
  decorators: [(Story) => <div style={darkBg}><Story /></div>],
};

export const IconLight: Story = {
  args: { variant: "icon", theme: "light" },
  decorators: [(Story) => <div style={lightBg}><Story /></div>],
};

export const WordmarkDark: Story = {
  args: { variant: "wordmark", theme: "dark" },
  decorators: [(Story) => <div style={darkBg}><Story /></div>],
};

export const WordmarkLight: Story = {
  args: { variant: "wordmark", theme: "light" },
  decorators: [(Story) => <div style={lightBg}><Story /></div>],
};

export const CombinedDark: Story = {
  args: { variant: "combined", theme: "dark" },
  decorators: [(Story) => <div style={darkBg}><Story /></div>],
};

export const CombinedLight: Story = {
  args: { variant: "combined", theme: "light" },
  decorators: [(Story) => <div style={lightBg}><Story /></div>],
};

// Full declination grid
export const AllVariants: Story = {
  render: () => {
    const label: React.CSSProperties = {
      margin: "0 0 12px",
      color: colors.neutral[300],
      fontSize: 12,
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: 1.5,
      fontFamily: typography.fontFamily.body,
    };

    return (
      <div style={{ fontFamily: typography.fontFamily.body, maxWidth: 960 }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 800, color: colors.neutral[700] }}>
            Logo Declinations
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: colors.neutral[300], lineHeight: 1.6 }}>
            Minimalist pear silhouette with whisper lines. Clean, flat, tech-forward.
            <br />
            Three variants: <strong>icon</strong> (pear mark), <strong>wordmark</strong> (text only), <strong>combined</strong> (pear + text).
          </p>
        </div>

        {/* Icon */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div>
            <h3 style={label}>Icon — Dark</h3>
            <div style={darkBg}><Logo variant="icon" theme="dark" /></div>
          </div>
          <div>
            <h3 style={label}>Icon — Light</h3>
            <div style={lightBg}><Logo variant="icon" theme="light" /></div>
          </div>
        </div>

        {/* Wordmark */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 32 }}>
          <div>
            <h3 style={label}>Wordmark — Dark</h3>
            <div style={darkBg}><Logo variant="wordmark" theme="dark" width={360} height={70} /></div>
          </div>
          <div>
            <h3 style={label}>Wordmark — Light</h3>
            <div style={lightBg}><Logo variant="wordmark" theme="light" width={360} height={70} /></div>
          </div>
        </div>

        {/* Combined */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
          <div>
            <h3 style={label}>Combined — Dark</h3>
            <div style={darkBg}><Logo variant="combined" theme="dark" width={480} height={150} /></div>
          </div>
          <div>
            <h3 style={label}>Combined — Light</h3>
            <div style={lightBg}><Logo variant="combined" theme="light" width={480} height={150} /></div>
          </div>
        </div>

        {/* Sizes */}
        <h3 style={{ ...label, color: colors.neutral[700], marginBottom: 16 }}>Icon Sizes</h3>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 32, ...darkBg }}>
          {[32, 48, 80, 120].map((size) => (
            <div key={size} style={{ textAlign: "center" }}>
              <Logo variant="icon" theme="dark" width={size} height={size * 1.07} />
              <div style={{ color: colors.neutral[300], fontSize: 11, marginTop: 8 }}>{size}px</div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};
