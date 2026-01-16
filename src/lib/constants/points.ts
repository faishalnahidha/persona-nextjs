/**
 * Points System Constants
 *
 * Centralized configuration for gamification points.
 * Adjust these values to balance the reward system.
 */

export const POINTS = {
  // Assessment-related
  START_TEST: 100,
  TEST_ANSWER: 40, // Per a set of question answered
  COMPLETE_TEST: 500, // Bonus for completing entire assessment

  // User actions
  REGISTRATION: 200,
  DAILY_LOGIN: 100,

  // Content-related
  READ_CONTENT: 100, // Per article read
  SHARE_CONTENT: 200,
  COMMENT: 100,

  // Future features (commented out for now)
  // REFER_FRIEND: 500,
  // COMPLETE_PROFILE: 150,
  // STREAK_BONUS: 50, // Per day streak
} as const;

/**
 * Point Reason Types
 * Used for consistent tracking in pointsHistory
 */
export const POINT_REASONS = {
  START_TEST: 'start_test',
  TEST_ANSWER: 'test_answer',
  COMPLETE_TEST: 'complete_test',
  REGISTRATION: 'registration',
  DAILY_LOGIN: 'daily_login',
  READ_CONTENT: 'read_content',
  SHARE_CONTENT: 'share_content',
  COMMENT: 'comment',
} as const;

/**
 * Helper type for type-safe point reasons
 */
export type PointReason = (typeof POINT_REASONS)[keyof typeof POINT_REASONS];
