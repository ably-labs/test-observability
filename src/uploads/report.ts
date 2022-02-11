import {JUnitReport} from "./junitReport";
import {Upload} from "./upload.entity";

export interface Report {
  upload: Upload
  junitReport: JUnitReport
}
