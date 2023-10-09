import { BitUnit } from '../types/unit-type'

const unitFomular = {
  BIT: 0,
  BYTE: 1,
  KB: 1024,
  MB: 1048576,
  GB: 1073741824,
  TB: 1099511627776,
}
function convertToByte(qty: number, unit: BitUnit) {
  return qty * unitFomular[unit]
}

function convertCapacity(qty: number, from: BitUnit, to: BitUnit) {
  const byteValue = convertToByte(qty, from)
  return byteValue / unitFomular[to]
}

interface UsableCapacityDrive {
  convertToByte: (qty: number, unit: BitUnit) => number
  convertCapacity: (qty: number, from: BitUnit, to: BitUnit) => number
}
export default function useCapacityDrive(): UsableCapacityDrive {
  return {
    convertToByte,
    convertCapacity,
  }
}
