// Mesa libre (PLAN-LABORATORIOS.md, Fase 1): estante de reactivos y catálogo de reacciones.
// El estante está abierto desde el inicio y reúne los reactivos de las prácticas de química.
// Una mezcla se evalúa con `evaluar`: aplica cada reacción del catálogo cuyos ingredientes estén todos en el recipiente
// (y su condición de calor, si la pide) y el color de los indicadores según el pH aproximado de la mezcla.
// Si nada del catálogo aplica y hay dos o más cosas, «no hay reacción visible» y la mezcla queda pendiente para que el
// docente la defina (panel del docente). Valores escolares aproximados: revisar.

export type Efecto = 'burbujas' | 'precipitado' | 'color' | 'calor' | 'frio' | 'espuma' | 'llama' | 'capas' | 'humo' | 'disuelve'

export interface Reactivo {
  id: string
  n: string
  /** cómo se echa: líquido (verter), sólido (polvo), gotas (indicadores), objeto (metal, etc.) */
  forma: 'liquido' | 'solido' | 'gotas' | 'objeto'
  color: string
  /** pH aproximado y fuerza ácida (−) o básica (+) por porción, para los indicadores */
  pH?: number
  fuerza?: number
  /** grado desde el que aparece en el estante */
  desde: number
  /** práctica de la que viene */
  de: string
  /** solo simulación: en la vida real es peligroso */
  peligro?: string
}

export const REACTIVOS: Reactivo[] = [
  { id: 'agua', n: 'Agua', forma: 'liquido', color: '#a9d3f5', pH: 7, desde: 6, de: 'todas' },
  { id: 'vinagre', n: 'Vinagre', forma: 'liquido', color: '#efe7c4', pH: 3, fuerza: -2, desde: 6, de: 'Conservación de la masa' },
  { id: 'limon', n: 'Jugo de limón', forma: 'liquido', color: '#f3ec9a', pH: 2.5, fuerza: -2, desde: 6, de: 'Ácidos y bases' },
  { id: 'hcl', n: 'Ácido clorhídrico diluido', forma: 'liquido', color: '#f1f6f8', pH: 1, fuerza: -5, desde: 9, de: 'Titulación', peligro: 'Ácido corrosivo: gafas y guantes.' },
  { id: 'naoh', n: 'Hidróxido de sodio diluido', forma: 'liquido', color: '#f4f7f9', pH: 13, fuerza: 5, desde: 9, de: 'Titulación', peligro: 'Base corrosiva (soda cáustica): gafas y guantes.' },
  { id: 'aguacal', n: 'Agua de cal', forma: 'liquido', color: '#f5f7f2', pH: 12.4, fuerza: 2, desde: 6, de: 'Fermentación' },
  { id: 'amoniaco', n: 'Limpiador con amoníaco', forma: 'liquido', color: '#eaf3f0', pH: 11.5, fuerza: 1.5, desde: 9, de: 'Ácidos y bases' },
  { id: 'blanqueador', n: 'Blanqueador (hipoclorito)', forma: 'liquido', color: '#f4fbe9', pH: 12, fuerza: 1, desde: 6, de: 'Potabilización' },
  { id: 'h2o2', n: 'Agua oxigenada', forma: 'liquido', color: '#f3f8fb', pH: 6, desde: 6, de: 'Enzimas' },
  { id: 'alcohol', n: 'Alcohol antiséptico', forma: 'liquido', color: '#f7fbff', pH: 7, desde: 6, de: 'Mezclas' },
  { id: 'aceite', n: 'Aceite de cocina', forma: 'liquido', color: '#e9c94a', desde: 6, de: 'Densidades' },
  { id: 'leche', n: 'Leche', forma: 'liquido', color: '#fbfaf3', pH: 6.7, desde: 6, de: 'Biomoléculas' },
  { id: 'jabon', n: 'Jabón líquido', forma: 'liquido', color: '#bfe3d0', pH: 10, fuerza: 0.5, desde: 6, de: 'Saponificación' },
  { id: 'cuso4', n: 'Sulfato de cobre (solución)', forma: 'liquido', color: '#3d8fd6', pH: 4, desde: 9, de: 'Solución 0,5 M', peligro: 'Tóxico: no va al desagüe.' },
  { id: 'bicarbonato', n: 'Bicarbonato de sodio', forma: 'solido', color: '#ffffff', pH: 8.3, fuerza: 1.5, desde: 6, de: 'Conservación de la masa' },
  { id: 'sal', n: 'Sal de cocina', forma: 'solido', color: '#ffffff', pH: 7, desde: 6, de: 'Mezclas' },
  { id: 'azucar', n: 'Azúcar', forma: 'solido', color: '#fffaf0', pH: 7, desde: 6, de: 'Cristalización' },
  { id: 'fecula', n: 'Fécula de maíz (almidón)', forma: 'solido', color: '#fffdf4', desde: 6, de: 'Polímeros' },
  { id: 'levadura', n: 'Levadura', forma: 'solido', color: '#d8b98a', desde: 6, de: 'Fermentación' },
  { id: 'cacl2', n: 'Cloruro de calcio', forma: 'solido', color: '#ffffff', pH: 7, desde: 6, de: 'Reacciones que calientan o enfrían' },
  { id: 'cal', n: 'Cal viva (óxido de calcio)', forma: 'solido', color: '#efeee6', pH: 12.4, fuerza: 2, desde: 6, de: 'Reacciones que calientan o enfrían', peligro: 'Se calienta mucho con agua y quema la piel.' },
  { id: 'urea', n: 'Urea', forma: 'solido', color: '#f7f7f2', pH: 7, desde: 6, de: 'Reacciones que calientan o enfrían' },
  { id: 'alumbre', n: 'Alumbre', forma: 'solido', color: '#eef6ff', pH: 3.5, fuerza: -0.5, desde: 6, de: 'Potabilización' },
  { id: 'magnesia', n: 'Leche de magnesia', forma: 'liquido', color: '#f4f4f0', pH: 10, fuerza: 2, desde: 9, de: 'Antiácidos' },
  { id: 'hierro', n: 'Clavo de hierro', forma: 'objeto', color: '#6b6b6b', desde: 6, de: 'Corrosión' },
  { id: 'zinc', n: 'Granalla de zinc', forma: 'objeto', color: '#a9b4bd', desde: 9, de: 'Pila de limones' },
  { id: 'cobre', n: 'Alambre de cobre', forma: 'objeto', color: '#c8742f', desde: 6, de: 'Pila de limones' },
  { id: 'repollo', n: 'Indicador de repollo morado', forma: 'gotas', color: '#6a2c91', desde: 6, de: 'Ácidos y bases' },
  { id: 'fenolftaleina', n: 'Fenolftaleína', forma: 'gotas', color: '#f7f7f7', desde: 9, de: 'Titulación' },
  { id: 'universal', n: 'Indicador universal', forma: 'gotas', color: '#7fb04a', desde: 9, de: 'Antiácidos' },
  { id: 'lugol', n: 'Lugol (yodo)', forma: 'gotas', color: '#9a5a1a', desde: 6, de: 'Biomoléculas' },
]

export interface Reaccion {
  id: string
  /** ingredientes (ids del estante) que deben estar todos en el recipiente */
  con: string[]
  /** necesita calor (mechero o estufa) */
  calor?: boolean
  nombre: string
  efectos: Efecto[]
  /** color final del líquido, si cambia */
  colorFinal?: string
  /** color del precipitado o de las capas */
  colorSolido?: string
  /** explicación por grado: [6°, 9°, 11°]; si falta una, se usa la anterior */
  texto: [string, string?, string?]
  /** ecuación (se muestra desde 9°) */
  ecuacion?: string
  /** aviso: en la vida real es peligroso, solo se simula */
  peligro?: string
  /** grado desde el que se muestra (por defecto el del reactivo más alto) */
  desde?: number
}

export const REACCIONES: Reaccion[] = [
  // ── gases ──
  { id: 'vinagre-bicarbonato', con: ['vinagre', 'bicarbonato'], nombre: 'Volcán de vinagre y bicarbonato', efectos: ['burbujas', 'espuma', 'frio'], texto: ['El ácido del vinagre y el bicarbonato reaccionan y sueltan un gas: dióxido de carbono (CO₂).', 'Reacción ácido–base que produce un gas; además absorbe un poco de calor (endotérmica).', 'El H⁺ del ácido acético protona al HCO₃⁻: se forma H₂CO₃, que se descompone en H₂O y CO₂.'], ecuacion: 'NaHCO₃ + CH₃COOH → CH₃COONa + H₂O + CO₂↑' },
  { id: 'limon-bicarbonato', con: ['limon', 'bicarbonato'], nombre: 'Limón con bicarbonato', efectos: ['burbujas'], texto: ['El ácido del limón también suelta CO₂ con el bicarbonato: así funcionan las sales efervescentes.', 'El ácido cítrico neutraliza el bicarbonato y libera CO₂.'], ecuacion: 'C₆H₈O₇ + 3NaHCO₃ → Na₃C₆H₅O₇ + 3H₂O + 3CO₂↑' },
  { id: 'hcl-bicarbonato', con: ['hcl', 'bicarbonato'], nombre: 'Ácido clorhídrico y bicarbonato', efectos: ['burbujas', 'espuma'], texto: ['Mucho gas, rápido: el ácido es fuerte.', 'Así neutraliza el bicarbonato el ácido del estómago.'], ecuacion: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂↑' },
  { id: 'hcl-zinc', con: ['hcl', 'zinc'], nombre: 'Zinc en ácido', efectos: ['burbujas', 'calor'], texto: ['El zinc se va gastando y salen burbujas de hidrógeno, un gas que arde.', 'Metal activo + ácido → sal + hidrógeno. El zinc se oxida.', 'Redox: Zn → Zn²⁺ + 2e⁻ y 2H⁺ + 2e⁻ → H₂. El zinc está por encima del hidrógeno en la serie de actividad.'], ecuacion: 'Zn + 2HCl → ZnCl₂ + H₂↑', peligro: 'El hidrógeno es inflamable: nada de llamas cerca.' },
  { id: 'hcl-hierro', con: ['hcl', 'hierro'], nombre: 'Clavo en ácido', efectos: ['burbujas'], colorFinal: '#dfe9c8', texto: ['El clavo suelta burbujitas lentas y el líquido se pone verdoso.', 'El hierro reacciona con el ácido y forma cloruro de hierro(II), verde pálido, e hidrógeno.'], ecuacion: 'Fe + 2HCl → FeCl₂ + H₂↑' },
  { id: 'vinagre-hierro', con: ['vinagre', 'hierro'], nombre: 'Clavo en vinagre', efectos: ['burbujas'], texto: ['Burbujas muy lentas: el vinagre ataca el hierro poco a poco (por eso oxida rápido los clavos).', 'Ácido débil: la reacción con el hierro es lenta.'] },
  { id: 'h2o2-levadura', con: ['h2o2', 'levadura'], nombre: 'Agua oxigenada y levadura', efectos: ['burbujas', 'espuma', 'calor'], texto: ['La levadura descompone el agua oxigenada y sale oxígeno: mucha espuma y se calienta.', 'La enzima catalasa de la levadura acelera la descomposición del H₂O₂ en agua y oxígeno.', 'La catalasa es un catalizador biológico: baja la energía de activación sin gastarse.'], ecuacion: '2H₂O₂ → 2H₂O + O₂↑' },
  { id: 'pasta-elefante', con: ['h2o2', 'levadura', 'jabon'], nombre: 'Pasta de dientes de elefante', efectos: ['espuma', 'calor'], texto: ['¡Una columna de espuma! El jabón atrapa el oxígeno en millones de burbujas.', 'El oxígeno de la descomposición del H₂O₂ queda atrapado por el jabón.'], ecuacion: '2H₂O₂ → 2H₂O + O₂↑' },
  { id: 'bicarbonato-calor', con: ['bicarbonato'], calor: true, nombre: 'Bicarbonato al fuego', efectos: ['burbujas'], texto: ['Al calentarlo suelta CO₂: por eso el bicarbonato hace crecer las tortas.', 'Descomposición térmica del bicarbonato.'], ecuacion: '2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑' },
  // ── precipitados ──
  { id: 'cuso4-naoh', con: ['cuso4', 'naoh'], nombre: 'Hidróxido de cobre', efectos: ['precipitado'], colorFinal: '#e8f1f8', colorSolido: '#3a7fcf', texto: ['Aparece un sólido azul que cae al fondo: un precipitado.', 'Doble desplazamiento: el cobre y el hidróxido forman Cu(OH)₂, que no se disuelve.', 'Reacción de precipitación; el Cu(OH)₂ tiene muy baja solubilidad (Kps pequeño).'], ecuacion: 'CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄' },
  { id: 'cuso4-aguacal', con: ['cuso4', 'aguacal'], nombre: 'Cobre y agua de cal', efectos: ['precipitado'], colorSolido: '#5a92d6', texto: ['Se forma un sólido azul claro.', 'El hidróxido del agua de cal precipita el cobre como Cu(OH)₂.'], ecuacion: 'CuSO₄ + Ca(OH)₂ → Cu(OH)₂↓ + CaSO₄' },
  { id: 'cacl2-bicarbonato', con: ['cacl2', 'bicarbonato', 'agua'], nombre: 'Cloruro de calcio y bicarbonato', efectos: ['precipitado', 'burbujas'], colorSolido: '#ffffff', texto: ['Se pone blanco lechoso y salen burbujas.', 'Se forma carbonato de calcio (el de la tiza) que no se disuelve, y CO₂.'], ecuacion: 'CaCl₂ + 2NaHCO₃ → CaCO₃↓ + 2NaCl + H₂O + CO₂↑' },
  { id: 'aguacal-bicarbonato', con: ['aguacal', 'bicarbonato'], nombre: 'Agua de cal y bicarbonato', efectos: ['precipitado'], colorSolido: '#ffffff', texto: ['El agua de cal se enturbia: se forma carbonato de calcio.', 'El carbonato precipita con el calcio: así se reconoce el CO₂ con agua de cal.'], ecuacion: 'Ca(OH)₂ + NaHCO₃ → CaCO₃↓ + NaOH + H₂O' },
  { id: 'alumbre-aguacal', con: ['alumbre', 'aguacal'], nombre: 'Alumbre y agua de cal', efectos: ['precipitado'], colorSolido: '#f3f6f9', texto: ['Se forman grumos blancos gelatinosos que caen: así se limpia el agua en las plantas de tratamiento.', 'Se forma hidróxido de aluminio, que atrapa la suciedad (floculación).'], ecuacion: '2Al³⁺ + 3Ca(OH)₂ → 2Al(OH)₃↓ + 3Ca²⁺' },
  { id: 'leche-vinagre', con: ['leche', 'vinagre'], nombre: 'Leche cortada', efectos: ['precipitado'], colorSolido: '#fffef6', colorFinal: '#f2f0d6', texto: ['La leche se corta: aparecen grumos blancos (cuajada). Así se hace el queso campesino.', 'El ácido hace que la proteína de la leche (caseína) se desnaturalice y se agrupe.'] },
  { id: 'leche-limon', con: ['leche', 'limon'], nombre: 'Leche con limón', efectos: ['precipitado'], colorSolido: '#fffef6', texto: ['También corta la leche: el ácido junta la proteína en grumos.'] },
  // ── metales ──
  { id: 'cuso4-hierro', con: ['cuso4', 'hierro'], nombre: 'Clavo cobreado', efectos: ['color'], colorFinal: '#9ccbb0', texto: ['El clavo se cubre de una capa rojiza de cobre y el azul se va aclarando.', 'Desplazamiento simple: el hierro, más activo, desplaza al cobre de su sal.', 'Redox: Fe → Fe²⁺ + 2e⁻ y Cu²⁺ + 2e⁻ → Cu.'], ecuacion: 'Fe + CuSO₄ → FeSO₄ + Cu' },
  { id: 'cuso4-zinc', con: ['cuso4', 'zinc'], nombre: 'Zinc en sulfato de cobre', efectos: ['color', 'calor'], colorFinal: '#e9f0f4', texto: ['El zinc se pone negro-rojizo y el azul desaparece: el cobre salió de la solución.', 'El zinc desplaza al cobre; es la reacción de la pila de Daniell.'], ecuacion: 'Zn + CuSO₄ → ZnSO₄ + Cu' },
  { id: 'cuso4-cobre', con: ['cuso4', 'cobre'], nombre: 'Cobre en sulfato de cobre', efectos: [], texto: ['No pasa nada: el cobre no puede desplazarse a sí mismo.'] },
  { id: 'cuso4-amoniaco', con: ['cuso4', 'amoniaco'], nombre: 'Azul intenso del cobre', efectos: ['color', 'precipitado'], colorFinal: '#1f3fae', texto: ['Primero un poco de sólido azul y luego un azul oscuro muy intenso.', 'El amoníaco forma con el cobre un ion complejo azul intenso.', 'Complejo [Cu(NH₃)₄]²⁺: el amoníaco actúa como ligando.'], desde: 9 },
  // ── calor y frío ──
  { id: 'hcl-naoh', con: ['hcl', 'naoh'], nombre: 'Neutralización', efectos: ['calor'], texto: ['No se ve nada, pero se calienta: el ácido y la base se neutralizan y queda agua salada.', 'Ácido + base → sal + agua; es exotérmica.', 'H⁺ + OH⁻ → H₂O, ΔH ≈ −57 kJ/mol.'], ecuacion: 'HCl + NaOH → NaCl + H₂O' },
  { id: 'cal-agua', con: ['cal', 'agua'], nombre: 'Apagar la cal', efectos: ['calor', 'humo'], colorFinal: '#f2f2ec', texto: ['¡Se calienta muchísimo y hasta echa vapor! Así se apaga la cal para construir.', 'Reacción de síntesis muy exotérmica: óxido + agua → hidróxido.'], ecuacion: 'CaO + H₂O → Ca(OH)₂', peligro: 'Quema la piel y salpica: solo simulación.' },
  { id: 'cacl2-agua', con: ['cacl2', 'agua'], nombre: 'Cloruro de calcio en agua', efectos: ['calor', 'disuelve'], texto: ['Se disuelve y el agua se calienta: compresa caliente.', 'Disolución exotérmica.'] },
  { id: 'urea-agua', con: ['urea', 'agua'], nombre: 'Urea en agua', efectos: ['frio', 'disuelve'], texto: ['Se disuelve y el agua se enfría: compresa fría.', 'Disolución endotérmica.'] },
  // ── disoluciones y mezclas ──
  { id: 'sal-agua', con: ['sal', 'agua'], nombre: 'Agua con sal', efectos: ['disuelve'], texto: ['La sal se disuelve: es una mezcla homogénea, no una reacción.'] },
  { id: 'azucar-agua', con: ['azucar', 'agua'], nombre: 'Agua con azúcar', efectos: ['disuelve'], texto: ['El azúcar se disuelve: mezcla homogénea.'] },
  { id: 'cuso4-agua', con: ['cuso4', 'agua'], nombre: 'Sulfato de cobre diluido', efectos: ['color'], colorFinal: '#8ec0ea', texto: ['El azul se aclara: está más diluido.'] },
  { id: 'aceite-agua', con: ['aceite', 'agua'], nombre: 'Agua y aceite', efectos: ['capas'], colorSolido: '#e9c94a', texto: ['No se mezclan: el aceite flota encima porque es menos denso.', 'El aceite es apolar y el agua polar: no se disuelven entre sí.'] },
  { id: 'emulsion', con: ['aceite', 'agua', 'jabon'], nombre: 'Emulsión', efectos: ['color', 'espuma'], colorFinal: '#f1e6a8', texto: ['Con jabón el aceite se rompe en gotitas y queda turbio: así lava el jabón la grasa.', 'El jabón tiene una parte que ama el agua y otra que ama la grasa: forma micelas.'] },
  { id: 'jabon-agua', con: ['jabon', 'agua'], nombre: 'Agua jabonosa', efectos: ['espuma'], texto: ['Hace espuma al agitarla.'] },
  { id: 'alcohol-agua', con: ['alcohol', 'agua'], nombre: 'Alcohol con agua', efectos: ['disuelve'], texto: ['Se mezclan del todo: no se pueden separar con un embudo, hay que destilar.'] },
  // ── pruebas de alimentos ──
  { id: 'fecula-lugol', con: ['fecula', 'lugol'], nombre: 'Prueba del almidón', efectos: ['color'], colorFinal: '#1d1b3a', texto: ['¡Azul casi negro! El lugol reconoce el almidón.', 'El yodo entra en la hélice de la amilosa y da el color azul-negro.'] },
  // ── combustión y calor ──
  { id: 'alcohol-llama', con: ['alcohol'], calor: true, nombre: 'Alcohol que arde', efectos: ['llama'], texto: ['Arde con una llama azul casi invisible.', 'Combustión completa: se forma CO₂ y agua.'], ecuacion: 'C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O', peligro: 'El alcohol arde con llama casi invisible: nunca cerca del fuego.' },
  { id: 'azucar-calor', con: ['azucar'], calor: true, nombre: 'Caramelo', efectos: ['color', 'humo'], colorFinal: '#8a4a12', texto: ['El azúcar se derrite y se vuelve caramelo café: es un cambio químico.', 'La sacarosa se descompone (caramelización) y pierde agua.'] },
  { id: 'cuso4-calor', con: ['cuso4'], calor: true, nombre: 'Cobre que pierde agua', efectos: ['color', 'humo'], colorFinal: '#f2f2f2', texto: ['El azul se vuelve blanco al calentarlo.', 'El sulfato de cobre pierde su agua de hidratación.', 'CuSO₄·5H₂O → CuSO₄ + 5H₂O: el color depende del agua unida al cobre.'], desde: 9 },
  { id: 'naoh-aceite', con: ['naoh', 'aceite'], calor: true, nombre: 'Saponificación', efectos: ['espuma', 'color'], colorFinal: '#f3e7b8', texto: ['Con calor, la soda y el aceite se vuelven jabón.', 'Saponificación: grasa + base → jabón + glicerina.'], peligro: 'La soda cáustica quema: solo simulación.' },
  // ── peligrosas: solo simulación ──
  { id: 'blanqueador-amoniaco', con: ['blanqueador', 'amoniaco'], nombre: '¡Mezcla peligrosa!', efectos: ['humo'], texto: ['¡Nunca se hace! Suelta gases tóxicos (cloraminas) que dañan los pulmones. Por eso la etiqueta dice «no mezclar».'], peligro: 'Gases tóxicos: solo simulación. Nunca mezcles limpiadores.' },
  { id: 'blanqueador-vinagre', con: ['blanqueador', 'vinagre'], nombre: '¡Mezcla peligrosa!', efectos: ['humo', 'burbujas'], texto: ['¡Nunca se hace! El ácido libera cloro gaseoso, tóxico.'], ecuacion: 'NaClO + 2CH₃COOH → Cl₂↑ + …', peligro: 'Gas cloro: solo simulación.' },
  { id: 'blanqueador-hcl', con: ['blanqueador', 'hcl'], nombre: '¡Mezcla peligrosa!', efectos: ['humo', 'burbujas'], texto: ['¡Nunca se hace! Se libera gas cloro, muy tóxico.'], ecuacion: 'NaClO + 2HCl → NaCl + Cl₂↑ + H₂O', peligro: 'Gas cloro: solo simulación.' },
]

/** clave de una mezcla: ingredientes sin repetir, ordenados */
export const clave = (ids: string[], calor = false) => [...new Set(ids)].sort().join('+') + (calor ? '+🔥' : '')

/** pH aproximado de una mezcla (para los indicadores) */
export function pHMezcla(ids: string[]): number {
  const rs = ids.map((id) => REACTIVOS.find((r) => r.id === id)).filter(Boolean) as Reactivo[]
  const neto = rs.reduce((a, r) => a + (r.fuerza ?? 0), 0)
  if (Math.abs(neto) < 0.3) return 7
  const lado = rs.filter((r) => (neto < 0 ? (r.fuerza ?? 0) < 0 : (r.fuerza ?? 0) > 0))
  const extremo = neto < 0 ? Math.min(...lado.map((r) => r.pH ?? 7)) : Math.max(...lado.map((r) => r.pH ?? 7))
  const k = Math.min(1, Math.abs(neto) / 2)
  return 7 + (extremo - 7) * k
}

const REPOLLO: [number, string, string][] = [[2, '#d6204a', 'rojo'], [4, '#e04f8a', 'rosado'], [6, '#a8509c', 'morado rojizo'], [7.4, '#7a4fa0', 'morado'], [8.8, '#3f63c4', 'azul'], [10.5, '#2a9a8a', 'verde azulado'], [12.2, '#3fb54a', 'verde'], [14, '#d9c43a', 'amarillo']]
const UNIV = ['#d42a2a', '#e8502a', '#f0862c', '#f5b22e', '#f2d83a', '#c9d93a', '#8fca3c', '#4fb04a', '#2f9a7a', '#2a7fb0', '#2a5cb5', '#3a3fa8', '#5a2f9a', '#6a2580']

/** color y nombre que da un indicador a cierto pH */
export function indicador(id: string, pH: number): { c: string; t: string } | null {
  if (id === 'repollo') { const r = REPOLLO.find(([m]) => pH <= m) ?? REPOLLO[REPOLLO.length - 1]; return { c: r[1], t: r[2] } }
  if (id === 'fenolftaleina') return pH >= 8.2 ? { c: '#e0409a', t: 'rosado fucsia' } : { c: 'transparent', t: 'incolora' }
  if (id === 'universal') return { c: UNIV[Math.max(0, Math.min(13, Math.round(pH) - 1))], t: `pH ≈ ${Math.round(pH)}` }
  return null
}

export interface Resultado {
  reacciones: Reaccion[]
  pH: number
  indicadores: { id: string; c: string; t: string }[]
  /** no hay nada del catálogo y hay al menos dos cosas: queda pendiente */
  nada: boolean
}

/** evalúa lo que hay en un recipiente */
export function evaluar(ids: string[], calor = false, grado = 11): Resultado {
  const set = new Set(ids)
  const reacciones = REACCIONES.filter((r) => r.con.every((i) => set.has(i)) && (!r.calor || calor) && (r.desde ?? 6) <= grado)
  // si una reacción contiene a otra (p. ej. emulsión ⊃ agua y aceite), se queda la más completa
  const finales = reacciones.filter((r) => !reacciones.some((o) => o !== r && o.con.length > r.con.length && r.con.every((i) => o.con.includes(i)) && !!o.calor === !!r.calor))
  const pH = pHMezcla(ids)
  const indicadores = ['repollo', 'fenolftaleina', 'universal'].filter((i) => set.has(i)).map((i) => ({ id: i, ...indicador(i, pH)! }))
  const sinAgua = [...set].filter((i) => i !== 'agua')
  const nada = finales.length === 0 && indicadores.length === 0 && (set.size >= 2 || calor) && sinAgua.length > 0
  return { reacciones: finales, pH, indicadores, nada }
}

// ── mezclas pendientes (en el dispositivo) ──
export interface Pendiente { clave: string; ids: string[]; calor: boolean; veces: number; fecha: string }
const LLAVE = '100cias-mesa-libre-pendientes'

export function leerPendientes(): Pendiente[] {
  try { return JSON.parse(localStorage.getItem(LLAVE) ?? '[]') as Pendiente[] } catch { return [] }
}
export function guardarPendiente(ids: string[], calor: boolean) {
  try {
    const k = clave(ids, calor)
    const lista = leerPendientes()
    const p = lista.find((x) => x.clave === k)
    if (p) { p.veces++; p.fecha = new Date().toISOString() } else lista.push({ clave: k, ids: [...new Set(ids)].sort(), calor, veces: 1, fecha: new Date().toISOString() })
    localStorage.setItem(LLAVE, JSON.stringify(lista))
  } catch { /* sin almacenamiento: no se guarda */ }
}
