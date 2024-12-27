import { test_config } from "../shared/test.config";

export class PageRoutes {
  public static readonly baseClientURL: string = test_config.ui.baseUrlUI;
  public static readonly auth: string = `${this.baseClientURL}/business-v2/`;
  public static workspace(workspaceId?: string): string {
    return `${this.baseClientURL}/business-v2/workspace${workspaceId ? `/${workspaceId}` : '' }`
  };
  public static checkout(workspaceId: string, source='b2b'): string {
    return `${this.baseClientURL}/checkout?source=${source}&workspaceId=${workspaceId}`
  }
  public static confirmation(orderId: string): string {
    return `${this.baseClientURL}/checkout/confirmation?orderId=${orderId}`
  }
}
