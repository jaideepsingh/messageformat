---
title: "SelectMessage"
parent: "messageformat"
grand_parent: API Reference
---

<!-- Do not edit this file. It is automatically generated by API Documenter. -->



# SelectMessage interface

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

SelectMessage generalises the plural, selectordinal and select argument types of MessageFormat 1. Each case is defined by a key of one or more string identifiers, and selection between them is made according to the values of a corresponding number of placeholders. Selection iterates among the `variants` in order, and terminates when all of the Variant keys match. The result of the selection is always a single Pattern.

**Signature:**

```typescript
export interface SelectMessage 
```

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [comment?](./messageformat.selectmessage.comment.md) |  | string | **_(BETA)_** _(Optional)_ |
|  [declarations](./messageformat.selectmessage.declarations.md) |  | [Declaration](./messageformat.declaration.md)<!-- -->\[\] | **_(BETA)_** |
|  [errors?](./messageformat.selectmessage.errors.md) |  | [MessageSyntaxError](./messageformat.messagesyntaxerror.md)<!-- -->\[\] | **_(BETA)_** _(Optional)_ |
|  [selectors](./messageformat.selectmessage.selectors.md) |  | [PatternElement](./messageformat.patternelement.md)<!-- -->\[\] | **_(BETA)_** |
|  [type](./messageformat.selectmessage.type.md) |  | 'select' | **_(BETA)_** |
|  [variants](./messageformat.selectmessage.variants.md) |  | [Variant](./messageformat.variant.md)<!-- -->\[\] | **_(BETA)_** |

