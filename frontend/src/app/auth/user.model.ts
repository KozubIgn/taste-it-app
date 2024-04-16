export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    public favourite_recipes?: any,
    public created_recipes?: any,
    public custom_objects?: any,
    public settings?: any,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}

  get token() {
    return this._token;
}

}
