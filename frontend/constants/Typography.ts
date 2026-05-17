export const Typography = {
  // DM Sans ships only 400, 500, 700 from @expo-google-fonts/dm-sans.
  // We map semibold→500 and extrabold→700 (RN renders them with the bundled weight).
  family: {
    regular: 'DMSans_400Regular',
    medium: 'DMSans_500Medium',
    semibold: 'DMSans_500Medium',
    bold: 'DMSans_700Bold',
    extrabold: 'DMSans_700Bold',
  },
  size: {
    xxs: 10,
    xs: 11,
    sm: 12.5,
    base: 14,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 22,
    xxxl: 28,
    hero: 36,
  },
  weight: {
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};
