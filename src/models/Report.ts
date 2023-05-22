export default class Report {
  month: Date
  literatures: number = 0
  videos: number = 0
  hours: number = 0
  visits: number = 0
  studies: number = 0

  constructor (month: Date, literatures, videos, hours, visits, studies) {
    this.month = month
    this.literatures = literatures
    this.videos = videos
    this.hours = hours
    this.visits = visits
    this.studies = studies
  }
}