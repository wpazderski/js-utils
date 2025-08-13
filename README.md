# @wpazderski/js-utils

Common JavaScript utils

This project is not intended to be an exhaustive collection of JS tools - features are only added as they are needed in other projects.

Docs: [https://wpazderski.github.io/js-utils/](https://wpazderski.github.io/js-utils/)

## Installation and usage

Start by installing this package, for example with `pnpm`:

```sh
pnpm i @wpazderski/js-utils
```

Then import and use utils, for example:

```ts
import { StringUtils } from "@wpazderski/js-utils";

const camelCaseStr = "loremIpsumDolorSitAmet";
const kebabCaseStr = StringUtils.camelCaseToKebabCase(camelCaseStr);
console.log({ camelCaseStr, kebabCaseStr });
```

#### Importing common utils (Node.js and Web environments)

```ts
// From index.ts:
import { StringUtils } from "@wpazderski/js-utils";

// Or directly:
import { StringUtils } from "@wpazderski/js-utils/common/StringUtils.js";
```

#### Importing Node.js-specific utils (only Node.js environment)

```ts
// From index.ts:
import { PathUtils } from "@wpazderski/js-utils/node";

// Or directly:
import { PathUtils } from "@wpazderski/js-utils/node/PathUtils.js";
```

#### Importing Web-specific utils (only Web environment)

```ts
// From index.ts:
import { schedulers } from "@wpazderski/js-utils/web";

// Or directly:
import { OnIdleScheduler } from "@wpazderski/js-utils/web/schedulers/OnIdleScheduler.js";
```

## Related projects

See [https://pazderski.dev/projects/](https://pazderski.dev/projects/) for other projects that provide various configs, utils, tools and examples.
