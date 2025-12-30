export interface ExamplePayload {
  label: string;
  value: string;
  description: string;
  category: 'basic' | 'advanced' | 'stealing' | 'phishing' | 'defacement';
  dangerLevel: 1 | 2 | 3;
}
