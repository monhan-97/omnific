import os from 'node:os';

function getDefaultInterfaceName() {
  let value: string | undefined = 'eth';
  const platform = os.platform();
  if (platform === 'darwin') {
    value = 'en';
  } else if (platform === 'win32') {
    value = undefined;
  }
  return value;
}

// typeof os.networkInterfaces family is a number (v18.0.0)
// types: 'IPv4' | 'IPv6' => 4 | 6
// @see https://github.com/nodejs/node/issues/42861
function matchName(actualFamily: string | number, expectedFamily: string | number) {
  if (expectedFamily === 'IPv4') {
    return actualFamily === 'IPv4' || actualFamily === 4;
  }
  if (expectedFamily === 'IPv6') {
    return actualFamily === 'IPv6' || actualFamily === 6;
  }
  return actualFamily === expectedFamily;
}

function findAddressFromInterface(
  items: os.NetworkInterfaceInfo[],
  expectedFamily: string | number,
  shouldIgnoreLoopbackAddress = false,
) {
  let firstMatchItem;
  for (const item of items) {
    if (!matchName(item.family, expectedFamily)) {
      continue;
    }

    if (shouldIgnoreLoopbackAddress && item.address.startsWith('127.')) {
      continue;
    }
    if (expectedFamily === 'IPv6') {
      // find the scopeid = 0 item
      if (item.scopeid === 0) return item;
      if (!firstMatchItem) {
        firstMatchItem = item;
      }
    } else {
      return item;
    }
  }
  return firstMatchItem;
}

/**
 * 根据 IP 协议族和网卡名称查找网络接口地址。
 */
export function getInterfaceAddress(family?: string, name?: string) {
  const interfaces = os.networkInterfaces();
  const isNoName = !name;
  name ||= getDefaultInterfaceName();
  family ||= 'IPv4';
  if (name) {
    for (let index = -1; index < 8; index++) {
      const interfaceName = name + (index >= 0 ? index : ''); // support 'lo' and 'lo0'
      const items = interfaces[interfaceName];
      if (items) {
        const item = findAddressFromInterface(items, family);
        if (item) {
          return item;
        }
      }
    }
  }

  if (isNoName) {
    // filter all loopback or local addresses
    for (const k in interfaces) {
      const items = interfaces[k];
      if (items) {
        // all 127 addresses are local and should be ignored
        const item = findAddressFromInterface(items, family, true);
        if (item) {
          return item;
        }
      }
    }
  }
  return;
}

/**
 * Get current machine IPv4
 *
 * interfaceName: interface name, default is 'eth' on Linux, 'en' on macOS.
 */
export function ip(interfaceName?: string) {
  const item = getInterfaceAddress('IPv4', interfaceName);
  return item?.address;
}

/**
 * Get current machine IPv6
 *
 * interfaceName: interface name, default is 'eth' on Linux, 'en' on macOS.
 */
export function ipv6(interfaceName?: string) {
  const item = getInterfaceAddress('IPv6', interfaceName);
  return item?.address;
}
