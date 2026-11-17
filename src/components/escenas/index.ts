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
  'optico-electronico': EscenaOpticoElectronico,
  'celula-animal': EscenaZoomCelula,
  'celula-vegetal': ({ fase }) => EscenaZoomCelula({ fase, vegetal: true }),
}
