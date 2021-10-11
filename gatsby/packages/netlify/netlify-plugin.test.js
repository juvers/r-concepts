/** @jest-environment node */
// @ts-check

const netlifyBuild = require('@netlify/build');

const NETLIFY_CONFIG = `./netlify-test.toml`;

describe('Netlify Build', () => {
  it('should not fail', async () => {
    const {success, logs} = await netlifyBuild({
      config: NETLIFY_CONFIG,
      buffer: true,
    });

    // Netlify Build output
    console.log(
      [logs.stdout.join('\n'), logs.stderr.join('\n')]
        .filter(Boolean)
        .join('\n\n'),
    );

    expect(success).toBe(true);
  }, 60000);
});
