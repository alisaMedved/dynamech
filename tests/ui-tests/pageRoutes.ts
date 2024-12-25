import { test_config } from "../shared/test.config";
import {logger} from "../shared/logs.config";

export class PageRoutes {
  public static readonly baseClientURL: string = test_config.ui.baseUrlUI;
  public static workspace(workspaceId?: string): string {
    logger.info(`${this.baseClientURL}/business-v2/workspace${workspaceId ? `/${workspaceId}` : '' }`)
    logger.info(`${this.baseClientURL}`)
    return `${this.baseClientURL}/business-v2/workspace${workspaceId ? `/${workspaceId}` : '' }`
  };
  public static checkout(workspaceId: string, source='b2b'): string {
    return `${this.baseClientURL}/checkout?source=${source}&workspaceId=${workspaceId}`
  }
  public static confirmation(orderId: string): string {
    return `${this.baseClientURL}/checkout/confirmation?orderId=${orderId}`
  }

}
