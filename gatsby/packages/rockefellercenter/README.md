# @tishman/rockefellercenter

The rockefellercenter.com website frontend!

> The latest develop branch deploy is at: https://rockefellercenter.netlify.app/
>
> Note: password is `dev-1987`

## Development

There are a handful of tasks available:

- `yarn build` — an alias for `gatsby build`
- `yarn clean` — an alias for `gatsby clean`
- `yarn develop` — an alias for `gatsby develop --port 5000`
- `yarn serve` — an alias for `gatsby build && gatsby serve`
- `yarn lint` — runs eslint on all the javascript/typescript in the project
- `yarn fix` — runs eslint --fix on all the javascript/typescript in the project
- `yarn typecheck` — an alias for `tsc --noEmit`

You can run any of these commands from this directory, but a more standard
dev flow is to use the commands from the **workspace root**
(the `gatsby` directory).

For example, to run `yarn develop` from the workspace root:

```shell
yarn develop rockefellercenter
```

See the [Gatsby README](../../README.md) for more.

## Import Aliases (~)

An alias `~` is defined for the [src] directory of this app. It's preferable
to use the alias over deeply nested relative imports, especially when
moving _up_ in the directory tree.

For example, instead of:

```js
/* src/components/SomeComponent/SomeComponent.tsx */
import {SomeData} from '../../data/SomeData';
```

use:

```js
import {SomeData} from '~data/SomeData';
```

## Deployment

The develop branch is automatically deployed to [Netlify].

[netlify]: https://app.netlify.com/sites/rockefellercenter/overview

## Documentation

As a best practice, we strive to maintain documentation of the components
and any other significant elements of the site.

One thing to note when adding documentation pages to this project: use
the "Rockefeller Center" menu and "/rockefeller-center/" url space:

```
---
name: CoolComponent
menu: Rockefeller Center
route: /rockefeller-center/cool-component
---
```

See the [Working with Docz and MDX](../docs/README.md#working-with-docz-and-mdx)
in the docs package README for more.

[src]: ./src
