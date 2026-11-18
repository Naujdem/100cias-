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
import { EscenaLinneo, EscenaLamarck, EscenaCuvier, EscenaLyell, EscenaBeagle, EscenaSeleccion, EscenaSintesis, EscenaRitmos, EscenaFosil, EscenaAnatomia, EscenaEmbriones, EscenaIslas, EscenaMolecular, EscenaPolillas, EscenaMaiz, EscenaResistencia, EscenaTiposSeleccion, EscenaAdaptacion, EscenaFrailejon, EscenaCactus, EscenaMigracion, EscenaMimetismo, EscenaAcervo, EscenaDeriva, EscenaFlujo, EscenaSexual, EscenaEspecie, EscenaAlopatrica, EscenaPoliploidia, EscenaRadiacion, EscenaCategorias, EscenaDominios, EscenaCladograma, EscenaArbolVida, EscenaOxigeno, EscenaTierraFirme, EscenaExtinciones, EscenaFosilesColombia, EscenaHomininos } from './EscenasEvolucion.tsx'
import { EscenaTerritorio, EscenaCalendario, EscenaPolicultivo, EscenaDialogo } from './EscenasTerritorio.tsx'
import { EscenaAguaPlaneta, EscenaCuenca, EscenaParamoEsponja } from './EscenasAgua.tsx'
import { EscenaFormacionSuelo, EscenaErosion, EscenaDeforestacion } from './EscenasSuelo.tsx'
import { EscenaInvernadero, EscenaGlaciares, EscenaEnos } from './EscenasClima.tsx'
import { EscenaAireContaminado, EscenaBiomagnificacion, EscenaEutrofizacion } from './EscenasContaminacion.tsx'
import { EscenaHidroelectrica } from './EscenasEnergia2.tsx'
import { EscenaViajeBasura, EscenaCompostaje } from './EscenasResiduos.tsx'
import { EscenaMateriaZoom, EscenaCafeQuimica } from './EscenasQueEsQuimica.tsx'
import { EscenaMedirMateria, EscenaColumnaDensidad, EscenaHervirAltura } from './EscenasPropiedades.tsx'
import { EscenaCicloEstados, EscenaCurvaCalentamiento } from './EscenasEstados.tsx'
import { EscenaPapelCambios, EscenaSenalesQuimicas, EscenaMacheteOxido } from './EscenasCambios.tsx'
import { EscenaParticulasClasificacion } from './EscenasClasificacion.tsx'
import { EscenaSepararMezclas } from './EscenasSeparacion.tsx'
import { EscenaDescubrimiento, EscenaTiposRadiacion, EscenaFision } from './EscenasRadiactividad.tsx'
import { EscenaOxIdea, EscenaOxTabla, EscenaOxCalculo, EscenaOxIon } from './EscenasOxidacion.tsx'
import { EscenaNomMapa, EscenaNomCruce, EscenaNomHidroxido } from './EscenasNomenclatura.tsx'
import { EscenaHidracido, EscenaOxacido, EscenaAniones, EscenaSal } from './EscenasAcidosSales.tsx'
import { EscenaEcuacion, EscenaTiposReaccion, EscenaCombustion } from './EscenasReacciones.tsx'
import { EscenaConservacion, EscenaTanteo, EscenaRedox } from './EscenasBalanceo.tsx'
import { EscenaLavoisier, EscenaProust, EscenaDalton as EscenaDaltonLeyes } from './EscenasLeyes.tsx'
import { EscenaGasParticulas, EscenaGasVariables, EscenaKelvin, EscenaTorricelli, EscenaPresionAltura } from './EscenasGases.tsx'
import { EscenaBoyle, EscenaCharles, EscenaGayLussac, EscenaAvogadro, EscenaDaltonGraham } from './EscenasLeyesGases.tsx'
import { EscenaAguaPuentes, EscenaTensionSuperficial, EscenaCalorEspecifico, EscenaHieloFlota, EscenaPresionVapor, EscenaSolidos } from './EscenasAgua2.tsx'
import { EscenaDisolver, EscenaSaturacion, EscenaFactoresSolubilidad, EscenaCurvasSolubilidad, EscenaTiposMezcla } from './EscenasSoluciones.tsx'
import { EscenaConcentracionColor, EscenaPpm, EscenaPrepararMolar, EscenaDilucion } from './EscenasConcentracion.tsx'
import { EscenaVelocidadReaccion, EscenaFactoresVelocidad, EscenaColisiones, EscenaEnergiaActivacion, EscenaConservarAlimentos } from './EscenasCinetica.tsx'
import { EscenaIdaVuelta, EscenaEquilibrioDinamico, EscenaLeChatelier, EscenaEquilibrioNaturaleza } from './EscenasEquilibrio.tsx'
import { EscenaAcidoBase, EscenaRepolloIndicador, EscenaSueloPh, EscenaFuerteDebil, EscenaTitulacion } from './EscenasAcidosBases.tsx'
import { EscenaRaoult, EscenaEbullicionCongelacion, EscenaOsmosisU } from './EscenasColigativas.tsx'
import { EscenaMolContar, EscenaMasaMolar, EscenaCaminoMol } from './EscenasMol.tsx'
import { EscenaReceta, EscenaMasaMasa, EscenaLimite } from './EscenasEstequiometria.tsx'
import { EscenaIntra, EscenaPolaridad, EscenaFuerzas, EscenaSoluble } from './EscenasFuerzas.tsx'
import { EscenaOcteto, EscenaIonico, EscenaCovalente, EscenaEnlaceMetalico } from './EscenasEnlace.tsx'
import { EscenaHistoriaTabla, EscenaEstructuraTabla, EscenaMetales, EscenaRadio, EscenaIonizacion, EscenaElectronegatividad, EscenaCaracterMetalico } from './EscenasTabla.tsx'
import { EscenaDemocrito, EscenaDalton, EscenaThomson, EscenaRutherford, EscenaBohr, EscenaNube, EscenaChadwick, EscenaParticulas, EscenaNumeros, EscenaIones, EscenaIsotopos, EscenaNivelesE, EscenaMoeller, EscenaCajas, EscenaCuanticos } from './EscenasAtomo.tsx'
import { EscenaRiesgo, EscenaArmero, EscenaEvacuacion } from './EscenasRiesgo.tsx'
import { EscenaProyectoAula } from './EscenasSostenibilidad.tsx'
import { EscenaCicloAgua, EscenaCicloCarbono, EscenaCicloNitrogeno, EscenaCicloFosforo } from './EscenasCiclos.tsx'

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
  'ev-adaptacion': EscenaAdaptacion,
  'ev-frailejon': EscenaFrailejon,
  'ev-cactus': EscenaCactus,
  'ev-migracion': EscenaMigracion,
  'ev-mimetismo': EscenaMimetismo,
  'ev-acervo': EscenaAcervo,
  'ev-deriva': EscenaDeriva,
  'ev-flujo': EscenaFlujo,
  'ev-sexual': EscenaSexual,
  'ev-especie': EscenaEspecie,
  'ev-alopatrica': EscenaAlopatrica,
  'ev-poliploidia': EscenaPoliploidia,
  'ev-radiacion': EscenaRadiacion,
  'ev-categorias': EscenaCategorias,
  'ev-dominios': EscenaDominios,
  'ev-cladograma': EscenaCladograma,
  'ev-arbol-vida': EscenaArbolVida,
  'ev-oxigeno': EscenaOxigeno,
  'ev-tierra-firme': EscenaTierraFirme,
  'ev-extinciones': EscenaExtinciones,
  'ev-fosiles-colombia': EscenaFosilesColombia,
  'ev-homininos': EscenaHomininos,
  'ciclo-agua': EscenaCicloAgua,
  'ciclo-carbono': EscenaCicloCarbono,
  'ciclo-nitrogeno': EscenaCicloNitrogeno,
  'ciclo-fosforo': EscenaCicloFosforo,
  'agua-planeta': EscenaAguaPlaneta,
  cuenca: EscenaCuenca,
  'paramo-esponja': EscenaParamoEsponja,
  'formacion-suelo': EscenaFormacionSuelo,
  erosion: EscenaErosion,
  deforestacion: EscenaDeforestacion,
  invernadero: EscenaInvernadero,
  glaciares: EscenaGlaciares,
  enos: EscenaEnos,
  'aire-contaminado': EscenaAireContaminado,
  biomagnificacion: EscenaBiomagnificacion,
  eutrofizacion: EscenaEutrofizacion,
  hidroelectrica: EscenaHidroelectrica,
  'viaje-basura': EscenaViajeBasura,
  'materia-zoom': EscenaMateriaZoom,
  'cafe-quimica': EscenaCafeQuimica,
  'medir-materia': EscenaMedirMateria,
  'columna-densidad': EscenaColumnaDensidad,
  'hervir-altura': EscenaHervirAltura,
  'ciclo-estados': EscenaCicloEstados,
  'curva-calentamiento': EscenaCurvaCalentamiento,
  'papel-cambios': EscenaPapelCambios,
  'senales-quimicas': EscenaSenalesQuimicas,
  'machete-oxido': EscenaMacheteOxido,
  'particulas-clasificacion': EscenaParticulasClasificacion,
  'separar-mezclas': EscenaSepararMezclas,
  'at-democrito': EscenaDemocrito,
  'at-dalton': EscenaDalton,
  'at-thomson': EscenaThomson,
  'at-rutherford': EscenaRutherford,
  'at-bohr': EscenaBohr,
  'at-nube': EscenaNube,
  'at-chadwick': EscenaChadwick,
  'at-particulas': EscenaParticulas,
  'at-numeros': EscenaNumeros,
  'at-iones': EscenaIones,
  'at-isotopos': EscenaIsotopos,
  'at-niveles': EscenaNivelesE,
  'at-moeller': EscenaMoeller,
  'at-cajas': EscenaCajas,
  'at-cuanticos': EscenaCuanticos,
  'tp-historia': EscenaHistoriaTabla,
  'tp-estructura': EscenaEstructuraTabla,
  'tp-metales': EscenaMetales,
  'pp-radio': EscenaRadio,
  'pp-ionizacion': EscenaIonizacion,
  'pp-electronegatividad': EscenaElectronegatividad,
  'pp-metalico': EscenaCaracterMetalico,
  'en-octeto': EscenaOcteto,
  'en-ionico': EscenaIonico,
  'en-covalente': EscenaCovalente,
  'en-metalico': EscenaEnlaceMetalico,
  'fi-intra': EscenaIntra,
  'fi-polaridad': EscenaPolaridad,
  'fi-fuerzas': EscenaFuerzas,
  'fi-soluble': EscenaSoluble,
  'ra-descubrimiento': EscenaDescubrimiento,
  'ra-tipos': EscenaTiposRadiacion,
  'ra-fision': EscenaFision,
  'ox-idea': EscenaOxIdea,
  'ox-tabla': EscenaOxTabla,
  'ox-calculo': EscenaOxCalculo,
  'ox-ion': EscenaOxIon,
  'nom-mapa': EscenaNomMapa,
  'nom-cruce': EscenaNomCruce,
  'nom-hidroxido': EscenaNomHidroxido,
  'ac-hidracido': EscenaHidracido,
  'ac-oxacido': EscenaOxacido,
  'ac-aniones': EscenaAniones,
  'ac-sal': EscenaSal,
  're-ecuacion': EscenaEcuacion,
  're-tipos': EscenaTiposReaccion,
  're-combustion': EscenaCombustion,
  'ba-conservacion': EscenaConservacion,
  'ba-tanteo': EscenaTanteo,
  'ba-redox': EscenaRedox,
  'lp-lavoisier': EscenaLavoisier,
  'lp-proust': EscenaProust,
  'lp-dalton': EscenaDaltonLeyes,
  'mol-contar': EscenaMolContar,
  'mol-masa-molar': EscenaMasaMolar,
  'mol-camino': EscenaCaminoMol,
  'es-receta': EscenaReceta,
  'es-masa': EscenaMasaMasa,
  'es-limite': EscenaLimite,
  'gas-particulas': EscenaGasParticulas,
  'gas-variables': EscenaGasVariables,
  kelvin: EscenaKelvin,
  torricelli: EscenaTorricelli,
  'presion-altura': EscenaPresionAltura,
  'ley-boyle': EscenaBoyle,
  'ley-charles': EscenaCharles,
  'ley-gay-lussac': EscenaGayLussac,
  'ley-avogadro': EscenaAvogadro,
  'dalton-graham': EscenaDaltonGraham,
  'agua-puentes': EscenaAguaPuentes,
  'tension-superficial': EscenaTensionSuperficial,
  'calor-especifico': EscenaCalorEspecifico,
  'hielo-flota': EscenaHieloFlota,
  'presion-vapor': EscenaPresionVapor,
  solidos: EscenaSolidos,
  disolver: EscenaDisolver,
  saturacion: EscenaSaturacion,
  'factores-solubilidad': EscenaFactoresSolubilidad,
  'curvas-solubilidad': EscenaCurvasSolubilidad,
  'tipos-mezcla': EscenaTiposMezcla,
  'concentracion-color': EscenaConcentracionColor,
  'ppm-piscina': EscenaPpm,
  'preparar-molar': EscenaPrepararMolar,
  dilucion: EscenaDilucion,
  'velocidad-reaccion': EscenaVelocidadReaccion,
  'factores-velocidad': EscenaFactoresVelocidad,
  colisiones: EscenaColisiones,
  'energia-activacion': EscenaEnergiaActivacion,
  'conservar-alimentos': EscenaConservarAlimentos,
  'ida-vuelta': EscenaIdaVuelta,
  'equilibrio-dinamico': EscenaEquilibrioDinamico,
  'le-chatelier': EscenaLeChatelier,
  'equilibrio-naturaleza': EscenaEquilibrioNaturaleza,
  'acido-base': EscenaAcidoBase,
  'repollo-indicador': EscenaRepolloIndicador,
  'suelo-ph': EscenaSueloPh,
  'fuerte-debil': EscenaFuerteDebil,
  titulacion: EscenaTitulacion,
  raoult: EscenaRaoult,
  'ebullicion-congelacion': EscenaEbullicionCongelacion,
  'osmosis-u': EscenaOsmosisU,
  compostaje: EscenaCompostaje,
  riesgo: EscenaRiesgo,
  armero: EscenaArmero,
  evacuacion: EscenaEvacuacion,
  'proyecto-aula': EscenaProyectoAula,
}
