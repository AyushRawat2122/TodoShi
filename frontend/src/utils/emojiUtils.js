// Comprehensive emoji regex pattern
const EMOJI_REGEX = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F)/gu;

/**
 * Analyzes message content and returns emoji sizing information
 * @param {string} content - The message content
 * @returns {object} - Object containing emoji count, has text, and CSS class
 */
export const analyzeEmojiContent = (content) => {
  if (!content || typeof content !== 'string') {
    return { emojiCount: 0, hasText: false, sizeClass: '' };
  }

  // Remove all emojis and check if any text remains
  const textWithoutEmojis = content.replace(EMOJI_REGEX, '').trim();
  const hasText = textWithoutEmojis.length > 0;

  // Count emojis
  const emojiMatches = content.match(EMOJI_REGEX);
  const emojiCount = emojiMatches ? emojiMatches.length : 0;

  // Determine size class based on WhatsApp logic
  let sizeClass = '';
  
  if (emojiCount > 0 && !hasText) {
    // Only emojis, no text
    if (emojiCount === 1) {
      sizeClass = 'emoji-jumbo'; // Very large single emoji
    } else if (emojiCount <= 3) {
      sizeClass = 'emoji-large'; // Large for 2-3 emojis
    } else if (emojiCount <= 6) {
      sizeClass = 'emoji-medium'; // Medium for 4-6 emojis
    } else {
      sizeClass = 'emoji-small'; // Smaller for many emojis
    }
  }
  // If hasText is true, no special class (inline with text)

  return {
    emojiCount,
    hasText,
    sizeClass,
    isEmojiOnly: emojiCount > 0 && !hasText
  };
};

export const wrapEmojisWithClass = (content, sizeClass) => {
  if (!sizeClass) return content;
  
  return content.replace(EMOJI_REGEX, (emoji) => {
    return `<span class="${sizeClass}">${emoji}</span>`;
  });
};
