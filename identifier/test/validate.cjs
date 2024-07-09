// test.cjs
const { describe, it } = require('mocha');
const identifiers = require('../dist/identifier.cjs');

let expect; // imported async

describe('Identifiers Module', function() {
  
  before( async function() {
    const chai = await import('chai');
    expect = chai.expect;
  });

  it('should generate a valid ID', function(done) {
    setTimeout(() => {
      const validId = identifiers.app();
      expect(identifiers.validate(validId)).to.be.true;
      done();
    }, 100); // Ensure nanoid is loaded
  });

  const invalidIds = [
    'app_invalididentifier_000',            // Invalid format (too short)
    'invalid_invalididentifier_000',        // Unknown prefix
    'app_invalididentifier_',               // Invalid format (missing checksum)
    'app_invalid!dentifier_000',            // Invalid characters
    `app_${'A'.repeat(24)}_${'A'.repeat(2)}`, // Invalid checksum length
    `app_${'A'.repeat(23)}_000`,            // Invalid ID length
    `app_${'!'.repeat(24)}_000`,            // Invalid ID characters
    `${'!'.repeat(3)}_${'A'.repeat(24)}_000`, // Invalid prefix characters
    `app_${'A'.repeat(24)}_000`,            // Invalid checksum (not matching calculated)
  ];

  invalidIds.forEach((id, index) => {
    it(`should invalidate incorrect ID - Test ${index + 1}`, function() {
    //   console.log(`Test ${index + 1}:`, id);
      expect(identifiers.validate(id)).to.be.false;
    });
  });
});
