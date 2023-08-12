import Report from './Report'

export default class ServiceYear {
  private year: number
  public reports: Report[] = []
  private count: object = {
    literatures: 0,
    videos: 0,
    hours: 0,
    visits: 0,
    studies: 0,
  }
  private totals: object = {
    literatures: 0,
    videos: 0,
    hours: 0,
    visits: 0,
    studies: 0,
  }

  constructor(year: number) {
    this.year = year
  }

  public addReport(report: Report): void {
    let year = ServiceYear.determineServiceYear(report.month)

    if (year !== this.year) {
      return
    }

    this.reports.push(report)

    for (let [key, value] of Object.entries(report)) {
      if (report[key] && Object.keys(this.totals).includes(key)) {
        value = typeof value != 'number' ? 0 : value
        this.count[key] ++
        this.totals[key] += value
      }
    }

    let { count, totals } = this
  }

  public getTotals(): object {
    return this.totals
  }

  public getAverage(): object {
    let average = {...this.totals}

    for (let [key, value] of Object.entries(this.totals)) {
      let count = this.count[key]
      if (count === 0) {
        average[key] == 0
        continue
      }

      average[key] = average[key] / count
    }

    return average
  }

  public static determineServiceYear(dateTime: any): number {
    let date = new Date(dateTime)
    let month = date.getMonth()
  
    return month >= 8 ? date.getFullYear() + 1 : date.getFullYear()
  }
}