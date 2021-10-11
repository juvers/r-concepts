interface AnyData {
  [key: string]: string | number | null;
}

interface Window {
  readonly gtag: (cmd: 'config', id: string | undefined, data: AnyData) => void;
  readonly dataLayer: AnyData[];
}
