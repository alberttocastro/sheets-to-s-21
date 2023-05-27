import Publisher from "../models/Publisher.ts"
import Report from "../models/Report.ts"
import ServiceYear from "../models/ServiceYear.ts"

const PUBLISHER_PROPS_MAP = {
  name: 'Publicadores',
  birth: 'Nascimento',
  baptism: 'Batismo',
  male: 'Homem?',
  anointed: 'Participa Emblemas?',
  elder: 'Ancião?',
  pioneer: 'Pioneiro Regular?'
}

const REPORT_PROPS_MAP = {
  name: 'Publicador',
  date: 'Mês e Ano',
  literatures: 'Publicações',
  videos: 'Videos',
  hours: 'Hours',
  visits: 'Revisitas',
  studies: 'Estudos Bíblicos'
}

export class ReportsService {
  private publishers: Array<Publisher> = []

  constructor (publishers: object[]) {
    for (let publisher of publishers) {
      this.publishers.push(
        new Publisher(
          publisher[PUBLISHER_PROPS_MAP.name],
          publisher[PUBLISHER_PROPS_MAP.birth],
          publisher[PUBLISHER_PROPS_MAP.baptism] ?? null,
          publisher[PUBLISHER_PROPS_MAP.male] ?? false,
          publisher[PUBLISHER_PROPS_MAP.anointed] ?? false, 
          publisher[PUBLISHER_PROPS_MAP.elder] ?? false, 
          publisher[PUBLISHER_PROPS_MAP.pioneer] ?? false
        )
      )
    }
  }

  public addReportsToPublishers(reports: object[]): void {
    let pubs: Map<string, Publisher> = new Map()

    for (let publisher of this.publishers) {
      pubs.set(publisher.name, publisher)
    }

    for (let report of reports) {
      // Sanity check
      if (!pubs[REPORT_PROPS_MAP.name]) continue

      if (!pubs[REPORT_PROPS_MAP.name].reports) pubs[REPORT_PROPS_MAP.name].reports = {}  
      let sy: number = ServiceYear.determineServiceYear(REPORT_PROPS_MAP.date)
      if (!pubs[REPORT_PROPS_MAP.name].reports[sy]) pubs[REPORT_PROPS_MAP.name].reports[sy] = []

      const reportToAdd = new Report(
        report[REPORT_PROPS_MAP.date],
        report[REPORT_PROPS_MAP.literatures],
        report[REPORT_PROPS_MAP.videos],
        report[REPORT_PROPS_MAP.hours],
        report[REPORT_PROPS_MAP.visits],
        report[REPORT_PROPS_MAP.studies],
        report[REPORT_PROPS_MAP.name]
      )

      pubs.get(report[REPORT_PROPS_MAP.name]).addReport(sy + '', reportToAdd)
    }
  }
}