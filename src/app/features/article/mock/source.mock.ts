import { Source } from '../models';

export class SourceMock {
  private _data: Source = {
    id: '',
    name: '',
  };

  public withId(id: Source['id']): SourceMock {
    this._data.id = id;
    return this;
  }

  public withName(name: Source['name']): SourceMock {
    this._data.name = name;
    return this;
  }

  public model(): Source {
    return this._data;
  }
}
