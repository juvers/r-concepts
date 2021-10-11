# @tishman/docs

This is a component browser and style guide for Tishman + Gatsby projects.

> The latest develop branch deploy is at: https://tishman.netlify.app/
>
> Note: password is `dev-1987`

## Development

There are a handful of tasks available:

- `yarn build` — an alias for `gatsby build`
- `yarn clean` — an alias for `gatsby clean && rm -rf .docz`
- `yarn develop` — an alias for `gatsby develop --port 3000`
- `yarn serve` — an alias for `gatsby build && gatsby serve`
- `yarn lint` — runs eslint on all the javascript/typescript in the project
- `yarn fix` — runs eslint --fix on all the javascript/typescript in the project
- `yarn typecheck` — an alias for `tsc --noEmit`

You can run any of these commands from this directory, but a more standard
dev flow is to use the commands from the **workspace root**
(the `gatsby` directory).

For example, to run `yarn develop` from the workspace root:

```shell
yarn develop docs
```

See the [Gatsby README](../../README.md) for more.

## Deployment

The develop branch is automatically deployed to [Netlify].

## Working with Docz and MDX

> **Note:** Most of the documentation (MDX files) are in other apps!
> This app aggregates MDX files from the other Tishman apps
> and builds a centralized documentation hub.

This app is configured to pull in MDX files from any of the gatsby monorepo
workspaces, so it's best to _colocate_ MDX files with the subject code they
document, rather than adding MDX files here.

Here are some guidelines, tips and tricks for
working with [Docz] and [MDX] in the tishman monorepo.

### Name mdx files after their route

For example, given a component `CoolComponent.tsx`, a corresponding MDX
filename might be `cool-component.tsx`, with frontmatter like:

```
---
name: CoolComponent
menu: Components
route: /components/cool-component
---
```

> **Note:** Avoid same names with different extensions!
> Docz will not be able to properly distinguish between `CoolComponent.tsx`
> and `CoolComponent.mdx` when resolving imports!
>
> See [Troubleshooting] for more.

## Troubleshooting

### <Props of={SomeComponent} /> is empty

Sometimes this is caused by the build cache being stale.
Try clearing the cache:

```shell
yarn clean docs
```

### build runs out of memory

This may be caused by a module resolution loop. Check for MDX files that
have the same names as modules they import. Sometimes you can use
**filename with extension** when importing into MDX with the same name
to work around this, but it is generally preferable to [rename the MDX
file].

[docz]: https://www.docz.site/
[mdx]: https://mdxjs.com/
[troubleshooting]: #troubleshooting
[rename the mdx file]: #name-mdx-files-after-their-route
[netlify]: https://app.netlify.com/sites/tishman/overview
