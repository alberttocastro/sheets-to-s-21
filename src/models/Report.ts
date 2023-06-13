export default class Report {
  public month: Date
  public literatures: number = 0
  public videos: number = 0
  public hours: number = 0
  public visits: number = 0
  public studies: number = 0
  public name: string
  public notes: string = ''

  constructor (month: Date, literatures: number, videos: number, hours: number, visits: number, studies: number, name: string, notes: string = '') {
    this.month = month
    this.literatures = literatures
    this.videos = videos
    this.hours = hours
    this.visits = visits
    this.studies = studies
    this.name = name
    this.notes = notes
  }
}