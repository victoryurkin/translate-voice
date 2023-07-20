export type NotificationCallback = (data: unknown) => void;

export enum Events {
  AUTH_SIGNOUT = 'translateme.events.auth.signout',
}

/**
 * Notification events
 */
export const notifications = {
  on(event: string, callback: NotificationCallback) {
    document && document.addEventListener(event, callback);
  },
  dispatch(event: string, data?: unknown) {
    document && document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },
  remove(event: string, callback: NotificationCallback) {
    document && document.removeEventListener(event, callback);
  },
};
