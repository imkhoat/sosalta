export const REGEX_PATTERN = {
  USERNAME: /^[A-Za-z0-9@._-]*$/,
  PASSWORD_CONTAIN_NON_ALPHA_CHARACTER: /^(?=.*[!@#\$%\^&\*])/,
  PASSWORD_CONTAIN_BOTH_NUMBER_AND_TEXT:
    /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{6,20}$/,
  EMAIL: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
}
