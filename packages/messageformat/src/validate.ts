import {
  isFunction,
  isSelectMessage,
  MessageGroup,
  Resource,
  PatternElement
} from './data-model';
import { isTerm } from './pattern/term';
import type { Runtime } from './runtime';

export function validate(resources: Resource[], runtime: Runtime) {
  function handleMsgParts(parts: PatternElement[], inSelect?: boolean) {
    for (const part of parts) {
      if (isFunction(part)) {
        const { args, func } = part;
        const realm = inSelect ? runtime.select : runtime.format;
        const fn = realm[func];
        if (typeof fn !== 'function')
          throw new ReferenceError(`Runtime function not available: ${func}`);
        handleMsgParts(args);
        // TODO: Once runtime arg requirements are defined, test against them
      } else if (isTerm(part)) {
        const { msg_path, res_id } = part;
        if (res_id && resources.every(res => res.id !== res_id))
          throw new ReferenceError(`Resource not available: ${res_id}`);
        handleMsgParts(msg_path);
      }
    }
  }

  function handleMsgGroup({ entries }: Resource | MessageGroup) {
    for (const msg of Object.values(entries)) {
      if ('entries' in msg) handleMsgGroup(msg);
      else if (isSelectMessage(msg)) {
        handleMsgParts(
          msg.select.map(sel => sel.value),
          true
        );
        for (const { value } of msg.cases) handleMsgParts(value);
      } else handleMsgParts(msg.value);
    }
  }

  for (const res of resources) handleMsgGroup(res);
}
