
/**
 * Class to handle cookies
 */
export class Cookie {

  /**
   * Set a cookie
   * @param name Cookie name
   * @param value Cookie value
   * @param expiresAt Expiration date in miliseconds
   */
  public static setCookie(name: string, value: string, expiresAt?: number): void {
    const date = new Date();
    const expire = expiresAt || 7 * 24 * 60 * 60 * 1000;
    date.setTime(date.getTime() + expire);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  }

  /**
   * Retrieve a cookie value
   * @param name Cookie name
   * @returns Cookie value or undefined
   */
  public static getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      const lastElement: string | undefined = parts.pop();
      return !lastElement ? undefined : lastElement.split(';').shift();
    }
  }

  /**
   * Invalidate a cookie
   * @param name Cookie name
   */
  public static deleteCookie(name: string): void {
    const date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=; expires=${date.toUTCString()}; path=/`;
  }

}
