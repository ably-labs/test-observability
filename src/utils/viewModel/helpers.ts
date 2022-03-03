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

  static queryFragmentForFilter(filter: UploadsFilter): string {
    let components: {key: string, value: string}[] = []

    filter.branches.forEach(branchName => {
      components.push({key: "branches[]", value: branchName})
    })

    if (filter.createdBefore !== null) {
      components.push({key: "createdBefore", value: filter.createdBefore.toISOString()})
    }

    if (filter.createdAfter !== null) {
      components.push({key: "createdAfter", value: filter.createdAfter.toISOString()})
    }

    if (filter.failureMessage !== null) {
      components.push({key: "failureMessage", value: filter.failureMessage})
    }

    return components.map(component => `${encodeURIComponent(component.key)}=${encodeURIComponent(component.value)}`).join('&')
  }
}
