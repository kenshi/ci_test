import {mul} from '../../src/functions/mul';

test('mul 3 * 2 to equal 6', () => {
  expect(mul(3, 2)).toBe(6);
});