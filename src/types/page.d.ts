export interface Page {
  title: string;
  path?: string;
  component?: React.ReactNode;
  icon?: React.ReactNode;
  submenu?: Page[];
}
