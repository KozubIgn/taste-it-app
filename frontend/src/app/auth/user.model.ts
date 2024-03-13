export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private _tokenExpirationDate: number | undefined
  ) {}

  get token() {
    const now = Math.floor(Date.now() / 1000);
    if (!this._tokenExpirationDate ||  now > this._tokenExpirationDate) {
      return undefined;
    }
    return this._token;
  }
}
