import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import {
  motion,
  AnimatePresence,
  animate,
  useMotionValue,
  useTransform,
} from 'framer-motion';

/*
  All shapes below are traced from the InkLock logo (1250x1250 space),
  so the animation uses the real logo elements:
  paper -> nib writes -> paper fades -> shield locks around nib -> name writes in.
*/

const TOTAL_MS = 6300; // when the preloader fades out

// The handwritten scribble the nib follows (pen tip follows this exact curve)
const WRITE_PATH =
  'M 480 455 C 510 435, 530 475, 560 455 C 590 435, 610 475, 640 455 C 670 435, 690 475, 720 455 C 740 435, 760 475, 770 455';

// Shield half (left side). Right side is the same shape mirrored.
const SHIELD_HALF =
  'M528 303 L522 340 C490 352 465 365 445 380 L445 480 C445 570 500 635 587 677 C600 700 608 725 614 752 C500 700 403 600 403 470 L403 358 Q403 349 412 346 C455 336 495 322 528 303 Z';

const CROWN =
  'M541 305 L539 272 Q540 266 546 262 L627 222 L708 262 Q714 266 715 272 L711 305 Z';

const NIB =
  'M566 367 L694 367 C700 400 722 440 755 490 C715 560 665 620 632 715 L622 715 C590 650 560 580 500 490 C535 450 555 405 566 367 Z';

export default function Preloader() {
  const [show, setShow] = useState(true);

  const pathRef = useRef(null);
  const progress = useMotionValue(0);
  const nibX = useMotionValue(0);
  const nibY = useMotionValue(0);
  const nibRot = useMotionValue(28);
  const nibOpacity = useMotionValue(0);
  const paperOpacity = useMotionValue(0);
  const inkOpacity = useMotionValue(1);

  const clipWidth = useTransform(progress, [0, 1], [0, 320]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    // nib tip rests at (627, 715) in the logo, so we move it by the difference
    const place = (v) => {
      const p = path.getPointAtLength(v * len);
      nibX.set(p.x - 627);
      nibY.set(p.y - 715);
    };

    progress.set(0);
    nibRot.set(28);
    nibOpacity.set(0);
    paperOpacity.set(0);
    inkOpacity.set(1);
    place(0);

    const unsub = progress.on('change', place);
    const controls = [];
    let cancelled = false;
    const play = (mv, to, opts) => {
      const c = animate(mv, to, opts);
      controls.push(c);
      return c;
    };

    const run = async () => {
      // 1. paper + nib appear
      play(paperOpacity, 1, { duration: 0.5 });
      play(nibOpacity, 1, { duration: 0.4, delay: 0.2 });
      // 2. nib writes along the scribble
      await play(progress, 1, { duration: 2.0, delay: 0.6, ease: 'easeInOut' });
      if (cancelled) return;
      // 3. paper + ink vanish, nib straightens to its logo position
      play(paperOpacity, 0, { duration: 0.5 });
      play(inkOpacity, 0, { duration: 0.5 });
      play(nibRot, 0, { duration: 0.8, ease: 'easeInOut' });
      play(nibX, 0, { duration: 0.8, ease: 'easeInOut' });
      play(nibY, 0, { duration: 0.8, ease: 'easeInOut' });
    };
    run();

    const timer = setTimeout(() => setShow(false), TOTAL_MS);

    return () => {
      cancelled = true;
      unsub();
      controls.forEach((c) => c.stop && c.stop());
      clearTimeout(timer);
    };
  }, []); // eslint-disable-line

  const lockSpring = { type: 'spring', stiffness: 120, damping: 13 };

  return (
    <AnimatePresence>
      {show && (
        <Box
          component={motion.div}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            bgcolor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            viewBox="270 200 720 780"
            style={{ width: 'min(40vmin, 280px)', height: 'auto', overflow: 'visible' }}
          >
            <defs>
              {/* purple -> blue -> cyan, same as the logo */}
              <linearGradient id="ilk-grad" gradientUnits="userSpaceOnUse" x1="403" y1="0" x2="851" y2="0">
                <stop offset="0" stopColor="#b23cff" />
                <stop offset="0.5" stopColor="#2f8bff" />
                <stop offset="1" stopColor="#00e8ff" />
              </linearGradient>
              {/* gradient for the mirrored (right) shield half */}
              <linearGradient id="ilk-grad-r" gradientUnits="userSpaceOnUse" x1="851" y1="0" x2="403" y2="0">
                <stop offset="0" stopColor="#b23cff" />
                <stop offset="0.5" stopColor="#2f8bff" />
                <stop offset="1" stopColor="#00e8ff" />
              </linearGradient>
              <linearGradient id="ilk-lock-text" gradientUnits="userSpaceOnUse" x1="565" y1="0" x2="968" y2="0">
                <stop offset="0" stopColor="#a24dff" />
                <stop offset="0.5" stopColor="#3c8bff" />
                <stop offset="1" stopColor="#00e8ff" />
              </linearGradient>
              <linearGradient id="ilk-nib-blue" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#bfe3ff" />
                <stop offset="1" stopColor="#7fb6ff" />
              </linearGradient>

              {/* keyhole cut out of the nib */}
              <mask id="ilk-nib-mask" maskUnits="userSpaceOnUse" x="480" y="350" width="300" height="380">
                <rect x="480" y="350" width="300" height="380" fill="#fff" />
                <circle cx="627" cy="466" r="28" fill="#000" />
                <path d="M611 485 L603 552 L651 552 L643 485 Z" fill="#000" />
                <rect x="622" y="552" width="10" height="165" fill="#000" />
              </mask>

              <filter id="ilk-shadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#7c6cff" floodOpacity="0.25" />
              </filter>

              <clipPath id="lets-get-started-clip">
                <motion.rect
                  x="470"
                  y="400"
                  height="100"
                  style={{ width: clipWidth }}
                />
              </clipPath>

              {/* left-to-right wipe for the name */}
              <clipPath id="ilk-text-clip">
                <motion.rect
                  x="280"
                  y="780"
                  height="180"
                  initial={{ width: 0 }}
                  animate={{ width: 700 }}
                  transition={{ delay: 4.4, duration: 1.0, ease: 'easeInOut' }}
                />
              </clipPath>
            </defs>

            {/* ---------- PAPER + HANDWRITING ---------- */}
            <motion.g style={{ opacity: paperOpacity }}>
              <rect x="440" y="400" width="380" height="360" rx="16" fill="#fbfaff" stroke="#e2dcff" strokeWidth="3" filter="url(#ilk-shadow)" />
              {[470, 530, 590, 650, 710].map((y) => (
                <line key={y} x1="470" y1={y} x2="790" y2={y} stroke="#ece8ff" strokeWidth="3" />
              ))}
            </motion.g>

            <motion.path
              ref={pathRef}
              d={WRITE_PATH}
              fill="none"
              stroke="transparent"
              style={{ pathLength: progress }}
            />
            <motion.g style={{ opacity: inkOpacity }} clipPath="url(#lets-get-started-clip)">
              <text
                x="480"
                y="460"
                fill="url(#ilk-grad)"
                fontFamily="'Brush Script MT', 'Caveat', 'Dancing Script', cursive"
                fontSize="48"
                fontWeight="500"
              >
                let's get started
              </text>
            </motion.g>

            {/* ---------- THE NIB (rotates around its tip) ---------- */}
            <motion.g
              style={{
                x: nibX,
                y: nibY,
                rotate: nibRot,
                opacity: nibOpacity,
                originX: 0.5,
                originY: 1,
              }}
            >
              <g mask="url(#ilk-nib-mask)">
                <path d={NIB} fill="#0b0b0f" />
                {/* light-blue lower-right area */}
                <path d="M700 430 C722 460 740 480 755 490 C715 560 665 620 632 715 L627 715 L627 565 L640 540 L655 500 Z" fill="url(#ilk-nib-blue)" />
                {/* light-blue lower-left sliver */}
                <path d="M572 568 C590 560 605 560 612 575 L618 600 L622 715 C600 680 582 630 572 568 Z" fill="#a9c9ff" />
              </g>
            </motion.g>

            {/* ---------- SHIELD LOCKS IN ---------- */}
            <motion.path
              d={SHIELD_HALF}
              fill="url(#ilk-grad)"
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ ...lockSpring, delay: 3.3 }}
            />
            <g transform="translate(1254,0) scale(-1,1)">
              <motion.path
                d={SHIELD_HALF}
                fill="url(#ilk-grad-r)"
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ ...lockSpring, delay: 3.3 }}
              />
            </g>

            {/* crown + bar drop on top */}
            <motion.path
              d={CROWN}
              fill="url(#ilk-grad)"
              initial={{ y: -140, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...lockSpring, delay: 3.75 }}
            />
            <motion.rect
              x="547"
              y="320"
              width="161"
              height="32"
              rx="8"
              fill="url(#ilk-grad)"
              initial={{ y: -110, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...lockSpring, delay: 3.9 }}
            />

            {/* ---------- NAME WRITES IN ---------- */}
            <g clipPath="url(#ilk-text-clip)">
              <text
                x="290"
                y="935"
                fill="#0b0b0f"
                fontFamily="'Poppins','Inter','Segoe UI',sans-serif"
                fontWeight="800"
                fontSize="196"
                textLength="255"
                lengthAdjust="spacingAndGlyphs"
              >
                Ink
              </text>
              <text
                x="565"
                y="935"
                fill="url(#ilk-lock-text)"
                fontFamily="'Poppins','Inter','Segoe UI',sans-serif"
                fontWeight="800"
                fontSize="196"
                textLength="403"
                lengthAdjust="spacingAndGlyphs"
              >
                Lock
              </text>
            </g>
          </svg>
        </Box>
      )}
    </AnimatePresence>
  );
}
