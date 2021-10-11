# Sanity Clean Content Studio

# Setup

Set up env files
use `.env.sample` file to create two new env files
`env.development` and `env.productions`

- [Read "Dot env files (.env)"](https://www.sanity.io/docs/studio-environment-variables#dot-env-files-env-f5e9e3158896)

The environment is defined by the value of the SANITY_ACTIVE_ENV environment variable. If not defined, it will default to development when running the sanity start command, while it will use production when running sanity build and sanity deploy.
