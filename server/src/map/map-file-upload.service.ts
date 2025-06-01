export class MapFileUploadService {
  private readonly pinataApiKey: string;
  private readonly pinataSecretKey: string;

  constructor(
    pinataApiKey: string,
    pinataSecretKey: string,
  ) {
    this.pinataApiKey = pinataApiKey;
    this.pinataSecretKey = pinataSecretKey;
  }

  async upload() {

  }

}
