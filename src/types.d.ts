export type CircleT = {
  id: string;
  xPx: number;
  yPx: number;
};

declare module "*.webp" {
  const src: string;
  export default src;
}
