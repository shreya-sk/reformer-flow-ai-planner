
// Toast system completely removed per user request
// All feedback is now handled through UI state changes and inline messages

export const logAction = (action: string, details?: any) => {
  console.log(`✅ ${action}`, details);
};

export const logError = (error: string, details?: any) => {
  console.error(`❌ ${error}`, details);
};
