import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Branding/Logo",
  component: Logo,
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const IconDark: Story = {
  args: { variant: "icon", theme: "dark" },
  decorators: [
    (Story) => (
      <div style={{ background: "#121433", padding: 40, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};

export const IconLight: Story = {
  args: { variant: "icon", theme: "light" },
  decorators: [
    (Story) => (
      <div style={{ background: "#f5f5f7", padding: 40, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};

export const TypoDark: Story = {
  args: { variant: "typo", theme: "dark" },
  decorators: [
    (Story) => (
      <div style={{ background: "#121433", padding: 40, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};

export const TypoLight: Story = {
  args: { variant: "typo", theme: "light" },
  decorators: [
    (Story) => (
      <div style={{ background: "#f5f5f7", padding: 40, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
};

// Full declination page
export const AllVariants: Story = {
  render: () => (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <h2 style={{ margin: "0 0 32px", color: "#1d2050", fontSize: 24, fontWeight: 700 }}>
        Logo Declinations
      </h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Dark theme */}
        <div>
          <h3 style={{ margin: "0 0 12px", color: "#666", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
            Dark Theme — Icon
          </h3>
          <div style={{ background: "#121433", padding: 40, borderRadius: 12, display: "flex", justifyContent: "center" }}>
            <Logo variant="icon" theme="dark" />
          </div>
        </div>

        <div>
          <h3 style={{ margin: "0 0 12px", color: "#666", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
            Light Theme — Icon
          </h3>
          <div style={{ background: "#f5f5f7", padding: 40, borderRadius: 12, display: "flex", justifyContent: "center" }}>
            <Logo variant="icon" theme="light" />
          </div>
        </div>

        <div>
          <h3 style={{ margin: "0 0 12px", color: "#666", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
            Dark Theme — Logo + Typo
          </h3>
          <div style={{ background: "#121433", padding: 40, borderRadius: 12, display: "flex", justifyContent: "center" }}>
            <Logo variant="typo" theme="dark" width={500} height={156} />
          </div>
        </div>

        <div>
          <h3 style={{ margin: "0 0 12px", color: "#666", fontSize: 13, textTransform: "uppercase", letterSpacing: 1 }}>
            Light Theme — Logo + Typo
          </h3>
          <div style={{ background: "#f5f5f7", padding: 40, borderRadius: 12, display: "flex", justifyContent: "center" }}>
            <Logo variant="typo" theme="light" width={500} height={156} />
          </div>
        </div>
      </div>

      {/* Sizes */}
      <h2 style={{ margin: "48px 0 24px", color: "#1d2050", fontSize: 24, fontWeight: 700 }}>
        Sizes
      </h2>

      <div style={{ display: "flex", alignItems: "flex-end", gap: 32, background: "#121433", padding: 40, borderRadius: 12 }}>
        <div style={{ textAlign: "center" }}>
          <Logo variant="icon" theme="dark" width={40} height={44} />
          <div style={{ color: "#888", fontSize: 11, marginTop: 8 }}>40px</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Logo variant="icon" theme="dark" width={80} height={88} />
          <div style={{ color: "#888", fontSize: 11, marginTop: 8 }}>80px</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <Logo variant="icon" theme="dark" width={120} height={132} />
          <div style={{ color: "#888", fontSize: 11, marginTop: 8 }}>120px</div>
        </div>
      </div>
    </div>
  ),
};
