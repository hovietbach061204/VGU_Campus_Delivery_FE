// Location Testing and Debugging Utilities
// These utilities help test and debug location access issues

export interface LocationTestResult {
  success: boolean;
  location?: {
    lat: number;
    lon: number;
    accuracy: number;
  };
  error?: {
    code: number;
    message: string;
  };
  timeTaken: number;
  testType: string;
}

/**
 * Test location access with different configurations to find optimal settings
 */
export const runLocationTests = async (): Promise<LocationTestResult[]> => {
  const results: LocationTestResult[] = [];

  // Test 1: High accuracy, short timeout
  results.push(
    await testLocationConfig({
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      testType: 'High Accuracy (5s)',
    })
  );

  // Test 2: Standard accuracy, medium timeout
  results.push(
    await testLocationConfig({
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 60000,
      testType: 'Standard Accuracy (10s)',
    })
  );

  // Test 3: Cached position allowed
  results.push(
    await testLocationConfig({
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 300000,
      testType: 'Cached Position (15s)',
    })
  );

  return results;
};

/**
 * Test a specific geolocation configuration
 */
const testLocationConfig = async (options: {
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  testType: string;
}): Promise<LocationTestResult> => {
  const startTime = Date.now();

  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: options.enableHighAccuracy,
          timeout: options.timeout,
          maximumAge: options.maximumAge,
        });
      }
    );

    return {
      success: true,
      location: {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
      },
      timeTaken: Date.now() - startTime,
      testType: options.testType,
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
      },
      timeTaken: Date.now() - startTime,
      testType: options.testType,
    };
  }
};

/**
 * Run comprehensive location diagnostics
 */
export const runLocationDiagnostics = async (): Promise<void> => {
  console.group('🔍 Comprehensive Location Diagnostics');

  // Basic support checks
  console.log('Geolocation API Support:', !!navigator.geolocation);
  console.log('Secure Context:', window.isSecureContext);
  console.log('Protocol:', window.location.protocol);
  console.log('Hostname:', window.location.hostname);

  // Permission check
  if ('permissions' in navigator) {
    try {
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });
      console.log('Permission State:', permission.state);
    } catch (err) {
      console.warn('Could not check permission state:', err);
    }
  }

  // Connection info (if available)
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    console.log('Network Info:', {
      effectiveType: connection?.effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
    });
  }

  // Battery info (if available)
  if ('getBattery' in navigator) {
    try {
      const battery = await (navigator as any).getBattery();
      console.log('Battery Info:', {
        charging: battery.charging,
        level: battery.level,
      });
    } catch (err) {
      console.warn('Could not get battery info:', err);
    }
  }

  // Run location tests
  console.log('\\n🧪 Running Location Tests...');
  const testResults = await runLocationTests();

  testResults.forEach((result, index) => {
    console.log(`\\nTest ${index + 1}: ${result.testType}`);
    if (result.success) {
      console.log('✅ Success:', {
        location: result.location,
        timeTaken: result.timeTaken + 'ms',
      });
    } else {
      console.log('❌ Failed:', {
        error: result.error,
        timeTaken: result.timeTaken + 'ms',
      });
    }
  });

  console.groupEnd();
};

/**
 * Monitor location access patterns over time
 */
export const startLocationMonitoring = (
  duration: number = 60000
): (() => void) => {
  console.log(`📊 Starting location monitoring for ${duration / 1000}s...`);

  const results: LocationTestResult[] = [];
  const interval = setInterval(async () => {
    const result = await testLocationConfig({
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 30000,
      testType: 'Monitor',
    });
    results.push(result);

    const successRate =
      (results.filter((r) => r.success).length / results.length) * 100;
    console.log(
      `📍 Location test ${results.length}: ${result.success ? '✅' : '❌'} (Success rate: ${successRate.toFixed(1)}%)`
    );
  }, 5000);

  const timeout = setTimeout(() => {
    clearInterval(interval);
    const successCount = results.filter((r) => r.success).length;
    const successRate = (successCount / results.length) * 100;
    console.log(`\\n📊 Location Monitoring Complete:`, {
      totalTests: results.length,
      successCount,
      successRate: successRate.toFixed(1) + '%',
      averageTime:
        results.reduce((sum, r) => sum + r.timeTaken, 0) / results.length,
    });
  }, duration);

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
    console.log('⏹️ Location monitoring stopped');
  };
};

/**
 * Get optimal location settings based on current conditions
 */
export const getOptimalLocationSettings = async (): Promise<{
  enableHighAccuracy: boolean;
  timeout: number;
  maximumAge: number;
  reasoning: string;
}> => {
  // Test high accuracy first
  const highAccuracyTest = await testLocationConfig({
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
    testType: 'High Accuracy Test',
  });

  if (highAccuracyTest.success && highAccuracyTest.timeTaken < 3000) {
    return {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000,
      reasoning: 'High accuracy GPS works quickly on this device',
    };
  }

  // Check battery level for decision
  let batteryLevel = 1;
  try {
    if ('getBattery' in navigator) {
      const battery = await (navigator as any).getBattery();
      batteryLevel = battery.level;
    }
  } catch (err) {
    console.warn('Could not determine battery level');
  }

  if (batteryLevel < 0.2) {
    return {
      enableHighAccuracy: false,
      timeout: 15000,
      maximumAge: 300000,
      reasoning: 'Low battery detected - using power-efficient settings',
    };
  }

  // Check network conditions
  let isSlowNetwork = false;
  try {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      isSlowNetwork =
        connection?.effectiveType === 'slow-2g' ||
        connection?.effectiveType === '2g' ||
        connection?.rtt > 1000;
    }
  } catch (err) {
    console.warn('Could not determine network conditions');
  }

  if (isSlowNetwork) {
    return {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 600000,
      reasoning: 'Slow network detected - using longer timeouts and cache',
    };
  }

  // Default balanced settings
  return {
    enableHighAccuracy: false,
    timeout: 12000,
    maximumAge: 180000,
    reasoning: 'Balanced settings for general use',
  };
};
