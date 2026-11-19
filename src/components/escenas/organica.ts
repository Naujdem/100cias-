// Registro de las escenas de Química orgánica (Química área 5).
import type { ComponentType } from 'react'
import { EscenaWohler, EscenaCarbono, EscenaFormulas, EscenaHibridacion } from './EscenasCarbono.tsx'
import { EscenaGrupoIdea, EscenaGrupoMapa } from './EscenasGrupos.tsx'
import { EscenaAlcCocina, EscenaAlcRamificado, EscenaAlcIsomeros, EscenaAlcCombustion } from './EscenasAlcanos.tsx'
import { EscenaAlqCotidiano, EscenaAlqCisTrans, EscenaAlqAdicion, EscenaAlqPolimero, EscenaAlqMecanismo } from './EscenasAlquenos.tsx'
import { EscenaKekule, EscenaOrtoMetaPara, EscenaCfc } from './EscenasAromaticos.tsx'
import { EscenaGuarapo, EscenaTiposAlcohol } from './EscenasAlcoholes.tsx'
import { EscenaCarbonilo, EscenaJabon } from './EscenasCarbonilos.tsx'
import { EscenaAminas, EscenaAmidas } from './EscenasNitrogenados.tsx'
import { EscenaPetroleoOrigen, EscenaBiocombustibles } from './EscenasPetroleo.tsx'

export const ESCENAS_ORGANICA: Record<string, ComponentType<{ fase: string }>> = {
  'org-wohler': EscenaWohler,
  'org-carbono': EscenaCarbono,
  'org-formulas': EscenaFormulas,
  'org-hibridacion': EscenaHibridacion,
  'gf-idea': EscenaGrupoIdea,
  'gf-mapa': EscenaGrupoMapa,
  'alc-cocina': EscenaAlcCocina,
  'alc-ramificado': EscenaAlcRamificado,
  'alc-isomeros': EscenaAlcIsomeros,
  'alc-combustion': EscenaAlcCombustion,
  'alq-cotidiano': EscenaAlqCotidiano,
  'alq-cis-trans': EscenaAlqCisTrans,
  'alq-adicion': EscenaAlqAdicion,
  'alq-mecanismo': EscenaAlqMecanismo,
  'alq-polimero': EscenaAlqPolimero,
  'aro-kekule': EscenaKekule,
  'aro-omp': EscenaOrtoMetaPara,
  'aro-cfc': EscenaCfc,
  'ol-guarapo': EscenaGuarapo,
  'ol-tipos': EscenaTiposAlcohol,
  'car-carbonilo': EscenaCarbonilo,
  'car-jabon': EscenaJabon,
  'nit-aminas': EscenaAminas,
  'nit-amidas': EscenaAmidas,
  'pet-origen': EscenaPetroleoOrigen,
  'pet-bio': EscenaBiocombustibles,
}
