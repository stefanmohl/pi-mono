import { describe, expect, test } from "vitest";

// ============================================================================
// Test 1: ThemeData interface exists at core/theme-data.ts
// Verifies the file exists and is importable. Type-level exports (ThemeData,
// ThemeColor, ThemeBg) are verified by the build step (tsgo --noEmit).
// ============================================================================

describe("ThemeData interface in core/theme-data.ts", () => {
	test("module is importable without error", async () => {
		// This import should succeed — the file must exist and be valid TypeScript
		const mod = await import("../src/core/theme-data.js");
		expect(mod).toBeDefined();
	});
});

// ============================================================================
// Test 2: Theme class exported from modes/interactive/theme/theme.ts
// ============================================================================

describe("Theme still exported from interactive mode", () => {
	test("Theme class still exported from modes/interactive/theme/theme.ts", async () => {
		const themeMod = await import("../src/modes/interactive/theme/theme.js");
		expect(typeof themeMod.Theme).toBe("function");
	});
});

// ============================================================================
// Test 3: Theme class implements ThemeData (has getColor and getBackground)
// ============================================================================

describe("Theme implements ThemeData", () => {
	test("Theme instances have getColor and getBackground methods", async () => {
		await import("../src/modes/interactive/theme/theme.js");

		const t = await buildTheme();
		expect(typeof t.getColor).toBe("function");
		expect(typeof t.getBackground).toBe("function");
	});
});

// ============================================================================
// Test 4: Theme.getColor("accent") returns hex string or 256-color index,
//         NOT an ANSI escape sequence
// ============================================================================

describe("Theme.getColor returns raw values", () => {
	test("getColor returns hex string for hex colors", async () => {
		const t = await buildTheme();
		const accent = t.getColor("accent");
		expect(typeof accent).toBe("string");
		if (typeof accent === "string") {
			expect(accent).not.toContain("\x1b[");
			expect(accent).toBe("#ff0000");
		}
	});

	test("getColor returns number for 256-color indices", async () => {
		const t = await buildTheme();
		const border = t.getColor("border");
		// border is set to 0 (a 256-color index), which is a number
		expect(typeof border).toBe("number");
		if (typeof border === "number") {
			expect(border).toBe(0);
		}
	});

	test("getBackground returns raw background color values", async () => {
		const t = await buildTheme();
		const bg = t.getBackground("userMessageBg");
		expect(typeof bg).toBe("number");
		if (typeof bg === "number") {
			expect(bg).toBe(17);
		}
	});
});

// ============================================================================
// Test 5: Theme.fg("accent", "hello") returns ANSI-wrapped string
// ============================================================================

describe("Theme.fg preserves existing ANSI behavior", () => {
	test("fg wraps text in ANSI escape codes", async () => {
		const t = await buildTheme();
		const result = t.fg("accent", "hello");
		expect(result).toContain("\x1b[");
		expect(result).toContain("hello");
		expect(result).toMatch(/^\x1b\[/);
	});

	test("bg wraps text in ANSI background escape codes", async () => {
		const t = await buildTheme();
		const result = t.bg("userMessageBg", "test");
		expect(result).toContain("\x1b[");
		expect(result).toContain("test");
	});
});

// ============================================================================
// Test 6: getColor and getBackground throw on unknown color names
// ============================================================================

describe("getColor and getBackground error on unknown names", () => {
	test("getColor throws on unknown color name", async () => {
		const t = await buildTheme();
		expect(() => t.getColor("nonexistent" as any)).toThrow("Unknown theme color: nonexistent");
	});

	test("getBackground throws on unknown background color name", async () => {
		const t = await buildTheme();
		expect(() => t.getBackground("nonexistent" as any)).toThrow("Unknown theme background color: nonexistent");
	});
});

// ============================================================================
// Helpers
// ============================================================================

async function buildTheme() {
	const { Theme } = await import("../src/modes/interactive/theme/theme.js");

	const fgColors: Record<string, string | number> = {
		accent: "#ff0000",
		border: 0,
		borderAccent: 1,
		borderMuted: 2,
		success: "#00ff00",
		error: "#0000ff",
		warning: "#ffff00",
		muted: "#ff00ff",
		dim: "#00ffff",
		text: "#ffffff",
		thinkingText: "#cccccc",
		userMessageText: "#aaaaaa",
		customMessageText: "#bbbbbb",
		customMessageLabel: "#999999",
		toolTitle: "#888888",
		toolOutput: "#777777",
		mdHeading: "#666666",
		mdLink: "#555555",
		mdLinkUrl: "#444444",
		mdCode: "#333333",
		mdCodeBlock: "#222222",
		mdCodeBlockBorder: "#111111",
		mdQuote: "#000001",
		mdQuoteBorder: "#000002",
		mdHr: "#000003",
		mdListBullet: "#000004",
		toolDiffAdded: "#00ff01",
		toolDiffRemoved: "#ff0001",
		toolDiffContext: "#aa00aa",
		syntaxComment: "#bb00bb",
		syntaxKeyword: "#cc00cc",
		syntaxFunction: "#dd00dd",
		syntaxVariable: "#ee00ee",
		syntaxString: "#ff00ee",
		syntaxNumber: "#aa00ff",
		syntaxType: "#bb00ff",
		syntaxOperator: "#cc00ff",
		syntaxPunctuation: "#dd00ff",
		thinkingOff: "#111100",
		thinkingMinimal: "#222200",
		thinkingLow: "#333300",
		thinkingMedium: "#444400",
		thinkingHigh: "#555500",
		thinkingXhigh: "#666600",
		bashMode: "#777700",
	};

	const bgColors: Record<string, string | number> = {
		selectedBg: 16,
		userMessageBg: 17,
		customMessageBg: 18,
		toolPendingBg: 19,
		toolSuccessBg: 20,
		toolErrorBg: 21,
	};

	return new Theme(fgColors, bgColors, "truecolor", { name: "test" });
}
