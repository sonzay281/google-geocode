/**
@module GoogleGeocode
@package google-geocode 
@author Sanjaya Sapkota <sonzayspk1998@gmail.com> Twitter:@nepz_sonze
@license MIT
*/

class GoogleGeocode {
  private readonly _GOOGLE_API: string =
    "https://maps.google.com/maps/api/geocode/json";
  private readonly _SERVER_ERROR: string = "Error parsing server response";
  private _API_KEY: any = null;
  private _LANGUAGE: string = "en";
  private _DEBUG: boolean = false;
  private _REGION: any = null;

  constructor(apiKey?: string, region?: string) {
    this._API_KEY = apiKey;
    this._REGION = region;
  }

  public setApiKey(apiKey: string) {
    this._API_KEY = apiKey;
  }
  public setLanguage(language: string) {
    this._LANGUAGE = language;
  }
  public setDebug(debug: boolean) {
    this._DEBUG = debug;
  }

  private log = (message: string, warn = false) => {
    if (this._DEBUG)
      if (warn) console.warn(message);
      else console.log(message);
  };

  private handleUrl = async (url: string) => {
    const response: any = await fetch(url).catch(() =>
      this.log("Error fetching data")
    );

    const json = await response?.json().catch(() => {
      this.log(this._SERVER_ERROR);
    });

    if (json?.status === "OK") {
      this.log(json);
      return json;
    }
    this.log(`Server returned status code ${json?.status}.`, true);
    return { results: [] };
  };

  private getFullUrl = (url: string) => {
    if (this._API_KEY) url += `&key=${this._API_KEY}`;

    if (this._LANGUAGE) url += `&language=${this._LANGUAGE}`;

    if (this._REGION) url += `&region=${encodeURIComponent(this._REGION)}`;
    return url;
  };

  async fromLatLng({ lat, lng }: any) {
    if (!lat || !lng) {
      this.log("Provided coordinates are invalid", true);
      return Promise.reject("Provided coordinates are invalid.");
    }
    const baseUrl = `${this._GOOGLE_API}?latlng=${encodeURIComponent(
      `${lat},${lng}`
    )}`;

    return this.handleUrl(this.getFullUrl(baseUrl));
  }

  async fromAddress(address: string) {
    if (!address) {
      this.log("Provided address is invalid", true);
    }
    const baseUrl = `${this._GOOGLE_API}?address=${encodeURIComponent(
      address
    )}`;
    const { results } = await this.handleUrl(this.getFullUrl(baseUrl));
    if (!!results.length) return results[0]?.geometry?.location;
    else return null;
  }
}
export default GoogleGeocode;
