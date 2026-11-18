// Código genético estándar (ARNm → aminoácido). Orden de las bases: U, C, A, G.

export const BASES_ARN = ['U', 'C', 'A', 'G'] as const

const TABLA =
  'FFLLSSSSYY**CC*W' + // U _ _
  'LLLLPPPPHHQQRRRR' + // C _ _
  'IIIMTTTTNNKKSSRR' + // A _ _
  'VVVVAAAADDEEGGGG' //   G _ _

export const AMINOACIDOS: Record<string, { nombre: string; abrev: string }> = {
  F: { nombre: 'Fenilalanina', abrev: 'Phe' },
  L: { nombre: 'Leucina', abrev: 'Leu' },
  S: { nombre: 'Serina', abrev: 'Ser' },
  Y: { nombre: 'Tirosina', abrev: 'Tyr' },
  C: { nombre: 'Cisteína', abrev: 'Cys' },
  W: { nombre: 'Triptófano', abrev: 'Trp' },
  P: { nombre: 'Prolina', abrev: 'Pro' },
  H: { nombre: 'Histidina', abrev: 'His' },
  Q: { nombre: 'Glutamina', abrev: 'Gln' },
  R: { nombre: 'Arginina', abrev: 'Arg' },
  I: { nombre: 'Isoleucina', abrev: 'Ile' },
  M: { nombre: 'Metionina (inicio)', abrev: 'Met' },
  T: { nombre: 'Treonina', abrev: 'Thr' },
  N: { nombre: 'Asparagina', abrev: 'Asn' },
  K: { nombre: 'Lisina', abrev: 'Lys' },
  V: { nombre: 'Valina', abrev: 'Val' },
  A: { nombre: 'Alanina', abrev: 'Ala' },
  D: { nombre: 'Ácido aspártico', abrev: 'Asp' },
  E: { nombre: 'Ácido glutámico', abrev: 'Glu' },
  G: { nombre: 'Glicina', abrev: 'Gly' },
  '*': { nombre: 'Parada', abrev: 'Stop' },
}

/** Letra del aminoácido (o «*» si es de parada) para un codón de ARNm, p. ej. «AUG» → «M». */
export function traducir(codon: string): string {
  const idx = (b: string) => BASES_ARN.indexOf(b as (typeof BASES_ARN)[number])
  const [a, b, c] = codon.toUpperCase().split('').map(idx)
  if ([a, b, c].some((n) => n < 0)) return '?'
  return TABLA[a * 16 + b * 4 + c]
}
