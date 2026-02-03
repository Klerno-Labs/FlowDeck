/**
 * Device Detection Utility
 * Parses user agent strings to identify devices and browsers
 */

import UAParser from 'ua-parser-js';

export interface DeviceInfo {
  browser: string;
  os: string;
  deviceType: 'desktop' | 'tablet' | 'mobile' | 'unknown';
}

/**
 * Parse user agent string to extract device information
 */
export function parseUserAgent(userAgent: string): DeviceInfo {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let deviceType: DeviceInfo['deviceType'] = 'unknown';
  if (result.device.type === 'mobile') {
    deviceType = 'mobile';
  } else if (result.device.type === 'tablet') {
    deviceType = 'tablet';
  } else if (result.device.type === undefined || result.device.type === 'desktop') {
    // If no type specified, assume desktop
    deviceType = 'desktop';
  }

  return {
    browser: `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os: `${result.os.name || 'Unknown'} ${result.os.version || ''}`.trim(),
    deviceType,
  };
}

/**
 * Get a human-readable device description
 */
export function getDeviceDescription(deviceInfo: DeviceInfo): string {
  const deviceTypeLabel = {
    desktop: '🖥️ Desktop',
    tablet: '📱 Tablet',
    mobile: '📱 Mobile',
    unknown: '❓ Unknown Device',
  }[deviceInfo.deviceType];

  return `${deviceTypeLabel} • ${deviceInfo.browser} • ${deviceInfo.os}`;
}
