const fs = require('fs')
const signale = require('signale')
const oldVersion = require('../version.json')
const { execSync } = require('child_process')

const updateMinorVersion = version => {
  signale.warn('Updating version in version JSON')

  const lastDot = version.lastIndexOf('.') + 1
  const mVersion = version.substring(lastDot)
  const mVersionInt = parseInt(mVersion, 10)
  return version.substring(0, lastDot) + (mVersionInt + 1)
}

const version = updateMinorVersion(oldVersion.version)

try {
  fs.writeFileSync('./version.json', JSON.stringify({ version }, null, 2))
  signale.success('Successfully updated version')
} catch (error) {
  signale.error('Problem saving the file')
}
