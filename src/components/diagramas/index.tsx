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
import ComparadorRotulado from './ComparadorRotulado.tsx'
import EnfocaMuestra from './EnfocaMuestra.tsx'
import { ReproUnicelularesJuego, ReproPlantasJuego, ReproAnimalesJuego, PartesMicroscopioJuego, AumentoJuego, OpticoElectronicoJuego, FotoRespJuego, DescubridoresJuego, UniPluriJuego, ProEuJuego, AnimalVegetalJuego, CicloJuego, DiploideJuego, MetabolismoJuego, TejidosVegetalesJuego, SistemasJuego } from './JuegosDecide2.tsx'
import { AtpJuego, CelulasMadreJuego, CitocinesisJuego, ColoniasJuego, ControlCicloJuego, CromatinaJuego, CuantosCromosomasJuego, DiferenciacionJuego, EndosimbiosisJuego, EspecializadasJuego, EucariotasJuego, HookeLeeuJuego, MeiosisIoIIJuego, OficioJuego, OrigenCelulasJuego, OrigenPluriJuego, ParaQueDividirseJuego, PasteurJuego, SchleidenSchwannJuego, SenalJuego, TeoriaModernaJuego, UnicelularesJuego, UnionesJuego, VariedadJuego, VentajasJuego, VirusJuego } from './JuegosDecide3.tsx'
import { AveryJuego, GriffithJuego, HersheyChaseJuego, MiescherJuego, Foto51Juego, PiezasDobleHeliceJuego, RedescubrimientoJuego, MorganJuego, ChargaffJuego, MeselsonJuego, CodigoJuego, GenomaJuego, CrisprJuego, MendelVidaJuego } from './JuegosHistoriaGenetica.tsx'
import ArmaHelice from './ArmaHelice.tsx'
import { DondeEstaJuego, NucleotidoJuego, ParejaBaseJuego, AdnArnJuego, CromosomasJuego, GenAleloJuego } from './JuegosAdn.tsx'
import { ParaQueCopiarJuego, HorquillaJuego, ModelosJuego, EnzimasJuego, ErroresJuego } from './JuegosReplicacion.tsx'
import { DogmaJuego, TranscripcionJuego, CodigoGeneticoJuego, TraduccionJuego, RegulacionJuego, SplicingJuego } from './JuegosExpresion.tsx'
import RuedaCodones from './RuedaCodones.tsx'
import PunnettNoMendel from './PunnettNoMendel.tsx'
import MutaGen from './MutaGen.tsx'
import PcrCiclos from './PcrCiclos.tsx'
import { EcologiaQueJuego, NivelesEcologicosJuego, HabitatNichoJuego, FactoresJuego, PisosJuego, EcosistemasColombiaJuego, ToleranciaJuego } from './JuegosEcologia.tsx'
import PisosTermicos from './PisosTermicos.tsx'
import RedTrofica from './RedTrofica.tsx'
import { IntraJuego, DepredacionJuego, SimbiosisJuego } from './JuegosRelaciones.tsx'
import SimuladorPoblaciones from './SimuladorPoblaciones.tsx'
import { DensidadJuego, CrecimientoJuego, DepredadorPresaJuego } from './JuegosPoblaciones.tsx'
import { SucesionPrimariaJuego, SucesionSecundariaJuego, PerturbacionesJuego } from './JuegosSucesion.tsx'
import { BiodiversidadNivelesJuego, MegadiversaJuego, AmenazasJuego, ConservarJuego } from './JuegosBiodiversidad.tsx'
import { LinneoJuego, LamarckJuego, CuvierJuego, LyellJuego, BeagleJuego, DarwinWallaceJuego, SintesisJuego, RitmosJuego, FosilJuego, AnatomiaJuego, EmbrionesJuego, BiogeografiaJuego, MolecularJuego, IngredientesJuego, PolillasJuego, ArtificialJuego, ResistenciaJuego, TiposSeleccionJuego, AdaptacionJuego, MorfologicaJuego, FisiologicaJuego, ConductaJuego, MimetismoJuego, MecanismosJuego, DerivaJuego, FlujoJuego, SexualJuego, HardyJuego, EspecieJuego, AislamientoJuego, AlopatricaJuego, RadiacionJuego, CategoriasJuego, DominiosJuego, CladogramaJuego, ArbolVidaJuego, OrdenHistoriaJuego, ExtincionesJuego, FosilesColombiaJuego, HumanosJuego } from './JuegosHistoriaEvolucion.tsx'
import CalendarioTierra from './CalendarioTierra.tsx'
import Clasificador from './Clasificador.tsx'
import IstmoPanama from './IstmoPanama.tsx'
import SimuladorDeriva from './SimuladorDeriva.tsx'
import ColibriFlores from './ColibriFlores.tsx'
import SimuladorPolillas from './SimuladorPolillas.tsx'
import ExtremidadesHomologas from './ExtremidadesHomologas.tsx'
import { TerritorioJuego, CalendarioJuego, PolicultivoJuego, DialogoJuego } from './JuegosTerritorio.tsx'
import { ProductoresJuego, CadenaJuego, RedJuego, PiramideJuego } from './JuegosEnergia.tsx'
import { BiotecQueJuego, InsulinaJuego, PcrJuego, TransgenicoJuego, EdicionJuego, DebateJuego } from './JuegosBiotec.tsx'
import { QueEsMutacionJuego, PuntualesJuego, EfectosJuego, NumericasJuego, CromosomicasJuego, VariacionJuego } from './JuegosMutaciones.tsx'
import { IncompletaJuego, CodominanciaJuego, SangreJuego, LigadaJuego, GenealogiaJuego, PoligenicaJuego } from './JuegosNoMendel.tsx'
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
import Punnett from './Punnett.tsx'
import SieteCaracteres from './SieteCaracteres.tsx'
import GenotipoFenotipo from './GenotipoFenotipo.tsx'
import { DosCaracteres, CuatroGametos } from './Dihibrido.tsx'
import { MetodoMendelJuego, DominanteJuego, GenotipoJuego, ProporcionJuego, PuroHibridoJuego, GametosJuego, ProbabilidadJuego } from './JuegosMendel.tsx'
import { ComparadorProEu, ComparadorAnimalVegetal, ExploradorBacterias, GaleriaEspecializadas } from './TiposCelulas.tsx'
import { MateriaReciclaJuego, CicloAguaJuego, CicloCarbonoJuego, CicloNitrogenoJuego, CiclosRepasoJuego } from './JuegosCiclos.tsx'
import ViajeCarbono from './ViajeCarbono.tsx'
import { AguaPlanetaJuego, CuencaJuego, FabricasAguaJuego, HuellaHidricaJuego } from './JuegosAgua.tsx'
import MaquetaCuenca from './MaquetaCuenca.tsx'
import { QueEsSueloJuego, HorizontesJuego, ErosionJuego, DeforestacionJuego, ConservarSueloJuego } from './JuegosSuelo.tsx'
import PerfilSuelo from './PerfilSuelo.tsx'
import { TiempoClimaJuego, InvernaderoJuego, CambioClimaticoJuego, NinoNinaJuego, MitigarAdaptarJuego } from './JuegosClima.tsx'
import SimuladorCo2 from './SimuladorCo2.tsx'
import { QueEsContaminacionJuego, AguaContaminadaJuego, AireContaminadoJuego, MercurioJuego, EutrofizacionJuego, PlasticosJuego } from './JuegosContaminacion.tsx'
import RioContaminado from './RioContaminado.tsx'
import { RecursosJuego, HidroelectricaJuego, RepresasJuego, FuentesEnergiaJuego, HuellaEcologicaJuego } from './JuegosRecursos.tsx'
import MezclaElectrica from './MezclaElectrica.tsx'
import { ResiduosJuego, LasRJuego, SepararJuego, CompostajeJuego, EconomiaCircularJuego } from './JuegosResiduos.tsx'
import Canecas from './Canecas.tsx'
import { EsMateriaJuego, QueCienciaJuego, QuimicaCampoJuego, LabSeguroJuego } from './JuegosQueEsQuimica.tsx'
import { MasaVolumenJuego, FlotaHundeJuego, QuePropiedadJuego, HierveJuego } from './JuegosPropiedades.tsx'
import { EstadoJuego, CambioEstadoJuego, MesetaJuego } from './JuegosEstados.tsx'
import ParticulasTemperatura from './ParticulasTemperatura.tsx'
import { FisicoQuimicoJuego, SenalJuego as SenalQuimicaJuego, PropiedadFQJuego } from './JuegosCambios.tsx'
import { ElementoCompuestoJuego, HomoHeteroJuego, DondeVaJuego } from './JuegosClasificacion.tsx'
import ArbolMateria from './ArbolMateria.tsx'
import { SepararHeteroJuego, SepararHomoJuego, CafeSeparaJuego } from './JuegosSeparacion.tsx'
import { DemocritoJuego, DaltonJuego, ThomsonJuego, RutherfordJuego, BohrJuego, NubeJuego, ChadwickJuego } from './JuegosModelosAtomicos.tsx'
import LaminaOro from './LaminaOro.tsx'
import ArmaAtomo from './ArmaAtomo.tsx'
import LlenaOrbitales from './LlenaOrbitales.tsx'
import TablaPeriodica from './TablaPeriodica.tsx'
import { HistoriaTablaJuego, GrupoPeriodoJuego, MetalJuego, FamiliaJuego, ColombiaElementosJuego } from './JuegosTabla.tsx'
import { CapasElectronesJuego, MoellerJuego, HundJuego, CuanticosJuego } from './JuegosElectrones.tsx'
import { ParticulasJuego, NumeroAtomicoJuego, IonJuego, IsotopoJuego } from './JuegosAtomoDentro.tsx'
import { AmenazaVulnerabilidadJuego, AmenazasColombiaJuego, ArmeroJuego, AntesDuranteDespuesJuego, PlanEscolarJuego } from './JuegosRiesgo.tsx'
import RiesgoVereda from './RiesgoVereda.tsx'
import { DesarrolloSostenibleJuego, OdsJuego, PraeJuego, ProyectoAulaJuego, ParticipacionJuego } from './JuegosSostenibilidad.tsx'
import ArbolProblemas from './ArbolProblemas.tsx'

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
  'comparador-rotulado': ComparadorRotulado,
  'descubridores-juego': DescubridoresJuego,
  'unipluri-juego': UniPluriJuego,
  'proeu-juego': ProEuJuego,
  'animal-vegetal-juego': AnimalVegetalJuego,
  'ciclo-juego': CicloJuego,
  'diploide-juego': DiploideJuego,
  'metabolismo-juego': MetabolismoJuego,
  'tejidos-vegetales-juego': TejidosVegetalesJuego,
  'sistemas-juego': SistemasJuego,
  'fotoresp-juego': FotoRespJuego,
  'enfoca-muestra': EnfocaMuestra,
  'repro-unicelulares-juego': ReproUnicelularesJuego,
  'repro-plantas-juego': ReproPlantasJuego,
  'repro-animales-juego': ReproAnimalesJuego,
  'partes-microscopio-juego': PartesMicroscopioJuego,
  'aumento-juego': AumentoJuego,
  'optico-electronico-juego': OpticoElectronicoJuego,
  // área 2 · herencia mendeliana
  punnett: () => <Punnett modo="mono" />,
  'siete-caracteres': SieteCaracteres,
  'genotipo-fenotipo': GenotipoFenotipo,
  'dos-caracteres': DosCaracteres,
  'cuatro-gametos': CuatroGametos,
  'punnett-prueba': () => <Punnett modo="prueba" />,
  'punnett-dihibrido': () => <Punnett modo="di" />,
  'metodo-mendel-juego': MetodoMendelJuego,
  'dominante-juego': DominanteJuego,
  'genotipo-juego': GenotipoJuego,
  'proporcion-juego': ProporcionJuego,
  'puro-hibrido-juego': PuroHibridoJuego,
  'gametos-juego': GametosJuego,
  'probabilidad-juego': ProbabilidadJuego,
  // revisión del área 1: juegos para las fichas que no tenían «Juega»
  'atp-juego': AtpJuego,
  'celulas-madre-juego': CelulasMadreJuego,
  'citocinesis-juego': CitocinesisJuego,
  'colonias-juego': ColoniasJuego,
  'control-ciclo-juego': ControlCicloJuego,
  'cromatina-juego': CromatinaJuego,
  'cuantos-cromosomas-juego': CuantosCromosomasJuego,
  'diferenciacion-juego': DiferenciacionJuego,
  'dividirse-juego': ParaQueDividirseJuego,
  'endosimbiosis-juego': EndosimbiosisJuego,
  'especializadas-juego': EspecializadasJuego,
  'eucariotas-juego': EucariotasJuego,
  'hooke-leeu-juego': HookeLeeuJuego,
  'griffith-juego': GriffithJuego,
  'avery-juego': AveryJuego,
  'hershey-juego': HersheyChaseJuego,
  'miescher-juego': MiescherJuego,
  'foto51-juego': Foto51Juego,
  'piezas-helice-juego': PiezasDobleHeliceJuego,
  'redescubrimiento-juego': RedescubrimientoJuego,
  'morgan-juego': MorganJuego,
  'chargaff-juego': ChargaffJuego,
  'meselson-juego': MeselsonJuego,
  'codigo-juego': CodigoJuego,
  'genoma-juego': GenomaJuego,
  'crispr-juego': CrisprJuego,
  'mendel-vida-juego': MendelVidaJuego,
  'arma-helice': ArmaHelice,
  'donde-adn-juego': DondeEstaJuego,
  'nucleotido-juego': NucleotidoJuego,
  'pareja-base-juego': ParejaBaseJuego,
  'adn-arn-juego': AdnArnJuego,
  'cromosomas-juego': CromosomasJuego,
  'gen-alelo-juego': GenAleloJuego,
  'para-que-copiar-juego': ParaQueCopiarJuego,
  'horquilla-juego': HorquillaJuego,
  'modelos-replicacion-juego': ModelosJuego,
  'enzimas-replicacion-juego': EnzimasJuego,
  'errores-replicacion-juego': ErroresJuego,
  'dogma-juego': DogmaJuego,
  'transcripcion-juego': TranscripcionJuego,
  'codigo-genetico-juego': CodigoGeneticoJuego,
  'traduccion-juego': TraduccionJuego,
  'regulacion-juego': RegulacionJuego,
  'splicing-juego': SplicingJuego,
  'rueda-codones': RuedaCodones,
  transcribe: () => <ArmaHelice arn />,
  'punnett-incompleta': () => <PunnettNoMendel modo="incompleta" />,
  'punnett-sangre': () => <PunnettNoMendel modo="sangre" />,
  'punnett-ligado': () => <PunnettNoMendel modo="ligado" />,
  'incompleta-juego': IncompletaJuego,
  'codominancia-juego': CodominanciaJuego,
  'sangre-juego': SangreJuego,
  'ligada-juego': LigadaJuego,
  'genealogia-juego': GenealogiaJuego,
  'poligenica-juego': PoligenicaJuego,
  'muta-gen': MutaGen,
  'que-es-mutacion-juego': QueEsMutacionJuego,
  'puntuales-juego': PuntualesJuego,
  'efectos-juego': EfectosJuego,
  'numericas-juego': NumericasJuego,
  'cromosomicas-juego': CromosomicasJuego,
  'variacion-juego': VariacionJuego,
  'pcr-ciclos': PcrCiclos,
  'biotec-que-juego': BiotecQueJuego,
  'insulina-juego': InsulinaJuego,
  'pcr-juego': PcrJuego,
  'transgenico-juego': TransgenicoJuego,
  'edicion-juego': EdicionJuego,
  'debate-juego': DebateJuego,
  'ecologia-que-juego': EcologiaQueJuego,
  'niveles-ecologicos-juego': NivelesEcologicosJuego,
  'habitat-nicho-juego': HabitatNichoJuego,
  'factores-juego': FactoresJuego,
  'pisos-juego': PisosJuego,
  'ecosistemas-co-juego': EcosistemasColombiaJuego,
  'tolerancia-juego': ToleranciaJuego,
  'pisos-termicos': PisosTermicos,
  'red-trofica': RedTrofica,
  'productores-juego': ProductoresJuego,
  'cadena-juego': CadenaJuego,
  'red-juego': RedJuego,
  'piramide-juego': PiramideJuego,
  'intra-juego': IntraJuego,
  'depredacion-juego': DepredacionJuego,
  'simbiosis-juego': SimbiosisJuego,
  'simulador-poblaciones': SimuladorPoblaciones,
  'densidad-juego': DensidadJuego,
  'crecimiento-juego': CrecimientoJuego,
  'depredador-presa-juego': DepredadorPresaJuego,
  'sucesion-primaria-juego': SucesionPrimariaJuego,
  'sucesion-secundaria-juego': SucesionSecundariaJuego,
  'perturbaciones-juego': PerturbacionesJuego,
  'biodiv-niveles-juego': BiodiversidadNivelesJuego,
  'megadiversa-juego': MegadiversaJuego,
  'amenazas-juego': AmenazasJuego,
  'conservar-juego': ConservarJuego,
  'territorio-juego': TerritorioJuego,
  'calendario-juego': CalendarioJuego,
  'policultivo-juego': PolicultivoJuego,
  'dialogo-juego': DialogoJuego,
  'meiosis-i-ii-juego': MeiosisIoIIJuego,
  'oficio-juego': OficioJuego,
  'origen-celulas-juego': OrigenCelulasJuego,
  'origen-pluri-juego': OrigenPluriJuego,
  'pasteur-juego': PasteurJuego,
  'schleiden-schwann-juego': SchleidenSchwannJuego,
  'senal-juego': SenalJuego,
  'teoria-moderna-juego': TeoriaModernaJuego,
  'unicelulares-juego': UnicelularesJuego,
  'uniones-juego': UnionesJuego,
  'variedad-juego': VariedadJuego,
  'ventajas-juego': VentajasJuego,
  'virus-juego': VirusJuego,
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
  'linneo-juego': LinneoJuego,
  'lamarck-juego': LamarckJuego,
  'cuvier-juego': CuvierJuego,
  'lyell-juego': LyellJuego,
  'beagle-juego': BeagleJuego,
  'darwin-wallace-juego': DarwinWallaceJuego,
  'sintesis-juego': SintesisJuego,
  'ritmos-juego': RitmosJuego,
  'fosil-juego': FosilJuego,
  'anatomia-juego': AnatomiaJuego,
  'embriones-juego': EmbrionesJuego,
  'biogeografia-juego': BiogeografiaJuego,
  'molecular-juego': MolecularJuego,
  'extremidades-homologas': ExtremidadesHomologas,
  'ingredientes-juego': IngredientesJuego,
  'polillas-juego': PolillasJuego,
  'artificial-juego': ArtificialJuego,
  'resistencia-juego': ResistenciaJuego,
  'tipos-seleccion-juego': TiposSeleccionJuego,
  'simulador-polillas': SimuladorPolillas,
  'adaptacion-juego': AdaptacionJuego,
  'morfologica-juego': MorfologicaJuego,
  'fisiologica-juego': FisiologicaJuego,
  'conducta-juego': ConductaJuego,
  'mimetismo-juego': MimetismoJuego,
  'colibri-flores': ColibriFlores,
  'mecanismos-juego': MecanismosJuego,
  'deriva-juego': DerivaJuego,
  'flujo-juego': FlujoJuego,
  'sexual-juego': SexualJuego,
  'hardy-juego': HardyJuego,
  'simulador-deriva': SimuladorDeriva,
  'especie-juego': EspecieJuego,
  'aislamiento-juego': AislamientoJuego,
  'alopatrica-juego': AlopatricaJuego,
  'radiacion-juego': RadiacionJuego,
  'istmo-panama': IstmoPanama,
  'categorias-juego': CategoriasJuego,
  'dominios-juego': DominiosJuego,
  'cladograma-juego': CladogramaJuego,
  'arbol-vida-juego': ArbolVidaJuego,
  clasificador: Clasificador,
  'orden-historia-juego': OrdenHistoriaJuego,
  'extinciones-juego': ExtincionesJuego,
  'fosiles-colombia-juego': FosilesColombiaJuego,
  'humanos-juego': HumanosJuego,
  'calendario-tierra': CalendarioTierra,
  'materia-recicla-juego': MateriaReciclaJuego,
  'ciclo-agua-juego': CicloAguaJuego,
  'ciclo-carbono-juego': CicloCarbonoJuego,
  'ciclo-nitrogeno-juego': CicloNitrogenoJuego,
  'ciclos-repaso-juego': CiclosRepasoJuego,
  'viaje-carbono': ViajeCarbono,
  'agua-planeta-juego': AguaPlanetaJuego,
  'cuenca-juego': CuencaJuego,
  'fabricas-agua-juego': FabricasAguaJuego,
  'huella-hidrica-juego': HuellaHidricaJuego,
  'maqueta-cuenca': MaquetaCuenca,
  'que-es-suelo-juego': QueEsSueloJuego,
  'horizontes-juego': HorizontesJuego,
  'erosion-juego': ErosionJuego,
  'deforestacion-juego': DeforestacionJuego,
  'conservar-suelo-juego': ConservarSueloJuego,
  'perfil-suelo': PerfilSuelo,
  'tiempo-clima-juego': TiempoClimaJuego,
  'invernadero-juego': InvernaderoJuego,
  'cambio-climatico-juego': CambioClimaticoJuego,
  'nino-nina-juego': NinoNinaJuego,
  'mitigar-adaptar-juego': MitigarAdaptarJuego,
  'simulador-co2': SimuladorCo2,
  'que-es-contaminacion-juego': QueEsContaminacionJuego,
  'agua-contaminada-juego': AguaContaminadaJuego,
  'aire-contaminado-juego': AireContaminadoJuego,
  'mercurio-juego': MercurioJuego,
  'eutrofizacion-juego': EutrofizacionJuego,
  'plasticos-juego': PlasticosJuego,
  'rio-contaminado': RioContaminado,
  'recursos-juego': RecursosJuego,
  'hidroelectrica-juego': HidroelectricaJuego,
  'represas-juego': RepresasJuego,
  'fuentes-energia-juego': FuentesEnergiaJuego,
  'huella-ecologica-juego': HuellaEcologicaJuego,
  'mezcla-electrica': MezclaElectrica,
  'residuos-juego': ResiduosJuego,
  'las-r-juego': LasRJuego,
  'separar-juego': SepararJuego,
  'compostaje-juego': CompostajeJuego,
  'economia-circular-juego': EconomiaCircularJuego,
  canecas: Canecas,
  'es-materia-juego': EsMateriaJuego,
  'que-ciencia-juego': QueCienciaJuego,
  'quimica-campo-juego': QuimicaCampoJuego,
  'lab-seguro-juego': LabSeguroJuego,
  'masa-volumen-juego': MasaVolumenJuego,
  'flota-hunde-juego': FlotaHundeJuego,
  'que-propiedad-juego': QuePropiedadJuego,
  'hierve-juego': HierveJuego,
  'estado-juego': EstadoJuego,
  'cambio-estado-juego': CambioEstadoJuego,
  'meseta-juego': MesetaJuego,
  'particulas-temperatura': ParticulasTemperatura,
  'fisico-quimico-juego': FisicoQuimicoJuego,
  'senal-quimica-juego': SenalQuimicaJuego,
  'propiedad-fq-juego': PropiedadFQJuego,
  'elemento-compuesto-juego': ElementoCompuestoJuego,
  'homo-hetero-juego': HomoHeteroJuego,
  'donde-va-juego': DondeVaJuego,
  'arbol-materia': ArbolMateria,
  'separar-hetero-juego': SepararHeteroJuego,
  'separar-homo-juego': SepararHomoJuego,
  'cafe-separa-juego': CafeSeparaJuego,
  'democrito-juego': DemocritoJuego,
  'dalton-juego': DaltonJuego,
  'thomson-juego': ThomsonJuego,
  'rutherford-juego': RutherfordJuego,
  'bohr-juego': BohrJuego,
  'nube-juego': NubeJuego,
  'chadwick-juego': ChadwickJuego,
  'lamina-oro': LaminaOro,
  'arma-atomo': ArmaAtomo,
  'particulas-juego': ParticulasJuego,
  'numero-atomico-juego': NumeroAtomicoJuego,
  'ion-juego': IonJuego,
  'isotopo-juego': IsotopoJuego,
  'llena-orbitales': LlenaOrbitales,
  'capas-e-juego': CapasElectronesJuego,
  'moeller-juego': MoellerJuego,
  'hund-juego': HundJuego,
  'cuanticos-juego': CuanticosJuego,
  'tabla-periodica': TablaPeriodica,
  'historia-tabla-juego': HistoriaTablaJuego,
  'grupo-periodo-juego': GrupoPeriodoJuego,
  'metal-juego': MetalJuego,
  'familia-juego': FamiliaJuego,
  'colombia-elementos-juego': ColombiaElementosJuego,
  'amenaza-vulnerabilidad-juego': AmenazaVulnerabilidadJuego,
  'amenazas-colombia-juego': AmenazasColombiaJuego,
  'armero-juego': ArmeroJuego,
  'antes-durante-despues-juego': AntesDuranteDespuesJuego,
  'plan-escolar-juego': PlanEscolarJuego,
  'riesgo-vereda': RiesgoVereda,
  'desarrollo-sostenible-juego': DesarrolloSostenibleJuego,
  'ods-juego': OdsJuego,
  'prae-juego': PraeJuego,
  'proyecto-aula-juego': ProyectoAulaJuego,
  'participacion-juego': ParticipacionJuego,
  'arbol-problemas': ArbolProblemas,
}
