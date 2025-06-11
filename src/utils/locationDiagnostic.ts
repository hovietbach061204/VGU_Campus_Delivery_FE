// Geolocation Diagnostic Utility
// This file helps debug location access issues

export interface LocationDiagnostic {
  isSupported: boolean;
  isSecureContext: boolean;
  permissionStatus?: PermissionState;
  currentPosition?: {
    lat: number;
    lon: number;
    accuracy: number;
  };
  error?: {
    code: number;
    message: string;
  };
}

export const diagnoseLocationAccess = async (): Promise<LocationDiagnostic> => {
  const diagnostic: LocationDiagnostic = {
    isSupported: !!navigator.geolocation,
    isSecureContext:
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1',
  };

  // Check permission status
  if ('permissions' in navigator) {
    try {
      const permission = await navigator.permissions.query({
        name: 'geolocation',
      });
      diagnostic.permissionStatus = permission.state;
    } catch (err) {
      console.warn('Unable to check geolocation permission status:', err);
    }
  }

  // Try to get current position
  if (diagnostic.isSupported) {
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          });
        }
      );

      diagnostic.currentPosition = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
    } catch (err: any) {
      diagnostic.error = {
        code: err.code,
        message: err.message,
      };
    }
  }

  return diagnostic;
};

export const getLocationErrorMessage = (
  error: GeolocationPositionError
): string => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access was denied. Please enable location permissions in your browser settings.';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable. Please check your GPS/location services.';
    case error.TIMEOUT:
      return 'Location request timed out. Please try again.';
    default:
      return `An unknown error occurred: ${error.message}`;
  }
};

export const logLocationDiagnostic = async (): Promise<void> => {
  const diagnostic = await diagnoseLocationAccess();

  console.group('🔍 Location Access Diagnostic');
  console.log('Geolocation supported:', diagnostic.isSupported);
  console.log('Secure context (HTTPS/localhost):', diagnostic.isSecureContext);
  console.log('Permission status:', diagnostic.permissionStatus || 'Unknown');

  if (diagnostic.currentPosition) {
    console.log('Current position:', diagnostic.currentPosition);
  }

  if (diagnostic.error) {
    console.error('Geolocation error:', diagnostic.error);
    console.log(
      'Error message:',
      getLocationErrorMessage(diagnostic.error as any)
    );
  }

  console.groupEnd();
};

// Browser compatibility check
export const checkLocationCompatibility = (): {
  supported: boolean;
  issues: string[];
} => {
  const issues: string[] = [];

  if (!navigator.geolocation) {
    issues.push('Geolocation API not supported');
  }

  if (
    window.location.protocol !== 'https:' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    issues.push('Geolocation requires HTTPS (except on localhost)');
  }

  if (!window.isSecureContext) {
    issues.push('Not in a secure context');
  }

  return {
    supported: issues.length === 0,
    issues,
  };
};

// Simple performance tracking for location requests
export class LocationTracker {
  private static instance: LocationTracker;
  private successCount = 0;
  private totalCount = 0;
  private lastSuccess = 0;

  static getInstance(): LocationTracker {
    if (!LocationTracker.instance) {
      LocationTracker.instance = new LocationTracker();
    }
    return LocationTracker.instance;
  }

  recordAttempt(success: boolean): void {
    this.totalCount++;
    if (success) {
      this.successCount++;
      this.lastSuccess = Date.now();
    }
  }

  getSuccessRate(): number {
    return this.totalCount > 0
      ? (this.successCount / this.totalCount) * 100
      : 0;
  }

  getSummary(): {
    successRate: number;
    totalAttempts: number;
    lastSuccess: number;
  } {
    return {
      successRate: this.getSuccessRate(),
      totalAttempts: this.totalCount,
      lastSuccess: this.lastSuccess,
    };
  }
}
