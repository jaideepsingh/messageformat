import { MessageError } from '../errors';
import type { Context } from '../format-context';
import {
  asMessageValue,
  MessageFallback,
  MessageMarkup,
  MessageValue
} from '../message-value';
import { FALLBACK_SOURCE } from '../message-value/message-value';
import type { Literal, VariableRef } from './index';

/**
 * To resolve a FunctionRef, an externally defined function is called.
 *
 * @remarks
 * The `name` identifies a function that takes in the arguments `args`, the
 * current locale, as well as any `options`, and returns some corresponding
 * output. Likely functions available by default would include `'plural'` for
 * determining the plural category of a numeric value, as well as `'number'`
 * and `'date'` for formatting values.
 *
 * @beta
 */
export interface FunctionRef {
  type: 'function';
  kind: 'open' | 'close' | 'value';
  name: string;
  operand?: Literal | VariableRef;
  options?: Option[];
}

/**
 * {@link FunctionRef} options are expressed as
 * `key`/`value` pairs to allow their order to be maintained.
 *
 * @beta
 */
export interface Option {
  name: string;
  value: Literal | VariableRef;
}

/**
 * Type guard for {@link FunctionRef} pattern elements
 *
 * @beta
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isFunctionRef = (part: any): part is FunctionRef =>
  !!part && typeof part === 'object' && part.type === 'function';

export function functionRefSourceName(kind: FunctionRef['kind'], name: string) {
  switch (kind) {
    case 'open':
      return `+${name}`;
    case 'close':
      return `-${name}`;
    default:
      return `:${name}`;
  }
}

export function resolveFunctionRef(
  ctx: Context,
  { kind, operand, name, options }: FunctionRef
) {
  let source: string | undefined;
  try {
    let fnArgs: [MessageValue] | [];
    if (operand) {
      const arg = ctx.resolve(operand);
      fnArgs = [arg];
      source =
        arg.source ||
        String((arg.type === 'literal' && arg.value) || FALLBACK_SOURCE);
    } else {
      fnArgs = [];
      source = functionRefSourceName(kind, name);
    }

    switch (kind) {
      case 'open':
      case 'close': {
        const opt = resolveOptions(ctx, options);
        return new MessageMarkup(ctx, name, {
          kind,
          operand: fnArgs[0],
          options: opt,
          source
        });
      }
      default: {
        const rf = ctx.runtime[name];
        if (!rf) {
          throw new MessageError('missing-func', `Unknown function ${name}`);
        }
        const opt = Object.assign(
          { localeMatcher: ctx.localeMatcher },
          resolveOptions(ctx, options)
        );
        const res = rf(ctx.locales, opt, ...fnArgs);
        return asMessageValue(ctx, res, { source });
      }
    }
  } catch (error) {
    source ??= operand ? FALLBACK_SOURCE : `:${name}`;
    const fb = new MessageFallback(ctx, { source });
    ctx.onError(error, fb);
    return fb;
  }
}

function resolveOptions(ctx: Context, options: Option[] | undefined) {
  if (!options?.length) return undefined;
  const opt: Record<string, unknown> = {};
  for (const { name, value } of options) {
    opt[name] = ctx.resolve(value).value;
  }
  return opt;
}
