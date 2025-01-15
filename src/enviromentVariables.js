const isHomolog = false;
const isAws = true;

export const apiCode = '232527';
export const key = 'cMob202324y';
export const domain = isHomolog
  ? `_homolog.${isAws ? 'captamobilidade' : 'captatec'}.com.br`
  : `.${isAws ? 'captamobilidade' : 'captatec'}.com.br`;

export const tokenUtilsApi = '902`38j0912nf09h1fh71403jf8134';

// novo servidor alterar domain no env e homepage no package.json, homolog.
