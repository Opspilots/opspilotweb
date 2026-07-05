import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import styles from './TextLink.module.css';

/* ─── Shared "text + trailing arrow" link ───
   Unifies what used to be 3 separately reimplemented rules: Home's
   `.ctaSecondary` (hero, strong/md), Soluciones' `.rowLink` (row CTA,
   muted/sm) and Resources' `.featuredCta` (a non-interactive
   "Próximamente" label, subtle/sm — see `interactive={false}` below).
   Renders a router <Link> when `to` is given, a plain <a> when `href`
   is given, a <button> when only `onClick` is given, or a <span> when
   none of those are present / `interactive` is explicitly false. */

type TextLinkTone = 'strong' | 'muted' | 'subtle';
type TextLinkSize = 'md' | 'sm';

interface TextLinkProps {
    children: React.ReactNode;
    to?: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    tone?: TextLinkTone;
    size?: TextLinkSize;
    /** Set to false for static/disabled labels that visually match the
     *  link pattern but have no destination (e.g. "coming soon"). */
    interactive?: boolean;
    className?: string;
}

export const TextLink: React.FC<TextLinkProps> = ({
    children,
    to,
    href,
    onClick,
    icon,
    tone = 'muted',
    size = 'sm',
    interactive = true,
    className = '',
}) => {
    const classes = [
        styles.textLink,
        styles[`tone-${tone}`],
        styles[`size-${size}`],
        !interactive && styles.static,
        className,
    ].filter(Boolean).join(' ');

    const content = (
        <>
            {children}
            {icon ?? <ArrowRight size={size === 'md' ? 16 : 14} strokeWidth={2} />}
        </>
    );

    if (interactive && to) {
        return (
            <Link to={to} className={classes} onClick={onClick}>
                {content}
            </Link>
        );
    }

    if (interactive && href) {
        return (
            <a href={href} className={classes} onClick={onClick}>
                {content}
            </a>
        );
    }

    if (interactive && onClick) {
        return (
            <button type="button" className={classes} onClick={onClick}>
                {content}
            </button>
        );
    }

    return <span className={classes}>{content}</span>;
};
