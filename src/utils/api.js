// Chrome API wrapper functions

/**
 * Get browser history with specified parameters
 * @param {Object} params - Parameters for history search
 * @param {string} params.text - Text to search for
 * @param {number} params.startTime - Start time for search (milliseconds since epoch)
 * @param {number} params.endTime - End time for search (milliseconds since epoch)
 * @param {number} params.maxResults - Maximum number of results to return
 * @returns {Promise<Array>} Promise that resolves to array of history items
 */
export async function getHistory(params = {}) {
  return new Promise((resolve, reject) => {
    const query = {
      text: params.text || '',
      startTime: params.startTime || 0,
      endTime: params.endTime || Date.now(),
      maxResults: params.maxResults || 1000
    };

    chrome.history.search(query, (results) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Search browser history
 * @param {string} query - Search query
 * @param {Object} options - Additional search options
 * @returns {Promise<Array>} Promise that resolves to array of matching history items
 */
export async function searchHistory(query = '', options = {}) {
  return new Promise((resolve, reject) => {
    const searchParams = {
      text: query,
      startTime: options.startTime || 0,
      endTime: options.endTime || Date.now(),
      maxResults: options.maxResults || 1000
    };

    chrome.history.search(searchParams, (results) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(results);
      }
    });
  });
}

/**
 * Delete a specific URL from history
 * @param {string} url - URL to delete
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export async function deleteHistoryUrl(url) {
  return new Promise((resolve, reject) => {
    chrome.history.deleteUrl({ url }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Delete all browsing history
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export async function deleteAllHistory() {
  return new Promise((resolve, reject) => {
    chrome.history.deleteAll(() => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

/**
 * Delete history in a specific time range
 * @param {number} startTime - Start time for deletion (milliseconds since epoch)
 * @param {number} endTime - End time for deletion (milliseconds since epoch)
 * @returns {Promise<void>} Promise that resolves when deletion is complete
 */
export async function deleteHistoryRange(startTime, endTime) {
  return new Promise((resolve, reject) => {
    // First, search for history in the time range
    chrome.history.search({
      text: '',
      startTime: startTime,
      endTime: endTime
    }, (results) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      // Then delete each URL individually
      let completed = 0;
      const total = results.length;

      if (total === 0) {
        resolve();
        return;
      }

      results.forEach(item => {
        chrome.history.deleteUrl({ url: item.url }, () => {
          completed++;
          if (completed === total) {
            resolve();
          }
        });
      });
    });
  });
}

/**
 * Get the URL for a website's favicon
 * @param {string} url - Website URL
 * @returns {string} Favicon URL
 */
export function getFaviconUrl(url) {
  try {
    // Using Chrome's internal favicon service
    return `chrome://favicon/size/16@1x/${url}`;
  } catch (e) {
    // Return a default icon if URL parsing fails
    return 'chrome://favicon/size/16@1x/https://www.google.com';
  }
}

/**
 * Get history statistics
 * @returns {Promise<Object>} Promise that resolves to history stats
 */
export async function getHistoryStats() {
  return new Promise((resolve) => {
    getHistory({ maxResults: 10000 })
      .then((allHistory) => {
        const totalItems = allHistory.length;
        
        const visitsByDay = {};
        allHistory.forEach(item => {
          const date = new Date(item.lastVisitTime);
          const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
          visitsByDay[dateStr] = (visitsByDay[dateStr] || 0) + 1;
        });
        
        const siteVisits = {};
        allHistory.forEach(item => {
          try {
            const url = new URL(item.url);
            const hostname = url.hostname.replace(/^www\./, '');
            siteVisits[hostname] = (siteVisits[hostname] || 0) + 1;
          } catch (e) {
            // Skip invalid URLs
          }
        });
        
        const mostVisitedSites = Object.entries(siteVisits)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([site, count]) => ({ site, count }));
        
        resolve({
          totalItems,
          visitsByDay,
          mostVisitedSites
        });
      })
      .catch((error) => {
        console.error('Error getting history stats:', error);
        resolve({
          totalItems: 0,
          visitsByDay: {},
          mostVisitedSites: []
        });
      });
  });
}