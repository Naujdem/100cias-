import type { ComponentType } from 'react'
import EscenaMitosis from './EscenaMitosis.tsx'
import EscenaMeiosis from './EscenaMeiosis.tsx'
import EscenaZoomCelula from './EscenaZoomCelula.tsx'
import EscenaNiveles from './EscenaNiveles.tsx'
import EscenaCiclo from './EscenaCiclo.tsx'
import EscenaCitocinesis from './EscenaCitocinesis.tsx'
import { EscenaAnimalVegetal, EscenaProEu } from './EscenaTransforma.tsx'
import { EscenaEndosimbiosis, EscenaRespiracion } from './EscenaEnergia.tsx'
import { EscenaMuerteCelular, EscenaDiferenciacion } from './EscenaVidaCelula.tsx'
import { EscenaFotosintesis, EscenaOrigen } from './EscenaOrigenFoto.tsx'
import { EscenaUnicelulares, EscenaFlor, EscenaAnimales, EscenaEsqueje, EscenaPorPedazos, EscenaDesarrollo } from './EscenasReproduccion.tsx'
import { EscenaMicroscopio, EscenaAumento, EscenaOpticoElectronico } from './EscenasMicroscopio.tsx'
import EscenaMendel from './EscenaMendel.tsx'
import { EscenaGriffith, EscenaAvery, EscenaHersheyChase, EscenaMiescher, EscenaFoto51, EscenaDobleHelice, EscenaRedescubrimiento, EscenaMorgan, EscenaChargaff, EscenaMeselson, EscenaCodigo, EscenaGenoma, EscenaCrispr } from './EscenasGenetica.tsx'
import { EscenaZoomAdn, EscenaNucleotido, EscenaAdnArn, EscenaEmpaquetamiento, EscenaGen } from './EscenasAdn.tsx'
import { EscenaParaQueCopiar, EscenaHorquilla, EscenaModelos, EscenaEnzimas, EscenaErrores } from './EscenasReplicacion.tsx'
import { EscenaDogma, EscenaTranscripcion, EscenaLecturaCodones, EscenaTraduccion, EscenaRegulacion, EscenaSplicing } from './EscenasExpresion.tsx'
import { EscenaIncompleta, EscenaCodominancia, EscenaAbo, EscenaLigada, EscenaGenealogia, EscenaPoligenica } from './EscenasNoMendel.tsx'
import { EscenaQueEsMutacion, EscenaPuntuales, EscenaFalciforme, EscenaNoDisyuncion, EscenaCromosomicas, EscenaVariacion } from './EscenasMutaciones.tsx'
import { EscenaBiotecQue, EscenaInsulina, EscenaPcr, EscenaTransgenico, EscenaEdicion, EscenaDebate } from './EscenasBiotec.tsx'
import { EscenaEcologiaQue, EscenaNivelesEcologicos, EscenaHabitatNicho, EscenaFactores, EscenaPisos, EscenaEcosistemasColombia, EscenaTolerancia } from './EscenasEcologia.tsx'
import { EscenaProductores, EscenaCadena, EscenaPiramide } from './EscenasEnergia.tsx'
import { EscenaIntraespecificas, EscenaDepredacion, EscenaSimbiosis } from './EscenasRelaciones.tsx'
import { EscenaDensidad, EscenaCrecimiento, EscenaDepredadorPresa } from './EscenasPoblaciones.tsx'
import { EscenaSucesionPrimaria, EscenaSucesionSecundaria, EscenaPerturbaciones } from './EscenasSucesion.tsx'
import { EscenaBiodiversidadNiveles, EscenaMegadiversa, EscenaAmenazas, EscenaConservar } from './EscenasBiodiversidad.tsx'
import { EscenaLinneo, EscenaLamarck, EscenaCuvier, EscenaLyell, EscenaBeagle, EscenaSeleccion, EscenaSintesis, EscenaRitmos, EscenaFosil, EscenaAnatomia, EscenaEmbriones, EscenaIslas, EscenaMolecular, EscenaPolillas, EscenaMaiz, EscenaResistencia, EscenaTiposSeleccion } from './EscenasEvolucion.tsx'
import { EscenaTerritorio, EscenaCalendario, EscenaPolicultivo, EscenaDialogo } from './EscenasTerritorio.tsx'

/** Escenas vivas: un dibujo que se transforma según la fase (`fase` = id de la fase en el JSON). */
export const ESCENAS: Record<string, ComponentType<{ fase: string }>> = {
  mitosis: EscenaMitosis,
  meiosis: EscenaMeiosis,
  niveles: EscenaNiveles,
  ciclo: EscenaCiclo,
  citocinesis: EscenaCitocinesis,
  'animal-vegetal': EscenaAnimalVegetal,
  'pro-eu': EscenaProEu,
  endosimbiosis: EscenaEndosimbiosis,
  respiracion: EscenaRespiracion,
  'muerte-celular': EscenaMuerteCelular,
  diferenciacion: EscenaDiferenciacion,
  fotosintesis: EscenaFotosintesis,
  origen: EscenaOrigen,
  microscopio: EscenaMicroscopio,
  'repro-unicelulares': EscenaUnicelulares,
  flor: EscenaFlor,
  esqueje: EscenaEsqueje,
  'por-pedazos': EscenaPorPedazos,
  desarrollo: EscenaDesarrollo,
  'repro-animales': EscenaAnimales,
  aumento: EscenaAumento,
  mendel: EscenaMendel,
  griffith: EscenaGriffith,
  avery: EscenaAvery,
  'hershey-chase': EscenaHersheyChase,
  miescher: EscenaMiescher,
  foto51: EscenaFoto51,
  'doble-helice': EscenaDobleHelice,
  redescubrimiento: EscenaRedescubrimiento,
  morgan: EscenaMorgan,
  chargaff: EscenaChargaff,
  meselson: EscenaMeselson,
  codigo: EscenaCodigo,
  genoma: EscenaGenoma,
  crispr: EscenaCrispr,
  'zoom-adn': EscenaZoomAdn,
  nucleotido: EscenaNucleotido,
  'adn-arn': EscenaAdnArn,
  empaquetamiento: EscenaEmpaquetamiento,
  gen: EscenaGen,
  'para-que-copiar': EscenaParaQueCopiar,
  horquilla: EscenaHorquilla,
  'modelos-replicacion': EscenaModelos,
  'enzimas-replicacion': EscenaEnzimas,
  'errores-replicacion': EscenaErrores,
  dogma: EscenaDogma,
  transcripcion: EscenaTranscripcion,
  'lectura-codones': EscenaLecturaCodones,
  traduccion: EscenaTraduccion,
  regulacion: EscenaRegulacion,
  splicing: EscenaSplicing,
  incompleta: EscenaIncompleta,
  codominancia: EscenaCodominancia,
  abo: EscenaAbo,
  ligada: EscenaLigada,
  genealogia: EscenaGenealogia,
  poligenica: EscenaPoligenica,
  'que-es-mutacion': EscenaQueEsMutacion,
  puntuales: EscenaPuntuales,
  falciforme: EscenaFalciforme,
  'no-disyuncion': EscenaNoDisyuncion,
  cromosomicas: EscenaCromosomicas,
  variacion: EscenaVariacion,
  'biotec-que': EscenaBiotecQue,
  insulina: EscenaInsulina,
  pcr: EscenaPcr,
  transgenico: EscenaTransgenico,
  edicion: EscenaEdicion,
  debate: EscenaDebate,
  'ecologia-que': EscenaEcologiaQue,
  'niveles-ecologicos': EscenaNivelesEcologicos,
  'habitat-nicho': EscenaHabitatNicho,
  factores: EscenaFactores,
  pisos: EscenaPisos,
  'ecosistemas-colombia': EscenaEcosistemasColombia,
  tolerancia: EscenaTolerancia,
  productores: EscenaProductores,
  cadena: EscenaCadena,
  piramide: EscenaPiramide,
  intraespecificas: EscenaIntraespecificas,
  depredacion: EscenaDepredacion,
  simbiosis: EscenaSimbiosis,
  densidad: EscenaDensidad,
  crecimiento: EscenaCrecimiento,
  'depredador-presa': EscenaDepredadorPresa,
  'sucesion-primaria': EscenaSucesionPrimaria,
  'sucesion-secundaria': EscenaSucesionSecundaria,
  perturbaciones: EscenaPerturbaciones,
  'biodiversidad-niveles': EscenaBiodiversidadNiveles,
  megadiversa: EscenaMegadiversa,
  amenazas: EscenaAmenazas,
  conservar: EscenaConservar,
  territorio: EscenaTerritorio,
  calendario: EscenaCalendario,
  policultivo: EscenaPolicultivo,
  dialogo: EscenaDialogo,
  'optico-electronico': EscenaOpticoElectronico,
  'celula-animal': EscenaZoomCelula,
  'celula-vegetal': ({ fase }) => EscenaZoomCelula({ fase, vegetal: true }),
  'ev-linneo': EscenaLinneo,
  'ev-lamarck': EscenaLamarck,
  'ev-cuvier': EscenaCuvier,
  'ev-lyell': EscenaLyell,
  'ev-beagle': EscenaBeagle,
  'ev-seleccion': EscenaSeleccion,
  'ev-sintesis': EscenaSintesis,
  'ev-ritmos': EscenaRitmos,
  'ev-fosil': EscenaFosil,
  'ev-anatomia': EscenaAnatomia,
  'ev-embriones': EscenaEmbriones,
  'ev-islas': EscenaIslas,
  'ev-molecular': EscenaMolecular,
  'ev-polillas': EscenaPolillas,
  'ev-maiz': EscenaMaiz,
  'ev-resistencia': EscenaResistencia,
  'ev-tipos-seleccion': EscenaTiposSeleccion,
}
