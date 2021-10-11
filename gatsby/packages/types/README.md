# @tishman/types

This package is a collection of types that are meant to be shared
across other tishman projects.

## Reasoning

Some of the common dependencies between tishman projects do not have typings,
so as we stub them in ourselves, we can provide them to other packages.

The initial impetus for this setup is theme-ui, which currently does not have
typings for its @theme-ui scoped packages. As our usage of theme-ui expands,
we should look for the TS versions (most likely found
[here](https://github.com/system-ui/theme-ui/issues/668))
of the things we're using and add declarations for them here.

## Usage

Other packages in the monorepo can use the types in this package by
adding a [path mapping] that points to this package:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": ["*", "../types/*"]
    }
  }
}
```

## TODO

- [ ] TODO: Delete [types/@theme-ui] when https://github.com/system-ui/theme-ui/issues/668
      is merged

[path mapping]: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
