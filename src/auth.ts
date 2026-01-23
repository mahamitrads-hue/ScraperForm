export const AUTH_EMAIL = 'mahamitrads@gmail.com';
export const AUTH_PASSWORD = 'Jaihanuman5@Sriram';

export function validateCredentials(email: string, password: string): boolean {
  return email.trim() === AUTH_EMAIL && password === AUTH_PASSWORD;
}

export function isAuthenticated(): boolean {
  return localStorage.getItem('auth') === 'true';
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    localStorage.setItem('auth', 'true');
  } else {
    localStorage.removeItem('auth');
  }
}
