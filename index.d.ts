/**
 * @typedef ResourceUsage
 * Represents memory or CPU usage information passed to the `ready` callback.
 */
export interface ResourceUsage {
  /** Current memory usage in MB (if memory limit was exceeded) */
  memory?: number;
  /** Current CPU usage in % (if CPU limit was exceeded) */
  cpu?: number;
}

/**
 * @typedef EuthanasiaOptions
 * Options for the `euthanasia` function.
 */
export interface EuthanasiaOptions {
  /** Memory limit in MB */
  memory?: number;
  /** CPU usage limit in % */
  cpu?: number;
  /** Check interval in milliseconds */
  interval?: number;
  /**
   * Called when memory or CPU usage exceeds defined limits.
   * If it returns false, the process will continue running.
   */
  ready?: (usage: ResourceUsage) => Promise<boolean>;
}

/**
 * Starts monitoring memory and CPU usage and exits the process
 * when the limits are exceeded and the `ready` callback confirms termination.
 */
declare function euthanasia(options?: EuthanasiaOptions): void;

export = euthanasia;
