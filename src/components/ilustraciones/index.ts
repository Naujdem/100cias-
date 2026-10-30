import type { ComponentType } from 'react'
import CorchoLamina from './CorchoLamina.tsx'
import MicroscopioLeeuwenhoek from './MicroscopioLeeuwenhoek.tsx'
import TejidoVegetal from './TejidoVegetal.tsx'
import TejidoAnimal from './TejidoAnimal.tsx'
import CelulaDividiendo from './CelulaDividiendo.tsx'
import Matraz from './Matraz.tsx'
import FrascosRedi from './FrascosRedi.tsx'
import EscenaEndosimbiosis from './EscenaEndosimbiosis.tsx'
import GotaAnimalculos from './GotaAnimalculos.tsx'
import MicroscopioHooke from './MicroscopioHooke.tsx'
import { NivelAtomo, NivelMoleculas, NivelMacromoleculas, NivelOrganulo, NivelCelula, NivelTejido, NivelOrgano, NivelSistema, NivelOrganismo, NivelMasAlla } from './Niveles.tsx'
import { PasoCelulas, EjemplosUnicelulares, SuperficieVolumen, OrigenesPluri } from './UniPluri.tsx'
import { NivCuatroAtomos, NivOtrosAtomos, NivMoleculasEjemplos, NivAguaCuerpo, NivGlucosaEnergia, NivMacroCuatro, NivProteinaForma, NivOrganulosTres, NivProEuc, NivUnoMuchas, NivTejidosPlantas, NivCorazon, NivSistemaCadena, NivEcologia, NivSangre, NivPlantaOrganos } from './Escenas12.tsx'
import { UniFunciones, UniNucleo, UniInvisible, UniFision, PluriCigoto, PluriSenales, DivOficios, DivMismoAdn, VenTransporte, OriDosFormas, OriCopoNieve, ColEspectro, ColCoanoflagelado } from './Escenas13.tsx'
import { PostuladoSeres, PostuladoUnidad, PostuladoOrigen } from './Postulados.tsx'

/** Registro de ilustraciones SVG. La clave es el `recurso` de una ilustración de tipo «svg». */
export const ILUSTRACIONES_SVG: Record<string, ComponentType> = {
  'corcho-lamina': CorchoLamina,
  'microscopio-hooke': MicroscopioHooke,
  'microscopio-leeuwenhoek': MicroscopioLeeuwenhoek,
  'gota-animalculos': GotaAnimalculos,
  'endosimbiosis-mito': () => EscenaEndosimbiosis({ paso: 4 }),
  'matraz-cisne': () => Matraz({ tipo: 'cisne' }),
  'frascos-redi': () => FrascosRedi({ dia: 5 }),
  'celula-anafase': () => CelulaDividiendo({ etapa: 3 }),
  'tejido-vegetal': TejidoVegetal,
  'tejido-animal': TejidoAnimal,
  'postulado-seres': PostuladoSeres,
  'postulado-unidad': PostuladoUnidad,
  'postulado-origen': PostuladoOrigen,
  'uni-ejemplos': EjemplosUnicelulares,
  'uni-paso-0': () => PasoCelulas({ paso: 0 }),
  'uni-paso-1': () => PasoCelulas({ paso: 1 }),
  'uni-paso-2': () => PasoCelulas({ paso: 2 }),
  'uni-paso-3': () => PasoCelulas({ paso: 3 }),
  'uni-paso-4': () => PasoCelulas({ paso: 4 }),
  'uni-superficie-volumen': SuperficieVolumen,
  'uni-origenes': OrigenesPluri,
  'nivel-atomos': NivelAtomo,
  'nivel-moleculas': NivelMoleculas,
  'nivel-macromoleculas': NivelMacromoleculas,
  'nivel-organulos': NivelOrganulo,
  'nivel-celula': NivelCelula,
  'nivel-tejido': NivelTejido,
  'nivel-organo': NivelOrgano,
  'nivel-sistema': NivelSistema,
  'nivel-organismo': NivelOrganismo,
  'nivel-mas-alla': NivelMasAlla,
  'niv-cuatro-atomos': NivCuatroAtomos,
  'niv-otros-atomos': NivOtrosAtomos,
  'niv-moleculas-ejemplos': NivMoleculasEjemplos,
  'niv-agua-cuerpo': NivAguaCuerpo,
  'niv-glucosa-energia': NivGlucosaEnergia,
  'niv-macro-cuatro': NivMacroCuatro,
  'niv-proteina-forma': NivProteinaForma,
  'niv-organulos-tres': NivOrganulosTres,
  'niv-pro-euc': NivProEuc,
  'niv-uno-muchas': NivUnoMuchas,
  'niv-tejidos-plantas': NivTejidosPlantas,
  'niv-corazon': NivCorazon,
  'niv-sistema-cadena': NivSistemaCadena,
  'niv-ecologia': NivEcologia,
  'niv-sangre': NivSangre,
  'niv-planta-organos': NivPlantaOrganos,
  'uni-funciones': UniFunciones,
  'uni-nucleo': UniNucleo,
  'uni-invisible': UniInvisible,
  'uni-fision': UniFision,
  'pluri-cigoto': PluriCigoto,
  'pluri-senales': PluriSenales,
  'div-oficios': DivOficios,
  'div-mismo-adn': DivMismoAdn,
  'ven-transporte': VenTransporte,
  'ori-dos-formas': OriDosFormas,
  'ori-copo-nieve': OriCopoNieve,
  'col-espectro': ColEspectro,
  'col-coanoflagelado': ColCoanoflagelado,
}
