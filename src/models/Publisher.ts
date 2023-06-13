import Report from "./Report.ts"
import ServiceYear from "./ServiceYear.ts"

export default class Publisher {
  public name: string
  public birth: Date
  public baptism: Date|null
  public male: boolean
  public anointed: boolean
  public elder: boolean
  public pioneer: boolean
  public years: Map<string, ServiceYear> = new Map()

  constructor (name, birth, baptism, male, anointed, elder, pioneer) {
    this.name = name
    this.birth = birth
    this.baptism = baptism
    this.male = male
    this.anointed = anointed
    this.elder = elder
    this.pioneer = pioneer
  }

  public addReport (serviceYear: string, report: Report): void {
    if (!this.years.has(serviceYear)) {
      this.years.set(serviceYear, new ServiceYear(Number.parseInt(serviceYear)))
    }

    this.years.get(serviceYear).addReport(report)
  }
}