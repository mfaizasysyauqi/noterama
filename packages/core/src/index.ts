export * from './theme';
export * from './settings';

export interface NotebookSource {
  id: string;
  title: string;
  type: 'pdf' | 'text' | 'link' | 'audio';
  contentSnippet: string;
  url?: string;
  addedAt: string;
}

export interface NoteItem {
  id: string;
  title: string;
  summary: string;
  keyInsights: string[];
  tags: string[];
  audioGuideUrl?: string;
  createdAt: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  notebookId: string;
  demoUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export const SAMPLE_PORTFOLIO: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: 'AI Audio Notebook Studio',
    description: 'A NotebookLM inspired interactive portfolio allowing visitors to query project documents and listen to generated audio summaries.',
    techStack: ['Next.js', 'React Native', 'TypeScript', 'Tailwind CSS', 'Web Audio API'],
    notebookId: 'nb-1',
    demoUrl: 'https://noterama.dev',
    githubUrl: 'https://github.com/mfaizasysyauqi/noterama',
    featured: true
  },
  {
    id: 'proj-2',
    title: 'Cross-Platform State Engine',
    description: 'Shared core state library power-driven for seamless data synchronization between React Web & Expo Mobile clients.',
    techStack: ['React', 'React Native', 'Turborepo', 'TypeScript'],
    notebookId: 'nb-2',
    githubUrl: 'https://github.com/mfaizasysyauqi/core-engine',
    featured: true
  }
];
