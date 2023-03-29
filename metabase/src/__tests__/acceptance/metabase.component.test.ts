import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
  toJSON,
} from '@loopback/testlab';
import {MetabaseServiceBindings} from '../../keys';
import {MetabaseService} from '../../services/metabase.service';
import {TestApplication} from '../fixtures/application';

describe('metabase', () => {
  let app: TestApplication;
  let client: Client;
  let metabaseService: MetabaseService;
  before(givenRunningApplication);
  before(() => {
    client = createRestAppClient(app);
  });
  after(async () => {
    await app.stop();
  });

  it(`getCardIdMetabase`, async () => {
    const cardId = 20;
    const res = await client.get(`/card/${cardId}/query`).expect(200);
    expect(res.body.rows).to.eql([
      ['2022-02-22T00:00:00Z', 'shirt', 'jacket nike', 3120000],
      ['2022-03-22T00:00:00Z', 'shirt', 'jacket nike', 3120000],
      ['2022-10-22T00:00:00Z', 'shirt', 'jacket puma', 3120000],
      ['2022-11-22T00:00:00Z', 'shirt', 'jacket puma', 3120000],
      ['2022-12-22T00:00:00Z', 'shirt', 'jacket nike', 3120000],
      ['2022-12-22T00:00:00Z', 'shirt', 'jacket puma', 3120000],
      ['2023-03-01T00:00:00Z', 'shirt', 'jacket nike', 5540000],
      ['2023-03-02T00:00:00Z', 'shirt', 'jacket nike', 2420000],
      ['2023-03-02T00:00:00Z', 'shirt', 'jacket puma', 3120000],
      ['2023-03-15T00:00:00Z', 'sneaker', 'test111', 9000000],
      ['2023-03-16T00:00:00Z', 'bag', 'balo', 974600],
      ['2023-03-16T00:00:00Z', 'pant', 'quan', 943370],
      ['2023-03-16T00:00:00Z', 'shirt', 'ao', 1003100],
      ['2023-03-16T00:00:00Z', 'sneaker', 'adidas test', 100000],
      ['2023-03-16T00:00:00Z', 'sneaker', 'ao adidas', 100000],
      ['2023-03-16T00:00:00Z', 'sneaker', 'ao nike', 20000000],
      ['2023-03-16T00:00:00Z', 'sneaker', 'giay', 3533100],
      ['2023-03-20T00:00:00Z', 'bag', 'balo', 2400000],
      ['2023-03-21T00:00:00Z', 'bag', 'balo', 1000000],
      ['2023-03-25T00:00:00Z', 'shirt', 'jacket', 2500000],
      ['2023-04-02T00:00:00Z', 'shirt', 'jacket nike', 2420000],
      ['2023-04-02T00:00:00Z', 'shirt', 'jacket puma', 3120000],
      ['2023-04-20T00:00:00Z', 'shirt', 'jacket nike', 2420000],
      ['2023-04-22T00:00:00Z', 'shirt', 'jacket puma', 3120000],
      ['2023-04-25T00:00:00Z', 'shirt', 'jacket1', 2500000],
      ['2023-05-20T00:00:00Z', 'shirt', 'jacket nike', 2420000],
      ['2023-05-22T00:00:00Z', 'shirt', 'jacket puma', 3120000],
      ['2023-05-25T00:00:00Z', 'shirt', 'jacket1', 2500000],
      ['2023-06-20T00:00:00Z', 'shirt', 'jacket nike', 2420000],
      ['2023-06-22T00:00:00Z', 'shirt', 'jacket puma', 3120000],
      ['2023-06-25T00:00:00Z', 'shirt', 'jacket1', 2500000],
      ['2023-07-23T00:00:00Z', 'shirt', 'jacket1', 2500000],
      ['2023-07-23T00:00:00Z', 'shirt', 'jacket nike', 2420000],
      ['2023-07-25T00:00:00Z', 'shirt', 'jacket1', 2500000],
      ['2023-10-22T00:00:00Z', 'shirt', 'jacket puma', 3120000],
    ]);
  });

  async function givenRunningApplication() {
    app = new TestApplication({
      rest: {...givenHttpServerConfig(), port: 3002},
    });

    await app.boot();
    metabaseService = await app.get(MetabaseServiceBindings.METABASE);

    await app.start();
  }
});
