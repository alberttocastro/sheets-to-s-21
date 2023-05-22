import Report from "./Report.ts"

export default class Publisher {
  public name: string
  public birth: Date
  public baptism: Date|null
  public male: boolean
  public anointed: boolean
  public elder: boolean
  public pioneer: boolean
  public reports: object

  constructor (name, birth, baptism, male, anointed, elder, pioneer, reports: object|null = null) {
    this.name = name
    this.birth = birth
    this.baptism = baptism
    this.male = male
    this.anointed = anointed
    this.elder = elder
    this.pioneer = pioneer

    if (reports == null) {
      return this
    }

    this.reports = reports
  }

  public addReport (serviceYear: number, report: Report): void {
    if (!this.reports[serviceYear]) {
      this.reports[serviceYear] = []
    }

    this.reports[serviceYear].push(report)
  }
}