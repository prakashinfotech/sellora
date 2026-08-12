import { Link } from 'react-router-dom';

/**
 * Sellora wordmark.
 *
 * The source PNG (1536x1024) is a transparent logo centred inside a large
 * empty canvas. Rendering it directly would make the mark look tiny, so the
 * container clips to the artwork's real bounding box (x:20 y:255 w:1450 h:445)
 * and the image is scaled up inside it. Nothing is squashed — the image keeps
 * its native aspect ratio, we only crop the surrounding transparent padding.
 */
const CROP = {
  width: '105.93%', // 1536 / 1450
  height: '230.11%', // 1024 / 445
  left: '-1.38%', //  -20 / 1450
  top: '-57.30%', // -255 /  445
};

interface Props {
  /** Tailwind height class — the width follows from the logo's aspect ratio. */
  className?: string;
  /** Render as a link to the homepage (default) or a plain mark. */
  to?: string | null;
}

export default function Logo({ className = 'h-8', to = '/' }: Props) {
  const mark = (
    <span
      className={`relative block shrink-0 overflow-hidden aspect-[1450/445] ${className}`}
    >
      <img
        src="/imgs/selloraLogo.png"
        alt="Sellora"
        style={CROP}
        className="absolute max-w-none select-none"
        draggable={false}
      />
    </span>
  );

  if (!to) return mark;

  return (
    <Link to={to} aria-label="Sellora home" className="shrink-0">
      {mark}
    </Link>
  );
}
