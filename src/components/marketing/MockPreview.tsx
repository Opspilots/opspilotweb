import React from 'react';
import { Star } from 'lucide-react';
import styles from './MockPreview.module.css';

/**
 * MockPreview — mini-maqueta de "web/panel generado" (nav + titular + bloque
 * de contenido destacado), extraída del Paso 4 de HeroLeadWidget para
 * reutilizarse también en CaseMockPanel (tarjetas de casos, ver
 * src/components/cases/CaseMockPanel.tsx). Puramente presentacional: sin
 * estado ni lógica de quiz — quien la use decide accent/kicker/title/sub/
 * block y, opcionalmente, cuándo debe correr su cascada de entrada
 * (`revealed`).
 *
 * Solo hay dos acentos en el sistema de diseño (mint/warm, ver
 * variables.css). Custom properties para el crossfade de acento: en vez de
 * un selector `[data-accent]` que cambia de golpe, cada elemento que
 * depende del acento anima SU PROPIO color desde un tono neutro hasta esta
 * variable (ver keyframes tplBrandIn/tplKickerIn en el .module.css). Todo
 * derivado de tokens ya existentes en variables.css — el único valor
 * "nuevo" es el glow ámbar de `--tpl-accent-shadow` en warm, calcado de
 * `--shadow-mint` (mismos offsets/alpha) con el RGB base de `--color-warm`
 * (232,165,99), para que el brillo del punto de marca no quede asimétrico
 * entre acentos.
 */

export type MockAccent = 'mint' | 'warm';
export type MockDevice = 'desktop' | 'mobile';

type IconComponent = React.FC<{ size?: number; strokeWidth?: number }>;

export interface MockModuleItem {
  key: string;
  icon: IconComponent;
  label: string;
  active?: boolean;
}

export type MockBlock =
  | { type: 'testimonial' }
  | { type: 'modules'; items: readonly MockModuleItem[] }
  | {
      type: 'sequence';
      beforeIcon: IconComponent;
      afterIcon: IconComponent;
      /** Etiqueta corta bajo cada icono — sin ella el tile queda "suelto",
       * sin decir qué representa (mismo criterio que MockModuleItem.label). */
      beforeLabel: string;
      afterLabel: string;
    };

export interface MockPreviewProps {
  accent: MockAccent;
  device?: MockDevice;
  kicker?: string;
  title: string;
  sub?: string;
  block: MockBlock;
  /** Gatea la cascada de entrada (nav → titular → bloque). `true` por
   * defecto: HeroLeadWidget siempre la quiere al montar/remontar (vía
   * `key={comboKey}`), mientras que un consumidor scroll-revealed (p. ej.
   * CaseMockPanel) la deja en `false` hasta que el propio panel entra en
   * viewport, para no gastar la animación fuera de pantalla. */
  revealed?: boolean;
  className?: string;
}

const ACCENT_VARS: Record<MockAccent, React.CSSProperties> = {
  mint: {
    '--tpl-accent': 'var(--color-mint)',
    '--tpl-accent-fill': 'var(--gradient-mint)',
    '--tpl-accent-soft': 'var(--color-mint-soft)',
    '--tpl-accent-border': 'var(--color-border-mint)',
    '--tpl-accent-shadow': 'var(--shadow-mint)',
  } as React.CSSProperties,
  warm: {
    '--tpl-accent': 'var(--color-warm)',
    '--tpl-accent-fill': 'var(--color-warm)',
    '--tpl-accent-soft': 'var(--color-warm-soft)',
    '--tpl-accent-border': 'rgba(232, 165, 99, 0.32)',
    '--tpl-accent-shadow': '0 12px 40px -12px rgba(232, 165, 99, 0.28)',
  } as React.CSSProperties,
};

function TestimonialBlock() {
  return (
    <div className={styles.testimonial}>
      <span className={styles.stars} aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={12} strokeWidth={0} fill="currentColor" />
        ))}
      </span>
      <span className={styles.quoteBar} />
      <span className={`${styles.quoteBar} ${styles.quoteBarShort}`} />
      <div className={styles.avatarRow}>
        <span className={styles.avatarDot} />
        <span className={styles.avatarName} />
      </div>
    </div>
  );
}

function ModulesBlock({ items }: { items: readonly MockModuleItem[] }) {
  return (
    <div className={styles.modules}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <span
            key={item.key}
            className={`${styles.moduleTile} ${item.active ? styles.moduleTileActive : ''}`}
          >
            <Icon size={16} strokeWidth={1.8} />
            <span className={styles.moduleLabel}>{item.label}</span>
          </span>
        );
      })}
    </div>
  );
}

function SequenceBlock({
  beforeIcon: BeforeIcon,
  afterIcon: AfterIcon,
  beforeLabel,
  afterLabel,
}: {
  beforeIcon: IconComponent;
  afterIcon: IconComponent;
  beforeLabel: string;
  afterLabel: string;
}) {
  return (
    <div className={styles.sequence}>
      <span className={`${styles.seqTile} ${styles.seqTileBefore}`}>
        <BeforeIcon size={17} strokeWidth={1.8} />
        <span className={styles.seqLabel}>{beforeLabel}</span>
      </span>
      <span className={styles.seqArrow} aria-hidden="true" />
      <span className={`${styles.seqTile} ${styles.seqTileAfter}`}>
        <AfterIcon size={17} strokeWidth={1.8} />
        <span className={styles.seqLabel}>{afterLabel}</span>
      </span>
    </div>
  );
}

export const MockPreview: React.FC<MockPreviewProps> = ({
  accent,
  device = 'desktop',
  kicker = 'Con esto en mente',
  title,
  sub,
  block,
  revealed = true,
  className,
}) => {
  return (
    <div
      className={`${styles.templatePreview}${className ? ` ${className}` : ''}`}
      data-accent={accent}
      data-device={device}
      data-animate={revealed ? 'true' : undefined}
      style={ACCENT_VARS[accent]}
    >
      <div className={styles.tplNav}>
        <span className={styles.tplBrand} />
        <span className={styles.tplNavLinks} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.tplNavCta} />
        {/* Menú "hamburguesa" — solo visible en data-device="mobile" (ver
            .module.css), sustituye a los links + CTA de escritorio. */}
        <span className={styles.tplNavMenu} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>
      <div className={styles.tplHeadline}>
        <span className={styles.tplKicker}>{kicker}</span>
        <p className={styles.tplTitle}>{title}</p>
        {sub && <p className={styles.tplSub}>{sub}</p>}
      </div>
      <div className={styles.tplBlock}>
        {block.type === 'testimonial' && <TestimonialBlock />}
        {block.type === 'modules' && <ModulesBlock items={block.items} />}
        {block.type === 'sequence' && (
          <SequenceBlock
            beforeIcon={block.beforeIcon}
            afterIcon={block.afterIcon}
            beforeLabel={block.beforeLabel}
            afterLabel={block.afterLabel}
          />
        )}
      </div>
    </div>
  );
};
