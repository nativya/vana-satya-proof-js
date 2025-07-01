// Language Unicode Ranges
export const languageUnicodeRanges: Record<string, [number, number][]> = {
  hi: [[0x0900, 0x097F]], // Hindi (Devanagari)
  en: [[0x0041, 0x005A], [0x0061, 0x007A]], // English (Latin)
  ta: [[0x0B80, 0x0BFF]], // Tamil
  bn: [[0x0980, 0x09FF]], // Bengali
  // Add more as needed
};

// Detect percentage of text in the target language
export function detectLanguagePercentage(text: string, languageCode: string): number {
  const ranges = languageUnicodeRanges[languageCode];
  if (!ranges) return 0;
  let matchCount = 0;
  for (const char of text) {
    const code = char.charCodeAt(0);
    if (ranges.some(([start, end]) => code >= start && code <= end)) {
      matchCount++;
    }
  }
  return text.length > 0 ? (matchCount / text.length) * 100 : 0;
} 