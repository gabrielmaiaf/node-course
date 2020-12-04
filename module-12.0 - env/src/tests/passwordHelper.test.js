const assert = require('assert');
const PasswordHelper = require('../helpers/passwordHelper');

const MOCK_PASSWORD = 'Gabz@123123';
const HASH_PASSWORD = '$2b$04$k.YC4QA3XObADfYMJI5nHutMtYYFzZlMGWM3DANnAg65mn71MEHNq';

describe('UserHelper test suite', function () {
  it('Should generate a hash by password', async () => {
    const result = await PasswordHelper.hashPassword(MOCK_PASSWORD);

    assert.ok(result.length > 10);
  });
  it('Should validate password', async () => {
    const result = await PasswordHelper.comparePassword(MOCK_PASSWORD, HASH_PASSWORD);

    assert.ok(result);
  })
})