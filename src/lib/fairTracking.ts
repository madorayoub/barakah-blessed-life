/**
 * Utility functions for fair tracking messaging and logic
 */

export const FAIR_TRACKING_DAYS = 7; // Days to show fair tracking message

/**
 * Get the fair tracking message based on days since joining
 */
export const getFairTrackingMessage = (daysSinceJoining: number): string | null => {
  if (daysSinceJoining <= FAIR_TRACKING_DAYS) {
    return "Fair tracking - only counting from your join date";
  }
  return null;
};

/**
 * Get the fair tracking status text for display
 */
export const getFairTrackingStatus = (daysSinceJoining: number): string | null => {
  if (daysSinceJoining <= FAIR_TRACKING_DAYS) {
    return "Fair tracking active";
  }
  return null;
};

/**
 * Check if fair tracking is active
 */
export const isFairTrackingActive = (daysSinceJoining: number): boolean => {
  return daysSinceJoining <= FAIR_TRACKING_DAYS;
};