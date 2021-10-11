# @tishman/components

This is a [Gatsby theme] of shared components and styles
for Tishman + Gatsby projects. It can be installed and used
in any of the other packages.

## Development

There are a handful of tasks available:

- `yarn lint` — runs eslint on all the javascript/typescript in the project
- `yarn fix` — runs eslint --fix on all the javascript/typescript in the project
- `yarn typecheck` — an alias for `tsc --noEmit`

You can run any of these commands from this directory, but a more standard
dev flow is to use the commands from the **workspace root**. See the
[Gatsby README](../../README.md) for more.

For iterating on a component in this package, you can:

1. create an MDX file for the component, i.e. `cool-component.mdx`
2. run the [Docs develop command] to get a docs server
3. ??? (hot reloading)
4. profit!

## Adding components for use in other packages

This [Gatsby Theme] is installed in other Tishman + Gatsby project, and
the components defined in this package are meant to be used by those other
apps. When adding a component to this theme for use by other packages, be
sure to export the component from the [package index].

This allows convenient importing in other apps, e.g.,

```js
import {IntrinsicBox} from '@tishman/components';
```

Which is a bit more convenient than:

```js
import {IntrinsicBox} from '@tishman/components/src/IntrinsicBox';
```

## Documentation

As a best practice, we strive to maintain documentation of the components
and any other significant elements of the site.

When adding documentation for components to this project: use
the "Components" menu and "/components/" url space:

```
---
name: CoolComponent
menu: Components
route: /components/cool-component
---
```

Or, if you're documenting a hook, you can use the "Hooks" menu
and "/hooks/" url space:

```
---
name: useCoolHook
menu: Hooks
route: /hooks/use-cool-hook
---
```

See the [Working with Docz and MDX](../docs/README.md#working-with-docz-and-mdx)
in the docs package README for more.

[gatsby theme]: https://www.gatsbyjs.org/docs/themes/what-are-gatsby-themes/
[docs develop command]: ../../README.md#development
[package index]: ./index.ts
