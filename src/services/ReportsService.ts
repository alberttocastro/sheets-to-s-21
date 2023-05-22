import Publisher from "../models/Publisher.ts"

const FILE_TO_PROPERTY = {
  name: 'Publicadores',
  birth: 'Nascimento',
  baptism: 'Batismo',
  male: 'Homem?',
  anointed: 'Participa Emblemas?',
  elder: 'Ancião?',
  pioneer: 'Pioneiro Regular?'
}

export class ReportsService {
  private publishers: Array<Publisher> = []

  constructor (publishers: object[]) {
    for (let publisher of publishers) {
      this.publishers.push(
        new Publisher(
          publisher[FILE_TO_PROPERTY.name],
          publisher[FILE_TO_PROPERTY.birth],
          publisher[FILE_TO_PROPERTY.baptism] ?? null,
          publisher[FILE_TO_PROPERTY.male] ?? false,
          publisher[FILE_TO_PROPERTY.anointed] ?? false, 
          publisher[FILE_TO_PROPERTY.elder] ?? false, 
          publisher[FILE_TO_PROPERTY.pioneer] ?? false
        )
      )
    }
  }

  public addReportsToPublishers(reports: object[]): void {
    let pubs = {}

    for (let publisher of this.publishers) {
      pubs[publisher.name] = publisher
    }

    for (let report of reports) {
      // Sanity check
      if (!pubs[report['Publicador']]) continue

      if (!pubs[report['Publicador']].reports) pubs[report['Publicador']].reports = {}  
      let sy: number = this.determineServiceYear(report['Mês e Ano'])
      if (!pubs[report['Publicador']].reports[sy]) pubs[report['Publicador']].reports[sy] = []

      pubs[report['Publicador']].reports[sy].push(report)
    }
  
    for (let [publisher, data] of Object.entries(pubs)) {
      let reports = pubs[publisher].reports
      if (!reports) continue

      pubs[publisher].reports = this.addTotalsAndAverage (reports)
    }
  }

  private determineServiceYear(dateTime: any): number {
    let date = new Date(dateTime)
    let month = date.getMonth()
  
    return month >= 8 ? date.getFullYear() + 1 : date.getFullYear()
  }

  private addTotalsAndAverage (reports: object[]): object[] {
    let totals = {
      'Publicações': {
        total: 0,
        count: 0,
        avg: 0
      },
      'Vídeos': {
        total: 0,
        count: 0,
        avg: 0
      },
      'Horas': {
        total: 0,
        count: 0,
        avg: 0
      },
      'Revisitas': {
        total: 0,
        count: 0,
        avg: 0
      },
      'Estudos Bíblicos': {
        total: 0,
        count: 0,
        avg: 0
      }
    }
  
    for (let report of reports) {
      for (let prop of Object.keys(totals)) {
        if (!report[prop]) continue
  
        totals[prop].total += report[prop]
        totals[prop].count += 1
      }
    }
  
    for (let prop of Object.keys(totals)) {
      if (totals[prop].count == 0) {
        totals[prop].avg = 0
        continue
      }
  
      let avg = totals[prop].total / totals[prop].count
      avg = Math.round(avg * 100) / 100
  
      totals[prop].avg = avg
    }
  
    return [...reports, totals]
  }
}