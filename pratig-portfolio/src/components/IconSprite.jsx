import React from 'react';

// Renders the icon symbols inline (hidden) so every <use href="#id" />
// elsewhere in the app resolves reliably — referencing symbols from a
// separate /public/icons.svg file via <use> is inconsistent across
// browsers, inlining them once here avoids that entirely.
function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="github-icon" viewBox="0 0 19 19">
        <path fill="currentColor" fillRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clipRule="evenodd" />
      </symbol>
      <symbol id="linkedin-icon" viewBox="0 0 24 24">
        <path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12M7.12 20.45H3.56V9h3.56z" />
      </symbol>
      <symbol id="mail-icon" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M3.5 5.5h17a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1Z" />
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="m3 6.5 9 6.5 9-6.5" />
      </symbol>
      <symbol id="external-link-icon" viewBox="0 0 20 20">
        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M8 5H5a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 5 17h9a1.5 1.5 0 0 0 1.5-1.5v-3M12 3h5v5M9 11l8-8" />
      </symbol>
      <symbol id="game-icon" viewBox="0 0 20 20">
        <rect x="2" y="4" width="4" height="4" fill="currentColor" />
        <rect x="6" y="4" width="4" height="4" fill="currentColor" />
        <rect x="2" y="8" width="4" height="4" fill="currentColor" />
        <rect x="10" y="8" width="4" height="4" fill="currentColor" opacity="0.55" />
        <rect x="14" y="8" width="4" height="4" fill="currentColor" opacity="0.55" />
      </symbol>
    </svg>
  );
}

export default IconSprite;
