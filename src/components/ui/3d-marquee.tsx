import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}

interface ThreeDMarqueeProps {
  className?: string;
}

const TEXT_PHRASES = [
  'UI / UX DESIGN',
  'WEB DESIGN',
  'BRANDING',
  'SEO',
  'SOCIAL MEDIA',
  'AI SOLUTIONS',
  'MOTION GRAPHICS',
  'CREATIVE DIRECTION',
  'LOCAL SEO',
  'AI AUTOMATION',
  'WEB DEVELOPMENT',
  'GRAPHIC DESIGN',
  'CONTENT STRATEGY',
  'BRAND IDENTITY',
  'AI CHATBOTS',
  'LANDING PAGES',
];

const COLS = 6;
const PER_COL = 8;

const ThreeDMarquee = ({ className }: ThreeDMarqueeProps) => {
  const columns = Array.from({ length: COLS }, (_, colIndex) => {
    const items: string[] = [];
    for (let i = 0; i < PER_COL; i++) {
      items.push(TEXT_PHRASES[(colIndex * 3 + i) % TEXT_PHRASES.length]);
    }
    return items;
  });

  return (
    <div
      className={cn(
        'mx-auto block h-[43rem] w-full overflow-hidden rounded-md',
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[120rem] shrink-0">
          <div
            style={{ transform: 'rotateX(50deg) rotateY(0deg) rotateZ(50deg)', transformStyle: 'preserve-3d' }}
            className="relative top-[-20%] left-[25%] grid size-full origin-top-left">
            <div className="grid grid-cols-6 gap-4 size-full">
              {columns.map((col, colIndex) => (
                <motion.div
                  animate={{ y: colIndex % 2 === 0 ? 35 : -35 }}
                  transition={{
                    duration: 10 + colIndex * 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  key={colIndex}
                  className="flex flex-col items-stretch gap-4"
                >
                  {col.map((text, i) => (
                    <div
                      key={i + text + colIndex}
                      className="flex flex-1 min-h-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4"
                    >
                      <span className="text-[0.65rem] font-bold tracking-[0.2em] text-white/30 whitespace-nowrap">
                        {text}
                      </span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeDMarquee;
