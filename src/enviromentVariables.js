const isHomolog = true;
const isAws = true;

export const apiCode = '232527';
export const key = 'cMob202324y';
export const domain = isHomolog
  ? `_homolog.${isAws ? 'captamobilidade' : 'captatec'}.com.br`
  : `.${isAws ? 'captamobilidade' : 'captatec'}.com.br`;

export const tokenUtilsApi = 'ziJ6kMfImbDBbLUkQVrgzzVpUkaIZxe669iAXkOcw9xC3HsKjEUXvfPlPvOzDHAW';

// novo servidor alterar domain no env e homepage no package.json, homolog.
