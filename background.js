// Service Worker for Chrome Extension V3
// Handles background operations and history events

// Install event - caches necessary files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  self.skipWaiting(); // Activate worker immediately
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  self.clients.claim(); // Claim all clients immediately
});

// Open history page when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  // Open the history page in a new tab
  chrome.tabs.create({ url: 'index.html' });
});

// Listen for history changes
chrome.history.onVisited.addListener((historyItem) => {
  console.log('New history item:', historyItem);
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  self.clients.claim(); // Claim all clients immediately
});

// Listen for history changes
chrome.history.onVisited.addListener((historyItem) => {
  console.log('New history item:', historyItem);
  // Could notify active tabs of new history item
});

chrome.history.onVisitRemoved.addListener((removed) => {
  console.log('History item removed:', removed);
  // Could notify active tabs of removed history item
});

// Only initialize context menus if the API is available
chrome.runtime.onInstalled.addListener(() => {
  // Check if contextMenus API is available
  if (chrome.contextMenus) {
    chrome.contextMenus.create({
      id: 'search-history',
      title: 'Search in browsing history',
      contexts: ['selection']
    });
  }
});

// Handle context menu clicks only if the API is available
if (chrome.contextMenus) {
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'search-history') {
      // Send message to content script or popup to initiate search
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'searchHistory',
          query: info.selectionText
        });
      });
    }
  });
}

// Listen for messages from extension pages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Service Worker received message:', request);
  
  switch(request.action) {
    case 'getHistory':
      handleGetHistory(request, sendResponse);
      return true; // Keep message channel open for async response
    
    case 'searchHistory':
      handleSearchHistory(request, sendResponse);
      return true;
      
    case 'deleteHistory':
      handleDeleteHistory(request, sendResponse);
      return true;
      
    default:
      console.warn('Unknown action:', request.action);
  }
});

function handleGetHistory(request, sendResponse) {
  const query = {
    text: request.text || '',
    startTime: request.startTime || 0,
    endTime: request.endTime || Date.now(),
    maxResults: request.maxResults || 1000
  };

  chrome.history.search(query, (results) => {
    sendResponse({ success: true, data: results });
  });
}

function handleSearchHistory(request, sendResponse) {
  const query = {
    text: request.query || '',
    startTime: request.startTime || 0,
    endTime: request.endTime || Date.now(),
    maxResults: request.maxResults || 1000
  };

  chrome.history.search(query, (results) => {
    sendResponse({ success: true, data: results });
  });
}

function handleDeleteHistory(request, sendResponse) {
  if (request.all) {
    chrome.history.deleteAll(() => {
      sendResponse({ success: true });
    });
  } else if (request.urls) {
    // Delete specific URLs
    request.urls.forEach(url => {
      chrome.history.deleteUrl({ url: url });
    });
    sendResponse({ success: true });
  } else if (request.startTime && request.endTime) {
    // Delete history in time range
    chrome.history.search({
      text: '',
      startTime: request.startTime,
      endTime: request.endTime
    }, (results) => {
      results.forEach(item => {
        chrome.history.deleteUrl({ url: item.url });
      });
      sendResponse({ success: true });
    });
    return true; // Async operation
  } else {
    sendResponse({ success: false, error: 'Invalid delete request' });
  }
  
  return false;
}