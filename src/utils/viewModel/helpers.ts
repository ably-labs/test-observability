import {UploadsFilter} from "src/uploads/uploads.service"

export class ViewModelHelpers {
  static formatPercentage(amount: number, total: number): string | null {
    if (total == 0) {
      return null
    }

    return `${(100 * amount / total).toFixed(1)}%`
  }

  static formatPercentageAsCountSuffix(amount: number, total: number): string {
    const formattedPercentage = this.formatPercentage(amount, total)

    if (formattedPercentage === null) {
      return ""
    }

    return ` (${formattedPercentage})`
  }
}
