import { CSSProperties } from 'react';
import { ElementType } from 'react';
import { ForwardRefExoticComponent } from 'react';
import { JSX as JSX_2 } from 'react';
import { ReactNode } from 'react';
import { RefAttributes } from 'react';

/**
 * Button — rawhouseathens.gr's chunky pill action ("Book now"). A fully-round
 * pill in a brand fill or an outline; bold Manrope label, springy hover.
 */
export declare function Button({ children, variant, size, href, as, className, ...rest }: ButtonProps): JSX_2.Element;

export declare interface ButtonProps {
    children: ReactNode;
    /** "coral" (default), "green", "white", "black" fill, or "outline". */
    variant?: "coral" | "green" | "white" | "black" | "outline";
    /** Size. */
    size?: "md" | "sm";
    href?: string;
    as?: ElementType;
    onClick?: () => void;
    className?: string;
    [key: string]: unknown;
}

/**
 * Eyebrow — the small uppercase wide-tracked label above headings ("WE ARE
 * HERE FOR…"). Composes Text at the label step with caps.
 */
export declare function Eyebrow({ children, tone, className }: EyebrowProps): JSX_2.Element;

export declare interface EyebrowProps {
    children: ReactNode;
    /** Accent tone for the label. */
    tone?: "green" | "coral" | "muted" | "ink";
    className?: string;
}

/**
 * Heading — rawhouseathens.gr's bold section heading: an optional Eyebrow over
 * an extra-bold Manrope display. Composes Eyebrow + Text.
 */
export declare function Heading({ children, level, eyebrow, eyebrowTone, center, as, className, }: HeadingProps): JSX_2.Element;

export declare interface HeadingProps {
    children: ReactNode;
    /** "hero" = oversized; "display" = section; "h" = sub. */
    level?: "hero" | "display" | "h";
    /** Optional eyebrow label above the heading. */
    eyebrow?: ReactNode;
    /** Eyebrow accent tone. */
    eyebrowTone?: "green" | "coral" | "muted" | "ink";
    /** Center-align. */
    center?: boolean;
    as?: ElementType;
    className?: string;
}

/**
 * IconButton — the round icon controls of rawhouseathens.gr (the globe /
 * menu / scroll-to-top circles). A perfectly circular button in a brand fill.
 */
export declare function IconButton({ children, variant, size, href, as, className, ...rest }: IconButtonProps): JSX_2.Element;

export declare interface IconButtonProps {
    /** Glyph / icon node. */
    children: ReactNode;
    /** Fill tone. */
    variant?: "coral" | "green" | "white" | "black" | "outline";
    /** Diameter in px. */
    size?: number;
    /** Accessible label (required — icon-only control). */
    "aria-label": string;
    href?: string;
    as?: ElementType;
    onClick?: () => void;
    className?: string;
    [key: string]: unknown;
}

/**
 * Marquee — rawhouseathens.gr's scrolling bold-phrase band ("WE ARE HERE FOR
 * PRODUCERS · CREATORS · BRANDS") with a circular badge between each phrase.
 * The track is duplicated for a seamless loop; honours reduced-motion.
 */
export declare function Marquee({ items, badge, speed, className }: MarqueeProps): JSX_2.Element;

export declare interface MarqueeProps {
    /** Phrases to cycle through, each followed by a badge separator. */
    items: ReactNode[];
    /** Glyph shown in the circular separator badge (the logo mark). */
    badge?: ReactNode;
    /** Seconds for one full loop. */
    speed?: number;
    className?: string;
}

/**
 * MediaCard — the chunky rounded image tiles in rawhouseathens.gr's galleries.
 * A rounded Surface clipping an image, with an optional Pill tag and caption.
 * Composes Surface + Pill + Text.
 */
export declare function MediaCard({ title, tag, src, alt, tone, ratio, href, className, }: MediaCardProps): JSX_2.Element;

export declare interface MediaCardProps {
    title?: ReactNode;
    /** Optional pill label over the media. */
    tag?: ReactNode;
    /** Image URL; falls back to a tone placeholder. */
    src?: string;
    alt?: string;
    /** Placeholder tone when no src. */
    tone?: SurfaceTone;
    /** Media aspect ratio (w/h). */
    ratio?: number;
    href?: string;
    className?: string;
}

/**
 * Pill — a small fully-round chip/badge. A pill-radius Surface + small label;
 * used for tags, statuses and the floating nav chips.
 */
export declare function Pill({ children, tone, caps, className }: PillProps): JSX_2.Element;

export declare interface PillProps {
    children: ReactNode;
    /** Fill tone. */
    tone?: SurfaceTone;
    /** Uppercase tracked label instead of sentence case. */
    caps?: boolean;
    className?: string;
}

/**
 * Surface — the container primitive of rawhouseathens.gr: a chunky rounded
 * block in one of the brand tones, optionally wearing the hard "sticker"
 * shadow. Cards, media tiles, buttons and pills all build on it.
 */
export declare const Surface: ForwardRefExoticComponent<Omit<SurfaceProps, "ref"> & RefAttributes<HTMLElement>>;

export declare interface SurfaceProps {
    children?: ReactNode;
    /** Background fill. Foreground auto-adjusts. */
    tone?: SurfaceTone;
    /** Corner radius. */
    radius?: "md" | "lg" | "xl" | "pill";
    /** The hard-offset "sticker" shadow (cream ring + stone drop). */
    sticker?: boolean;
    /** 2px chunky border. */
    bordered?: boolean;
    /** Inner padding in grid modules (8px each). */
    pad?: number;
    /** Hover nudge (for clickable surfaces). */
    interactive?: boolean;
    /** Polymorphic tag — "div" (default), "a", "section", "button"… */
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
}

export declare type SurfaceTone = "black" | "white" | "stone" | "green" | "coral";

/**
 * Text — the typography primitive. Manrope, leaning bold/extra-bold for the
 * chunky display type; an uppercase wide-tracked `caps` mode for labels.
 */
declare const Text_2: ForwardRefExoticComponent<Omit<TextProps, "ref"> & RefAttributes<HTMLElement>>;
export { Text_2 as Text }

export declare interface TextProps {
    children?: ReactNode;
    /** Scale step. */
    size?: TextSize;
    /** Colour tone. "ink" follows the surface foreground. */
    tone?: TextTone;
    /** Weight. */
    weight?: "regular" | "semibold" | "bold" | "extrabold";
    /** Uppercase + wide tracking (the label treatment). */
    caps?: boolean;
    /** Center-align. */
    center?: boolean;
    as?: ElementType;
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
}

export declare type TextSize = "hero" | "display" | "h" | "title" | "lead" | "body" | "small" | "label";

export declare type TextTone = "ink" | "muted" | "green" | "coral" | "inherit";

export { }
