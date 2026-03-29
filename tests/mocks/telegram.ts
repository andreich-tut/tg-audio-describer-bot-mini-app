/**
 * Telegram WebApp mock for Playwright E2E tests
 * This script injects Telegram WebApp mock into the page before tests run
 */

export const telegramMock = `
  window.Telegram = {
    WebApp: {
      initData: 'test_init_data',
      initDataUnsafe: {
        user: {
          id: 123456,
          first_name: 'Test',
          last_name: 'User',
          username: 'testuser',
        },
      },
      themeParams: {
        bg_color: '#020617',
        text_color: '#f8fafc',
        hint_color: '#64748b',
        link_color: '#8b5cf6',
        button_color: '#8b5cf6',
        button_text_color: '#ffffff',
      },
      viewportHeight: 667,
      viewportStableHeight: 667,
      isExpanded: false,
      expand: function() {
        this.isExpanded = true;
        this.viewportHeight = 800;
        this.viewportStableHeight = 800;
      },
      close: function() {},
      openLink: function(url) {
        window.__telegramOpenLink = url;
      },
      openTelegramLink: function(url) {
        window.__telegramOpenTelegramLink = url;
      },
      switchInlineQuery: function(query) {
        window.__telegramSwitchInlineQuery = query;
      },
      showPopup: function(popup, callback) {
        window.__telegramPopup = popup;
        if (callback) callback('button_id');
      },
      showAlert: function(message, callback) {
        window.__telegramAlert = message;
        if (callback) callback();
      },
      showConfirm: function(message, callback) {
        window.__telegramConfirm = message;
        if (callback) callback(true);
      },
      showScanQrPopup: function(qr, callback) {
        window.__telegramQr = qr;
      },
      hapticFeedback: {
        impactOccurred: function(style) {
          window.__hapticImpact = style;
        },
        notificationOccurred: function(type) {
          window.__hapticNotification = type;
        },
        selectionChanged: function() {
          window.__hapticSelection = true;
        },
      },
      CloudStorage: {
        setItem: function(key, value, callback) {
          window.__cloudStorage = window.__cloudStorage || {};
          window.__cloudStorage[key] = value;
          if (callback) callback(null);
        },
        getItem: function(key, callback) {
          const value = (window.__cloudStorage || {})[key];
          if (callback) callback(null, value);
        },
        getItems: function(keys, callback) {
          const storage = window.__cloudStorage || {};
          const result = keys.map(key => storage[key] || null);
          if (callback) callback(null, result);
        },
        removeItem: function(key, callback) {
          if (window.__cloudStorage) {
            delete window.__cloudStorage[key];
          }
          if (callback) callback(null);
        },
        getKeys: function(callback) {
          const keys = Object.keys(window.__cloudStorage || {});
          if (callback) callback(null, keys);
        },
      },
      MainButton: {
        text: '',
        color: '#8b5cf6',
        textColor: '#ffffff',
        isVisible: false,
        isActive: false,
        isProgressVisible: false,
        show: function() { this.isVisible = true; },
        hide: function() { this.isVisible = false; },
        enable: function() { this.isActive = true; },
        disable: function() { this.isActive = false; },
        showProgress: function() { this.isProgressVisible = true; },
        hideProgress: function() { this.isProgressVisible = false; },
        onClick: function(callback) { this._onClick = callback; },
        offClick: function(callback) { this._onClick = null; },
        setParams: function(params) {
          if (params.text) this.text = params.text;
          if (params.color) this.color = params.color;
          if (params.text_color) this.textColor = params.text_color;
        },
      },
      BackButton: {
        isVisible: false,
        show: function() { this.isVisible = true; },
        hide: function() { this.isVisible = false; },
        onClick: function(callback) { this._onClick = callback; },
        offClick: function(callback) { this._onClick = null; },
      },
      SettingsButton: {
        isVisible: false,
      },
      onEvent: function(eventType, callback) {
        window.__telegramEvents = window.__telegramEvents || {};
        window.__telegramEvents[eventType] = callback;
      },
      offEvent: function(eventType, callback) {
        if (window.__telegramEvents) {
          delete window.__telegramEvents[eventType];
        }
      },
      ready: function() {},
      setHeaderColor: function(color) {
        window.__telegramHeaderColor = color;
      },
      setBackgroundColor: function(color) {
        window.__telegramBgColor = color;
      },
      enableClosingConfirmation: function() {
        this.isClosingConfirmationEnabled = true;
      },
      disableClosingConfirmation: function() {
        this.isClosingConfirmationEnabled = false;
      },
      version: '7.0',
      platform: 'web',
      colorScheme: 'dark',
    }
  };
`

/**
 * Initialize Telegram mock before each test
 */
export async function initTelegramMock(page: import('@playwright/test').Page) {
  // Add init script before page loads
  await page.addInitScript(telegramMock)
}
