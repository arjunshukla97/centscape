import request from 'supertest';
import axios from 'axios';
import app from '../app';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.setTimeout(15000); // extend test timeout globally

describe('/preview endpoint', () => {
  const fixtureHtml = `
    <html>
      <head>
        <title>Test Product</title>
        <meta property="og:title" content="OG Product Title" />
        <meta property="og:image" content="https://example.com/image.jpg" />
        <meta property="product:price:amount" content="19.99" />
        <script type="application/ld+json">
          {"@context":"http://schema.org","@type":"Product","offers":{"price":"20.00","priceCurrency":"USD"}}
        </script>
      </head>
      <body></body>
    </html>
  `;

  it('should parse title, image, price, currency, siteName, sourceUrl', async () => {
    mockedAxios.get.mockResolvedValue({data: fixtureHtml, status: 200});

    const res = await request(app)
      .post('/preview')
      .send({url: 'https://example.com/product/123'});

    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('OG Product Title');
    expect(res.body.data.image).toBe('https://example.com/image.jpg');
    expect(res.body.data.price).toBe('20.00');
    expect(res.body.data.currency).toBe('USD');
    expect(res.body.data.siteName).toBe('example.com');
    expect(res.body.data.sourceUrl).toBe('https://example.com/product/123');
  });

  it('should reject private IPs (SSRF guard)', async () => {
    const res = await request(app)
      .post('/preview')
      .send({url: 'http://127.0.0.1/admin'});

    expect(res.body.success).toBe(false);
    expect(res.body.error?.message).toMatch(/private or invalid/i);
  });

  it('should reject HTML larger than 512 KB', async () => {
    const largeHtml = 'A'.repeat(512 * 1024 + 1);
    mockedAxios.get.mockResolvedValue({data: largeHtml, status: 200});

    const res = await request(app)
      .post('/preview')
      .send({url: 'https://example.com/big'});

    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(413);
    expect(res.body.error?.message).toMatch(/html size exceeds/i);
  });

  it('should timeout if server takes too long', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      code: 'ECONNABORTED',
      message: 'timeout of 5000ms exceeded',
    });

    const res = await request(app)
      .post('/preview')
      .send({url: 'https://slow.com/timeout'});

    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(500);
    expect(res.body.error?.message).toMatch(/timeout/i);
  });

  it('should respect redirect limit', async () => {
    mockedAxios.get.mockRejectedValueOnce({
      code: 'ERR_FR_TOO_MANY_REDIRECTS',
      message: 'max redirects exceeded',
    });

    const res = await request(app)
      .post('/preview')
      .send({url: 'https://redirect.com/1'});

    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(500);
    expect(res.body.error?.message).toMatch(/max redirects/i);
  });

  it('should enforce rate-limit', async () => {
    mockedAxios.get.mockResolvedValue({data: fixtureHtml, status: 200});

    for (let i = 0; i < 10; i++) {
      await request(app)
        .post('/preview')
        .send({url: 'https://example.com/product/123'});
    }

    const res = await request(app)
      .post('/preview')
      .send({url: 'https://example.com/product/123'});

    expect(res.body.success).toBe(false);
    expect(res.body.status).toBe(429);
    expect(res.body.error?.message).toMatch(/too many requests/i);
  });
});
