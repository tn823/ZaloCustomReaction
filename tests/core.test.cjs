const { test } = require('node:test');
const assert = require('node:assert/strict');
const { hash, normalize, findSender, groups } = require('../src/zalo-custom-reaction.js');
test('hash giữ tương thích thuật toán userscript gốc', () => {
  assert.equal(hash('abc'), 96354);
  assert.equal(hash('❤️'), 0x2764 * 31 + 0xfe0f);
  assert.equal(hash(''), 0);
});
test('tìm kiếm tiếng Việt không dấu', () => assert.equal(normalize('Động vật'), 'dong vat'));
test('tìm đúng callback và giữ this trên chuỗi fiber', () => {
  const props = { marker: 42, sendReaction() { return this.marker; } };
  const node = { '__reactFiber$test': { return: { memoizedProps: props } } };
  assert.equal(findSender(node)(), 42);
  assert.equal(findSender({}), null);
});
test('fiber vòng lặp không làm treo trang', () => {
  const fiber = {}; fiber.return = fiber;
  assert.equal(findSender({ '__reactFiber$test': fiber }), null);
});
test('thư viện emoji có hơn 350 lựa chọn', () => assert.ok(new Set(groups.flatMap(g => g.emojis)).size > 350));
