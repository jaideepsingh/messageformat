import { MessageFormat } from './messageformat';
import testMessages from './__fixtures/test-messages.json';
import { testName } from './__fixtures/test-name';

export type TestMessage = {
  src: string;
  exp: string;
  only?: boolean;
  params?: Record<string, string | number | null | undefined>;
  errors?: Array<{ type: string }>;
  locale?: string;
};

describe('Format messages', () => {
  for (const testMsg of testMessages as TestMessage[]) {
    const { src, exp, locale, params, errors: expErrors, only } = testMsg;
    (only ? test.only : test)(testName(testMsg), () => {
      const errors: any[] = [];
      const mf = new MessageFormat(src, locale ?? 'en');
      const msg = mf.resolveMessage(params, err => errors.push(err));
      expect(String(msg)).toBe(exp);
      expect(errors).toMatchObject(expErrors ?? []);
    });
  }
});
