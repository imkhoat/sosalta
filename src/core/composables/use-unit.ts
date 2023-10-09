import { StorageUnit } from 'src/core/types/unit-type'

function toByte() {
  console.log('toByte')
  return 0
}

function byteTo() {
  console.log('byteTo')
  return 0
}

/*
 * Converts a size in bytes to a human-readable string representation.
 *
 * @param {number} bytes - The size in bytes.
 * @param {number} [unit=1024] - The unit used to calculate the size.
 * @returns {string} - The human-readable string representation in the format of "<value> <unit>".
 */
function bytesToSize(bytes: number, unit = 1024) {
  if (bytes === 0) return '0 Byte'

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const index = Math.floor(Math.log(bytes) / Math.log(unit))
  const roundedValue = Math.round(bytes / Math.pow(unit, index))

  return `${roundedValue} ${sizes[index]}`
}

interface UsableUnits {
  toByte: (val: string | number, unit: StorageUnit) => string | number
  byteTo: (val: string | number, targetUnit: StorageUnit) => string | number
  bytesToSize: (bytes: number, unit: number) => string | number
}
export default function useUnits(): UsableUnits {
  return {
    toByte,
    byteTo,
    bytesToSize,
  }
}
