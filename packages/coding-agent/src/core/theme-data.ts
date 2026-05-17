// ============================================================================
// ThemeData — Pure data interface for theme colors
//
// Core modules and non-TUI renderers (web, mobile, print) use this interface
// to reference theme colors without depending on terminal rendering primitives.
// The Theme class in interactive mode implements this interface, adding ANSI
// formatting methods.
// ============================================================================

export type ThemeColor =
	| "accent"
	| "border"
	| "borderAccent"
	| "borderMuted"
	| "success"
	| "error"
	| "warning"
	| "muted"
	| "dim"
	| "text"
	| "thinkingText"
	| "userMessageText"
	| "customMessageText"
	| "customMessageLabel"
	| "toolTitle"
	| "toolOutput"
	| "mdHeading"
	| "mdLink"
	| "mdLinkUrl"
	| "mdCode"
	| "mdCodeBlock"
	| "mdCodeBlockBorder"
	| "mdQuote"
	| "mdQuoteBorder"
	| "mdHr"
	| "mdListBullet"
	| "toolDiffAdded"
	| "toolDiffRemoved"
	| "toolDiffContext"
	| "syntaxComment"
	| "syntaxKeyword"
	| "syntaxFunction"
	| "syntaxVariable"
	| "syntaxString"
	| "syntaxNumber"
	| "syntaxType"
	| "syntaxOperator"
	| "syntaxPunctuation"
	| "thinkingOff"
	| "thinkingMinimal"
	| "thinkingLow"
	| "thinkingMedium"
	| "thinkingHigh"
	| "thinkingXhigh"
	| "bashMode";

export type ThemeBg =
	| "selectedBg"
	| "userMessageBg"
	| "customMessageBg"
	| "toolPendingBg"
	| "toolSuccessBg"
	| "toolErrorBg";

/**
 * Pure data interface for theme color access.
 *
 * Returns raw color values (hex strings like "#ff0000" or 256-color indices
 * like 16), NOT ANSI escape sequences. The Theme class in interactive mode
 * implements this interface and adds ANSI formatting methods.
 */
export interface ThemeData {
	readonly name?: string;

	/** Get a foreground color value as a raw hex string or 256-color index. */
	getColor(name: ThemeColor): string | number;

	/** Get a background color value as a raw hex string or 256-color index. */
	getBackground(name: ThemeBg): string | number;
}
