import type { ComponentType } from 'react'
import CorchoHooke from './CorchoHooke.tsx'
import TejidosCelulas from './TejidosCelulas.tsx'
import DivisionCelular from './DivisionCelular.tsx'
import ExperimentoPasteur from './ExperimentoPasteur.tsx'
import CuentaComoCelula from './CuentaComoCelula.tsx'
import Endosimbiosis from './Endosimbiosis.tsx'
import NivelesOrganizacion, { NIVELES } from './NivelesOrganizacion.tsx'
import NivelesJuego from './NivelesJuego.tsx'
import CelulaUrgencias from './CelulaUrgencias.tsx'
import ArmaCelula from './ArmaCelula.tsx'
import CarreraProteina from './CarreraProteina.tsx'
import { LisosomaJuego, CitoplasmaJuego, CitoesqueletoJuego, RibosomaJuego, PeroxisomaJuego, ParedMatrizJuego } from './JuegosDecide.tsx'
import { MitocondriaJuego, NucleoJuego } from './JuegosPropios.tsx'
import FasesMitosis from './FasesMitosis.tsx'
import MeiosisJuego from './MeiosisJuego.tsx'
import ClasificaCasos, { CASOS_OXIGENO, CASOS_MUERTE, CASOS_TEJIDOS, CASOS_REPRODUCCION } from './ClasificaCasos.tsx'
import { Diferenciacion, CelulasMadre, TejidosAnimales, TejidosVegetales, OrganoTejidos, ReproduccionTipos } from './Organismo.tsx'
import { EnzimaLlave, AtpPila, RespiracionFermentacion, SenalesCelulares, UnionesCelulares, MuerteCelular } from './MetabolismoCelular.tsx'
import { ParesHomologos, CuentaCromosomas, MeiosisPasos, VariedadGametos, ComparaMitosisMeiosis } from './Meiosis.tsx'
import { CicloReloj, CromosomaCompacta, CitocinesisDiagrama, SemaforosCiclo } from './CicloCelular.tsx'
import { NucleoDiagrama, CloroplastoDiagrama, LisosomaDiagrama } from './CelulaEucOrg.tsx'
import { CitoesqueletoDiagrama, RibosomasDiagrama, PeroxisomaDiagrama, MatrizParedDiagrama } from './CelulaEucMas.tsx'
import GotaLeeuwenhoek from './GotaLeeuwenhoek.tsx'
import UniPluri from './UniPluri.tsx'
import { ExploradorCelula, RutaProteinaDiagrama, EnergiaCelular } from './CelulaEucDiagramas.tsx'
import MembranaActividades, { PorteroMembrana } from './MembranaJuegos.tsx'
import { ComparadorProEu, ComparadorAnimalVegetal, ExploradorBacterias, GaleriaEspecializadas } from './TiposCelulas.tsx'

/** Registro de diagramas interactivos. La clave es el valor de `bloque.diagrama`. */
export const DIAGRAMAS: Record<string, ComponentType> = {
  'corcho-hooke': CorchoHooke,
  'gota-leeuwenhoek': GotaLeeuwenhoek,
  // un diagrama por nivel, que abre el diagrama anidado ya posicionado en ese nivel
  ...Object.fromEntries(NIVELES.map((n, i) => [`nivel-${n.id}`, () => <NivelesOrganizacion inicial={i} />])),
  'niveles-juego': NivelesJuego,
  // subtema 1.3: el diagrama abre ya posicionado en un paso, o en el juego de clasificar
  'uni-paso-0': () => <UniPluri paso={0} />,
  'uni-paso-1': () => <UniPluri paso={1} />,
  'uni-paso-2': () => <UniPluri paso={2} />,
  'uni-paso-3': () => <UniPluri paso={3} />,
  'uni-paso-4': () => <UniPluri paso={4} />,
  'uni-clasifica': () => <UniPluri modo="clasifica" />,
  // subtema 2: tipos de células
  'comparador-pro-eu': () => <ComparadorProEu />,
  'clasifica-pro-eu': () => <ComparadorProEu modo="clasifica" />,
  'comparador-animal-vegetal': () => <ComparadorAnimalVegetal />,
  'clasifica-animal-vegetal': () => <ComparadorAnimalVegetal modo="clasifica" />,
  'explorador-bacterias': () => <ExploradorBacterias />,
  'bacterias-donde-viven': () => <ExploradorBacterias modo="donde" />,
  'galeria-especializadas': GaleriaEspecializadas,
  // subtema 3: célula eucariota
  'explorador-celula': () => <ExploradorCelula />,
  'celula-quien-hace': () => <ExploradorCelula modo="une" />,
  'ruta-proteina': () => <RutaProteinaDiagrama />,
  'ruta-proteina-pasos': () => <RutaProteinaDiagrama modo="ordena" />,
  'energia-celular': EnergiaCelular,
  'membrana-transporte': () => <MembranaActividades />,
  'membrana-explora': () => <MembranaActividades sinJuego />,
  'membrana-juego': PorteroMembrana,
  'celula-urgencias': CelulaUrgencias,
  'arma-celula': ArmaCelula,
  'carrera-proteina': CarreraProteina,
  'lisosoma-juego': LisosomaJuego,
  'citoplasma-juego': CitoplasmaJuego,
  'citoesqueleto-juego': CitoesqueletoJuego,
  'ribosoma-juego': RibosomaJuego,
  'peroxisoma-juego': PeroxisomaJuego,
  'pared-juego': ParedMatrizJuego,
  'mitocondria-juego': MitocondriaJuego,
  'nucleo-juego': NucleoJuego,
  'ciclo-reloj': CicloReloj,
  'fases-mitosis': FasesMitosis,
  'cromosoma-compacta': CromosomaCompacta,
  'citocinesis': CitocinesisDiagrama,
  'semaforos-ciclo': SemaforosCiclo,
  // subtema 4.2: meiosis
  'pares-homologos': ParesHomologos,
  'cuenta-cromosomas': CuentaCromosomas,
  'meiosis-pasos': () => <MeiosisPasos />,
  'meiosis-ii': () => <MeiosisPasos inicial={4} />,
  'variedad-gametos': VariedadGametos,
  'mitosis-meiosis': ComparaMitosisMeiosis,
  'meiosis-juego': () => <MeiosisJuego />,
  'meiosis-ordena': () => <MeiosisJuego inicial="ordena" />,
  // subtema 4.3: metabolismo, comunicación y muerte celular
  'enzima-llave': EnzimaLlave,
  'atp-pila': AtpPila,
  'respiracion-fermentacion': RespiracionFermentacion,
  'senales-celulares': SenalesCelulares,
  'uniones-celulares': UnionesCelulares,
  'muerte-celular': MuerteCelular,
  // tema 5: de la célula al organismo
  'diferenciacion': Diferenciacion,
  'celulas-madre': CelulasMadre,
  'tejidos-animales': TejidosAnimales,
  'tejidos-vegetales': TejidosVegetales,
  'organo-tejidos': OrganoTejidos,
  'reproduccion-tipos': ReproduccionTipos,
  'tejidos-juego': () => <ClasificaCasos titulo="¿Qué tejido es?" opciones={['Epitelial', 'Conectivo', 'Muscular', 'Nervioso']} casos={CASOS_TEJIDOS} clave="cien:tejidos-mejor" pista="Pista: cubrir = epitelial; unir o sostener = conectivo; mover = muscular; informar = nervioso." />,
  'reproduccion-juego': () => <ClasificaCasos titulo="¿Asexual o sexual?" opciones={['Asexual', 'Sexual']} casos={CASOS_REPRODUCCION} clave="cien:reproduccion-mejor" pista="Pista: si hay un solo progenitor y los hijos son copias, es asexual; si se unen gametos de dos progenitores, es sexual." />,
  'oxigeno-juego': () => <ClasificaCasos titulo="¿Respiración o fermentación?" opciones={['Respiración (con O₂)', 'Fermentación (sin O₂)']} casos={CASOS_OXIGENO} clave="cien:oxigeno-mejor" pista="Pista: si trabaja la mitocondria y sale mucha energía, es respiración; si no hay oxígeno y salen ácido láctico o alcohol, es fermentación." />,
  'muerte-juego': () => <ClasificaCasos titulo="¿Apoptosis o necrosis?" opciones={['Apoptosis', 'Necrosis']} casos={CASOS_MUERTE} clave="cien:muerte-mejor" pista="Pista: si es una orden ordenada (desarrollo, defensa), es apoptosis; si es por un daño (golpe, quemadura, falta de sangre), es necrosis." />,
  'citoesqueleto': CitoesqueletoDiagrama,
  'ribosomas': RibosomasDiagrama,
  'peroxisomas': PeroxisomaDiagrama,
  'pared-matriz': MatrizParedDiagrama,
  'nucleo-receta': NucleoDiagrama,
  'cloroplasto-fotosintesis': CloroplastoDiagrama,
  'lisosoma-digiere': LisosomaDiagrama,
  'membrana-portero': () => <MembranaActividades inicial="portero" />,
  'membrana-osmosis': () => <MembranaActividades inicial="osmosis" />,
  'cuenta-celula': CuentaComoCelula,
  'endosimbiosis': Endosimbiosis,
  'experimento-pasteur': ExperimentoPasteur,
  'division-celular': DivisionCelular,
  'tejido-planta': () => <TejidosCelulas inicial="planta" />,
  'tejido-animal': () => <TejidosCelulas inicial="animal" />,
}
