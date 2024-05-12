const { stringToObject } = require('../app');
const assert = require('assert');

describe('stringToObject', () => {
    it('should convert "Hello world" to { "Hello": "world" }', () => {
        const input = 'Hello world';
        const expectedOutput = { "Hello": "world" };

        assert.deepStrictEqual(stringToObject(input), expectedOutput);
    });

    it('should handle multiple words correctly', () => {
        const input = 'OpenAI GPT-4 model';
        const expectedOutput = { "OpenAI": "GPT-4 model" };

        assert.deepStrictEqual(stringToObject(input), expectedOutput);
    });

    it('should return the original word as key and an empty string as value if only one word is provided', () => {
        const input = 'Hello';
        const expectedOutput = { "Hello": "" };

        assert.deepStrictEqual(stringToObject(input), expectedOutput);
    });
});
