declare module 'dom-to-image-more' {
  interface Options {
    bgcolor?: string;
    quality?: number;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    filter?: (node: Node) => boolean;
    cacheBust?: boolean;
  }
  export function toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  export function toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  export function toSvg(node: HTMLElement, options?: Options): Promise<string>;
}
