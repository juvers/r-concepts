# Tishman + Gatsby

This is a collection of [Yarn Workspaces] for all things Tishman & Gatsby.

## Development

> Yarn is configured in [.npmrc] to use the public npm
> registry for dependencies, **except** for `@hzdg/` scoped packages,
> which are hosted on [GitHub Packages].
>
> See [GitHub Help] for info on authenticating with a personal access token:
>
> - Give your token the following permissions:
>
>   `repo, delete:packages, read:packages, write:packages`
>
> - Update your `~/.npmrc` to use the token for GitHub packages:
>
>   `//npm.pkg.github.com/:_authToken=<YOUR TOKEN HERE>`

### yarn tasks

There are a handful of tasks available.

These tasks support being run on one or more apps concurrently:

- `yarn build` — builds one or more apps
- `yarn clean` — cleans one or more apps
- `yarn develop` — runs one or more app development servers
- `yarn serve` — builds and serves one or more apps
- `yarn lint` — lints one or more apps
- `yarn fix` — autofixes lint errors for one or more apps
- `yarn typecheck` — runs the typescript compiler on one or more apps

By default, you will be prompted to select the apps to run the task on,
but you can skip the prompt by specifying one or more app names as arguments:

```shell
yarn build @tishman/docs
```

You can also omit the namespace, and you can also specify more than one app:

```shell
yarn develop docs rockefellercenter
```

It is also possible to run task for all apps:

```
yarn clean --all
```

These additional tasks are also available:

- `yarn test` — runs jest
- `yarn test-debug` — runs jest in debug mode
- `yarn deduplicate` — deduplicates dependencies in yarn.lock

## Workspaces

Workspaces are nested under `packages`:

![workspaces-diagram]

For more on these packages, see:

- [Components README](./packages/components/README.md)
- [Docs README](./packages/docs/README.md)
- [Rockefeller Center README](./packages/rockefellercenter/README.md)

## Dependency Management

> We use [save-exact] in our project [.npmrc] to make sure
> our dependency versions do not vary between installs of
> the same`package.json`. We also rely on [yarn.lock] to provide
> the same guarantee for nested dependencies.

Dependencies are managed using [Yarn ('classic')][yarn]. The [package.json]
at the root is the **top level** `package.json`. Each workspace also defines
its own **package level** `package.json`.

> In general, avoid specifying `devDependencies` in any `package.json`.
> Instead, rely on the distinction between [Top Level] and [Package Level]
> to place installed packages in the right `package.json` `dependencies`.

## Top Level

The **top level** [package.json] defines the workspaces,
common dependencies, and global scripts.

Some guidelines for managing the **top level** dependencies:

- **All** dependencies should go into `dependencies`, **not** `devDependencies`
  or `peerDependencies`.
- Only dependencies that are common or global in nature should be added to
  the top level `package.json`. For example:
  - `eslint`, `typescript`, `prettier`, and other code quality tools
    should be added to the top level `package.json` because we want the same
    code standards applied to all workspaces.
  - `gatsby`, `react`, and other big, common dependencies should be added
    to the top level `package.json` because every workspace that requires them
    should get the same version.

## Package Level

The **package level** `package.json` defines the dependencies and
scripts that are specific to the package workspace.

Some guidelines for managing the **package level** dependencies:

- dependencies that are only likely to be used in individual packages
  should be added to the **package level** `package.json`.
- **All** dependencies should go into `dependencies` **or** `peerDependencies`.
  - Any depdendencies that would go into `devDependencies` should be added
    to the **top level** `package.json` as `dependencies` instead.

[yarn]: https://classic.yarnpkg.com/en/
[yarn workspaces]: https://classic.yarnpkg.com/en/docs/workspaces/
[yarn.lock]: https://classic.yarnpkg.com/en/docs/yarn-lock/
[save-exact]: https://docs.npmjs.com/misc/config#save-exact
[github packages]: https://github.com/orgs/hzdg/packages
[github help]: https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#authenticating-with-a-personal-access-token
[.npmrc]: ./.npmrc
[package.json]: ./package.json
[top level]: #top-level
[package level]: #package-level
[workspaces-diagram]: ./workspaces-diagram.svg
