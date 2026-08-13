// Theme & Design System Tokens (DRY Centralized Constants)

export const THEME_CONFIG = {
  appName: 'Noterama',
  appVersion: 'v0.1.0',
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
  audioPlayer: {
    defaultHostOne: 'Host A (Tech Lead)',
    defaultHostTwo: 'Host B (Product Architect)',
    sampleDuration: '03:45',
  },
  aiPromptPlaceholders: {
    queryDefault: 'Tanyakan sesuatu tentang project ini...',
    aiRoleName: 'Notebook AI Guide',
  }
} as const;

export type ViewportMode = 'auto' | 'mobile' | 'tablet' | 'desktop';
