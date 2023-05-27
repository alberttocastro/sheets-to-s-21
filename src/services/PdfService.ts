import Publisher from "../models/Publisher.ts";

export default class PdfService {
  private publishers: Map<string, Publisher>

  constructor (publishers: Map<string, Publisher>) {
    this.publishers = publishers
  }

  public generateFiles(publisherName: string): void {
    if (publisherName === null) {
      return this.generateFilesForAll()
    }

    return this.generateFileForPublisher(this.publishers.get(publisherName))
  }

  public generateFilesForAll(): void {
    this.publishers.forEach((publisher: Publisher) => {
      this.generateFileForPublisher(publisher)
    })
  }

  public generateFileForPublisher(publisher: Publisher): void {
    // TODO: generate file over here
  }
}