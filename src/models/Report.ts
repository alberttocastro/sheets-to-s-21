export default class Report {
  month: Date
  literatures: number = 0
  videos: number = 0
  hours: number = 0
  visits: number = 0
  studies: number = 0
  name: string

  constructor (month: Date, literatures: number, videos: number, hours: number, visits: number, studies: number, name: string) {
    this.month = month
    this.literatures = literatures
    this.videos = videos
    this.hours = hours
    this.visits = visits
    this.studies = studies
    this.name = name
  }
}