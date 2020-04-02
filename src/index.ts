/**
Google Geocode
@package "google-geocode" 
@author "Sanjaya Sapkota <sonzayspk1998@gmail.com> Twitter:@nepz_sonze",
@license "MIT"
*/

class GoogleGeocode {
  private readonly _GOOGLE_API: string =
    "https://maps.google.com/maps/api/geocode/json";
  private readonly _SERVER_ERROR: string = "Error parsing server response";
  private _API_KEY: string = null;
  private _LANGUAGE: string = "en";
  private _DEBUG: boolean = false;
  private _REGION: string = null;

  constructor(
    apiKey?: string,
    language?: string,
    region?: string,
    debug?: boolean
  ) {
    this._API_KEY = apiKey;
    this._LANGUAGE = language;
    this._REGION = region;
    this._DEBUG = debug;
  }

  public setApiKey(apiKey: string) {
    this._API_KEY = apiKey;
  }
  public setLanguage(language: string) {
    this._LANGUAGE = language;
  }

  private log = (message: string, warn = false) => {
    if (this._DEBUG)
      if (warn) console.warn(message);
      else console.log(message);
  };

  private handleUrl = async (url: string) => {
    const response = await fetch(url).catch(() =>
      Promise.reject(new Error("Error fetching data"))
    );

    const json = await response.json().catch(() => {
      this.log(this._SERVER_ERROR);
      return Promise.reject(new Error(this._SERVER_ERROR));
    });

    if (json.status === "OK") {
      this.log(json);
      return json;
    }

    this.log(
      `${json.error_message}.\nServer returned status code ${json.status}`,
      true
    );
    return Promise.reject(
      new Error(
        `${json.error_message}.\nServer returned status code ${json.status}`
      )
    );
  };

  async fromLatLng(lat: string, lng: string) {
    if (!lat || !lng) {
      this.log("Provided coordinates are invalid", true);
      return Promise.reject(new Error("Provided coordinates are invalid"));
    }

    let url = `${this._GOOGLE_API}?latlng=${encodeURIComponent(
      `${lat},${lng}`
    )}`;

    if (this._API_KEY) url += `&key=${this._API_KEY}`;

    if (this._LANGUAGE) url += `&language=${this._LANGUAGE}`;

    if (this._REGION) url += `&region=${encodeURIComponent(this._REGION)}`;

    return this.handleUrl(url);
  }

  async fromAddress(address: string) {
    if (!address) {
      this.log("Provided address is invalid", true);
      return Promise.reject(new Error("Provided address is invalid"));
    }

    let url = `${this._GOOGLE_API}?address=${encodeURIComponent(address)}`;

    if (this._API_KEY) url += `&key=${this._API_KEY}`;

    if (this._LANGUAGE) url += `&language=${this._LANGUAGE}`;

    if (this._REGION) url += `&region=${encodeURIComponent(this._REGION)}`;

    return this.handleUrl(url);
  }
}
