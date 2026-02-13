// Utility functions for the Chrome extension

/**
 * Format a timestamp to a human-readable date string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string
 */
export function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}

/**
 * Format a timestamp to a human-readable time string
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted time string
 */
export function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Get the start of the day for a given timestamp
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {number} Timestamp for the start of the day
 */
export function startOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/**
 * Get the end of the day for a given timestamp
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {number} Timestamp for the end of the day
 */
export function endOfDay(timestamp) {
  const date = new Date(timestamp);
  date.setHours(23, 59, 59, 999);
  return date.getTime();
}

/**
 * Group history items by date
 * @param {Array} historyItems - Array of history items
 * @returns {Object} Object with dates as keys and arrays of items as values
 */
export function groupHistoryByDate(historyItems) {
  const grouped = {};
  
  historyItems.forEach(item => {
    const date = startOfDay(item.lastVisitTime);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  
  // Sort each group by visit time (most recent first)
  Object.keys(grouped).forEach(date => {
    grouped[date].sort((a, b) => b.lastVisitTime - a.lastVisitTime);
  });
  
  return grouped;
}

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Extract domain from URL
 * @param {string} url - URL to extract domain from
 * @returns {string} Domain name
 */
export function getDomainFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url; // Return original URL if parsing fails
  }
}

/**
 * Highlight search terms in text
 * @param {string} text - Text to highlight
 * @param {string} searchTerm - Search term to highlight
 * @returns {string} HTML string with highlighted terms
 */
export function highlightText(text, searchTerm) {
  if (!text || !searchTerm || !searchTerm.trim()) {
    return text || '';
  }

  const regex = new RegExp(`(${escapeRegExp(searchTerm.trim())})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight bg-yellow-200 dark:bg-yellow-600 px-1 rounded">$1</mark>');
}

/**
 * Escape special regex characters in string
 * @param {string} string - String to escape
 * @returns {string} Escaped string
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Throttle a function call
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}