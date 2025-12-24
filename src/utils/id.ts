export function generateId(): string {
  return crypto.randomUUID();
}

export function timestamp(): string {
  return new Date().toISOString();
}

export function dateString(): string {
  return new Date().toISOString().split('T')[0];
}
