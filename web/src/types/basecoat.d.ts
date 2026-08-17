declare module "basecoat-css/basecoat";
declare module "basecoat-css/sidebar";
declare module "basecoat-css/drawer";
declare module "basecoat-css/accordion";
declare module "basecoat-css/select";

interface Window {
  basecoat?: {
    initAll(options?: { force?: boolean }): void;
  };
}
