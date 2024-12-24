import { test_config } from "../shared/test.config";
import {logger} from "../shared/logs.config";

export class PageRoutes {
  public static readonly baseClientURL: string = test_config.ui.baseUrlUI;
  public static workspace(workspaceId?: string): string {
    logger.info(`${this.baseClientURL}/workspace${workspaceId ? `/${workspaceId}` : '' }`)
    logger.info(`${this.baseClientURL}`)
    return `${this.baseClientURL}/workspace${workspaceId ? `/${workspaceId}` : '' }`
  };

}
