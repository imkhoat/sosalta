export enum NOTE_VALUE_TYPE {
  TXT = 0,
  RICH_TEXT = 9,
  TABLE = 1,
  NUMBER = 2,
  INTEGER = 3,
  TIME = 4,
  DATE = 5,
  LINK_URL = 6,
  LINK_NOTEPAGE = 7,
  LINK_FILE = 8,
  SIGNATURE = 10,
  DRAW = 11,
}

export type NoteValueType = `${NOTE_VALUE_TYPE}`
