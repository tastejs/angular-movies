export interface BackNavigationInterface {
  backBtnSelector: string;

  navigateBack(): Promise<any>;
}
