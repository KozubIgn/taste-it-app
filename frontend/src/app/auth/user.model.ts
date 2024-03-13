export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private _tokenExpirationTime: number | undefined
  ) {}

  get token() {
    const now = Math.floor(Date.now() / 1000);
    if (!this._tokenExpirationTime ||  now > this._tokenExpirationTime) {
      return undefined;
    }
    return this._token;
  }
}
