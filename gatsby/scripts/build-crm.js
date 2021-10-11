const fs = require('fs');
const {execSync} = require('child_process');
const path = require('path');

/**
 * Builds and copies the crm to current working directory
 */
const builtFolder = 'built-lambda';
const gatsbyBasePath = path.resolve(__dirname, '..');
const crmPath = path.resolve(gatsbyBasePath, '..', 'crm');
try {
  if (fs.existsSync(crmPath)) {
    process.chdir(crmPath);
    execSync('yarn build', {stdio: 'inherit'});
    execSync(`cp -r ./${builtFolder} ${gatsbyBasePath}`);
  } else {
    console.error(
      `Error: Path to crm ${crmPath} does not exist from ${__dirname}. Ignoring Netlify functions build.`,
    );
  }
} catch (error) {
  console.error(`Error building crm: ${error}`);
}
