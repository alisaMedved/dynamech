import { config } from "dotenv";
// @ts-ignore
import path from "path";

config({ path: path.join(__dirname, "../.env") });
const environment = process.env.ENV!;

if (environment == "dev") {
  config({ path: path.join(__dirname, "../.env.dev") });
} else if (environment == "CI") {
  config({ path: path.join(__dirname, "../.env.ci") });
}
export let test_config = {
  ui: {
    baseUrlUI: process.env.UI_URL as string,
    authDir: 'auth'
  },
  http: {
    dynamechUrlHttp: getBaseHttpUrl("dynamech") as string,
  },
  workers: Number(process.env.WORKERS) || process.env.WORKERS,
  timeoutsForUiTests: {
    /** Each page in UI tests has a loadedPage function.
         This function indicates that the page has loaded
         and that the content has been rendered.
         TimeForWaitingLoadPage is the time (ms) it takes for
         the requests of endpoints to resolve
         and page content to render
         **/
    timeForWaitingLoadPage: 10000,
  },
};

function getBaseHttpUrl(type: string) {
  switch (type) {
    case "dynamech":
      return process.env.HTTP_DYNAMECH_URL;
    default:
      throw new Error(`Invalid BaseHttpUrl type ${type} for environment ${environment}`);
  }
}
