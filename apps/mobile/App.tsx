import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, useWindowDimensions } from 'react-native';

// DRY Tokens Constants
const COLORS = {
  bgPrimary: '#0f172a',
  bgSurface: '#1e293b',
  bgCardSelected: 'rgba(99, 102, 241, 0.15)',
  accentIndigo: '#6366f1',
  accentIndigoButton: '#4f46e5',
  borderSubtle: '#334155',
  borderHeader: '#1e293b',
  textPrimary: '#ffffff',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textBadge: '#818cf8',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 24,
};

const RADIUS = {
  sm: 6,
  md: 10,
  lg: 12,
  xl: 16,
};

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

export default function App() {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject>(SAMPLE_PORTFOLIO[0]);
  const { width } = useWindowDimensions();

  // Responsive dynamic layout styles based on screen width (Mobile vs Tablet)
  const isTablet = width >= 768;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bgPrimary} />
      
      {/* App Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <Text style={[styles.headerTitle, isTablet && styles.headerTitleTablet]}>Noterama Mobile</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NotebookLM Mode</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, isTablet && styles.contentTablet]}>
        {/* Audio Deep Dive Card */}
        <View style={[styles.audioCard, isTablet && styles.audioCardTablet]}>
          <Text style={styles.audioTitle}>🎧 Audio Overview Studio</Text>
          <Text style={styles.audioSub}>
            Listen to an AI-generated conversation analyzing "{selectedProject.title}".
          </Text>
          <TouchableOpacity style={styles.audioButton}>
            <Text style={styles.audioButtonText}>Play Project Audio Summary</Text>
          </TouchableOpacity>
        </View>

        {/* Selected Project Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Project Note</Text>
        </View>
        <View style={styles.projectCard}>
          <Text style={styles.projectTitle}>{selectedProject.title}</Text>
          <Text style={styles.projectDesc}>{selectedProject.description}</Text>
          <View style={styles.tagContainer}>
            {selectedProject.techStack.map((tech: string) => (
              <View key={tech} style={styles.tag}>
                <Text style={styles.tagText}>{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Project Selector List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Select Notebook Project</Text>
        </View>
        <View style={isTablet ? styles.tabletGrid : null}>
          {SAMPLE_PORTFOLIO.map((item: PortfolioProject) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                selectedProject.id === item.id && styles.itemCardSelected,
                isTablet && styles.itemCardTablet
              ]}
              onPress={() => setSelectedProject(item)}
            >
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemSubtitle} numberOfLines={1}>{item.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderHeader,
  },
  headerTablet: {
    paddingHorizontal: SPACING.xl * 1.5,
    paddingVertical: SPACING.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerTitleTablet: {
    fontSize: 24,
  },
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  badgeText: {
    color: COLORS.textBadge,
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.lg,
  },
  contentTablet: {
    padding: SPACING.xl * 1.5,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  audioCard: {
    backgroundColor: '#1e1b4b',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: '#4338ca',
  },
  audioCardTablet: {
    padding: SPACING.xl,
  },
  audioTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  audioSub: {
    fontSize: 12,
    color: '#c7d2fe',
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  audioButton: {
    backgroundColor: COLORS.accentIndigoButton,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  audioButtonText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  projectCard: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  projectDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs + 2,
  },
  tag: {
    backgroundColor: COLORS.bgPrimary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  tagText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
  tabletGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  itemCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm + 2,
    borderWidth: 1,
    borderColor: COLORS.borderSubtle,
  },
  itemCardTablet: {
    flex: 1,
    marginBottom: 0,
  },
  itemCardSelected: {
    borderColor: COLORS.accentIndigo,
    backgroundColor: COLORS.bgCardSelected,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  itemSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
