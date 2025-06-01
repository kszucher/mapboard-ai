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

  async upload(file: Express.Multer.File): Promise<string | null> {
    const fileForPinata = new File([file.buffer], file.originalname, {
      lastModified: Date.now(),
      type: file.mimetype,
    });

    const formData = new FormData();
    formData.append('file', fileForPinata);

    try {
      console.log(this.pinataSecretKey);
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Pinata upload failed: ${errorText}`);
        return null;
      }

      const data = (await response.json()) as { IpfsHash: string };
      console.log('File uploaded successfully:', data);
      return data.IpfsHash;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  }

  async download(ipfsHash: string): Promise<Buffer | null> {
    const url = `https://gateway.pinata.cloud/ipfs/${ipfsHash}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        console.error(`Failed to download file from IPFS. Status: ${response.status}`);
        return null;
      }

      // Read response as arrayBuffer, then convert to Buffer
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error('Error downloading file:', error);
      return null;
    }
  }
}
