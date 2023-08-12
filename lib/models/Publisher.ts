import Report from "./Report"
import ServiceYear from "./ServiceYear"

export default class Publisher {
  public name: string
  public birth: Date
  public baptism: Date|null
  public male: boolean
  public anointed: boolean
  public elder: boolean
  public ministerialServant: boolean
  public pioneer: boolean
  public years: Map<string, ServiceYear> = new Map()

  constructor (name, birth, baptism, male, anointed, elder, ministerialServant, pioneer) {
    this.name = name
    this.birth = birth
    this.baptism = baptism
    this.male = male
    this.anointed = anointed
    this.elder = elder
    this.ministerialServant = ministerialServant
    this.pioneer = pioneer
  }

  public addReport (serviceYear: string, report: Report): void {
    if (!this.years.has(serviceYear)) {
      this.years.set(serviceYear, new ServiceYear(Number.parseInt(serviceYear)))
    }

    this.years.get(serviceYear).addReport(report)
  }
}