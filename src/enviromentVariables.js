const isHomolog = false;
const isAws = true;

export const apiCode = '232527';
export const key = 'cMob202324y';
export const domain = isHomolog
  ? `_homolog.${isAws ? 'captamobilidade' : 'captatec'}.com.br`
  : `.${isAws ? 'captamobilidade' : 'captatec'}.com.br`;

export const zApiInstanceId = '3D0BCB329EE2106246C746D85C1A9F0C';
export const zApiToken = 'A7604245AABC13061FCC2D02';
export const zApiSecurityToken = 'Fa3305322f69b4bb8b2ec911e83597f11S';

// novo servidor alterar domain no env e homepage no package.json, homolog.
