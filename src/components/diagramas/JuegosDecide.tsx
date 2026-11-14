import JuegoDecide from './JuegoDecide.tsx'

// Minijuegos del tema 3 hechos con el motor «decide rápido». Solo datos.

export function LisosomaJuego() {
  return (
    <JuegoDecide
      titulo="El lisosoma decide"
      pregunta="¿Qué hace el lisosoma con esto?"
      instrucciones="Eres el lisosoma. Llegan cosas a la célula: decide cuáles digerir y reciclar y cuáles no son asunto tuyo."
      clave="cien:lisosoma-mejor"
      opciones={[
        { id: 'digiere', nombre: 'Digerir y reciclar', icono: '♻️' },
        { id: 'deja', nombre: 'No tocar', icono: '✋' },
      ]}
      cartas={[
        { icono: '🦠', nombre: 'Bacteria tragada', pista: 'Un glóbulo blanco se la comió.', correcta: 'digiere', explica: 'La vesícula con la bacteria se une al lisosoma y sus enzimas la desarman.' },
        { icono: '🔋', nombre: 'Mitocondria vieja', pista: 'Ya no funciona bien.', correcta: 'digiere', explica: 'La célula recicla sus orgánulos gastados: se llama autofagia.' },
        { icono: '🧩', nombre: 'Proteína mal plegada', correcta: 'digiere', explica: 'Las proteínas dañadas se desarman y sus piezas (aminoácidos) se reutilizan.' },
        { icono: '🍞', nombre: 'Partícula de alimento', pista: 'Entró en una vesícula.', correcta: 'digiere', explica: 'Las enzimas la rompen en moléculas pequeñas que la célula aprovecha.' },
        { icono: '🧬', nombre: 'ADN del núcleo', pista: 'Sano y funcionando.', correcta: 'deja', explica: 'El ADN está protegido dentro del núcleo: el lisosoma no lo toca.' },
        { icono: '⚡', nombre: 'Mitocondria sana', correcta: 'deja', explica: 'Si funciona bien, la célula la necesita: solo se recicla cuando está gastada.' },
        { icono: '🧱', nombre: 'Membrana de la célula', correcta: 'deja', explica: 'Las enzimas quedan encerradas en el lisosoma para no dañar la propia célula.' },
        { icono: '🦠', nombre: 'Virus en una vesícula', pista: 'Entró por endocitosis.', correcta: 'digiere', explica: 'Es una de las defensas de la célula: digerir lo que entra encerrado.' },
        { icono: '🧪', nombre: 'Enzima del citosol', pista: 'Está trabajando en la glucólisis.', correcta: 'deja', explica: 'Está haciendo su trabajo: no hay que reciclarla.' },
        { icono: '🍬', nombre: 'Glucosa', pista: 'Ya es una molécula pequeña.', correcta: 'deja', explica: 'Ya está lista para usarse como energía: no hay nada que romper.' },
      ]}
      cierre="Regla: el lisosoma digiere lo que llega encerrado en vesículas y los orgánulos gastados. Sus enzimas se quedan adentro para no dañar la célula."
    />
  )
}

export function CitoplasmaJuego() {
  return (
    <JuegoDecide
      titulo="¿Dónde ocurre?"
      pregunta="¿En qué parte de la célula ocurre esto?"
      instrucciones="Cada tarjeta es algo que pasa en la célula. Di dónde: en el citosol (el líquido) o dentro de un orgánulo."
      clave="cien:citoplasma-mejor"
      opciones={[
        { id: 'citosol', nombre: 'Citosol', icono: '💧' },
        { id: 'nucleo', nombre: 'Núcleo', icono: '🟣' },
        { id: 'mito', nombre: 'Mitocondria', icono: '🔋' },
        { id: 'liso', nombre: 'Lisosoma', icono: '♻️' },
      ]}
      cartas={[
        { icono: '🍬', nombre: 'Glucólisis', pista: 'La glucosa se parte en dos.', correcta: 'citosol', explica: 'El primer paso para sacar energía ocurre en el citosol, con o sin oxígeno.' },
        { icono: '📜', nombre: 'Copiar el ADN', correcta: 'nucleo', explica: 'El ADN se copia dentro del núcleo antes de que la célula se divida.' },
        { icono: '⚡', nombre: 'Hacer la mayor parte del ATP', correcta: 'mito', explica: 'Con oxígeno, la mitocondria saca unos 30 ATP de cada glucosa.' },
        { icono: '🦠', nombre: 'Digerir una bacteria', correcta: 'liso', explica: 'Las enzimas del lisosoma la desarman.' },
        { icono: '🔗', nombre: 'Armar una proteína con ribosoma libre', correcta: 'citosol', explica: 'Los ribosomas libres flotan en el citosol y fabrican ahí las proteínas que se quedan dentro.' },
        { icono: '✉️', nombre: 'Hacer ARN mensajero', correcta: 'nucleo', explica: 'La receta del ADN se copia en ARN dentro del núcleo, y luego sale.' },
        { icono: '🫁', nombre: 'Usar oxígeno', correcta: 'mito', explica: 'La respiración celular consume oxígeno en la mitocondria.' },
        { icono: '🔋', nombre: 'Reciclar una mitocondria vieja', correcta: 'liso', explica: 'A eso se le llama autofagia: el lisosoma la digiere.' },
        { icono: '🥛', nombre: 'Fermentación láctica', pista: 'Músculo sin oxígeno suficiente.', correcta: 'citosol', explica: 'Sin oxígeno todo se queda en el citosol: sale ácido láctico y poco ATP.' },
        { icono: '🧶', nombre: 'Formar los cromosomas', correcta: 'nucleo', explica: 'El ADN se enrolla y se compacta antes de dividirse.' },
      ]}
      cierre="El citosol no es un relleno: ahí ocurren la glucólisis y la fabricación de muchas proteínas. Los orgánulos se reparten los demás trabajos."
    />
  )
}

export function CitoesqueletoJuego() {
  return (
    <JuegoDecide
      titulo="Rieles y andamios"
      pregunta="¿Qué fibra del citoesqueleto hace este trabajo?"
      instrucciones="El citoesqueleto tiene tres tipos de fibras. Cada tarjeta es un trabajo: elige quién lo hace."
      clave="cien:citoesqueleto-mejor"
      opciones={[
        { id: 'micro', nombre: 'Microfilamentos (actina)', icono: '➰' },
        { id: 'tubulo', nombre: 'Microtúbulos', icono: '🛤️' },
        { id: 'inter', nombre: 'Filamentos intermedios', icono: '🪢' },
      ]}
      cartas={[
        { icono: '🚃', nombre: 'Llevar una vesícula de un lado a otro', correcta: 'tubulo', explica: 'Los microtúbulos son los rieles: proteínas motoras «caminan» sobre ellos con su carga.' },
        { icono: '🧵', nombre: 'Formar el huso en la mitosis', correcta: 'tubulo', explica: 'El huso que jala los cromosomas está hecho de microtúbulos.' },
        { icono: '💪', nombre: 'Contraer el músculo', correcta: 'micro', explica: 'La actina y la miosina se deslizan entre sí y acortan la fibra.' },
        { icono: '🎒', nombre: 'Estrangular la célula en la citocinesis', correcta: 'micro', explica: 'El anillo contráctil está hecho de microfilamentos de actina.' },
        { icono: '🛡️', nombre: 'Aguantar estiramientos en la piel', correcta: 'inter', explica: 'Los filamentos intermedios son como cuerdas resistentes: dan fuerza mecánica.' },
        { icono: '💅', nombre: 'Dar dureza a uñas y pelo', pista: 'Queratina.', correcta: 'inter', explica: 'La queratina forma filamentos intermedios.' },
        { icono: '🏊', nombre: 'Mover un flagelo o un cilio', correcta: 'tubulo', explica: 'Por dentro, cilios y flagelos tienen microtúbulos ordenados.' },
        { icono: '🦶', nombre: 'Sacar «pies» para arrastrarse', pista: 'Como una ameba.', correcta: 'micro', explica: 'La actina crece en el borde de la célula y la empuja hacia adelante.' },
        { icono: '🟣', nombre: 'Sostener la forma del núcleo', correcta: 'inter', explica: 'Una red de filamentos intermedios (láminas) refuerza la envoltura nuclear.' },
      ]}
      cierre="Microtúbulos: rieles y huso. Microfilamentos: movimiento y contracción. Filamentos intermedios: resistencia."
    />
  )
}

export function RibosomaJuego() {
  return (
    <JuegoDecide
      titulo="¿Libre o pegado?"
      pregunta="¿Qué ribosoma fabrica esta proteína?"
      instrucciones="Hay ribosomas libres en el citosol y ribosomas pegados al retículo rugoso. Depende de adónde va la proteína."
      clave="cien:ribosoma-mejor"
      opciones={[
        { id: 'libre', nombre: 'Ribosoma libre', icono: '⚫' },
        { id: 'reticulo', nombre: 'Ribosoma del retículo', icono: '🌊' },
      ]}
      cartas={[
        { icono: '💉', nombre: 'Insulina', pista: 'Sale a la sangre.', correcta: 'reticulo', explica: 'Lo que sale de la célula se fabrica en el retículo y pasa por el Golgi.' },
        { icono: '🍬', nombre: 'Enzima de la glucólisis', pista: 'Trabaja en el citosol.', correcta: 'libre', explica: 'Se queda en el citosol: la hace un ribosoma libre.' },
        { icono: '🚪', nombre: 'Canal de la membrana', correcta: 'reticulo', explica: 'Las proteínas de membrana se fabrican en el retículo y viajan en vesículas.' },
        { icono: '➰', nombre: 'Actina', pista: 'Del citoesqueleto.', correcta: 'libre', explica: 'Trabaja dentro de la célula: ribosoma libre.' },
        { icono: '♻️', nombre: 'Enzima del lisosoma', correcta: 'reticulo', explica: 'Va en vesícula hasta el lisosoma: empieza en el retículo.' },
        { icono: '🛡️', nombre: 'Anticuerpo', pista: 'Un glóbulo blanco lo suelta.', correcta: 'reticulo', explica: 'Sale de la célula: retículo, Golgi y vesícula.' },
        { icono: '🩸', nombre: 'Hemoglobina', pista: 'Se queda dentro del glóbulo rojo.', correcta: 'libre', explica: 'Trabaja dentro de la célula, en el citosol.' },
        { icono: '🥛', nombre: 'Proteína de la leche', pista: 'La célula de la glándula la secreta.', correcta: 'reticulo', explica: 'Se exporta: se fabrica en el retículo rugoso.' },
      ]}
      cierre="Regla: si la proteína se queda en el citosol, ribosoma libre. Si va a la membrana, al lisosoma o afuera, ribosoma del retículo."
    />
  )
}

export function PeroxisomaJuego() {
  return (
    <JuegoDecide
      titulo="¿Peroxisoma o lisosoma?"
      pregunta="¿Quién se encarga?"
      instrucciones="Los dos son bolsitas con enzimas, pero hacen trabajos distintos. Decide cuál de los dos entra en acción."
      clave="cien:peroxisoma-mejor"
      opciones={[
        { id: 'perox', nombre: 'Peroxisoma', icono: '🫧' },
        { id: 'liso', nombre: 'Lisosoma', icono: '♻️' },
      ]}
      cartas={[
        { icono: '⚠️', nombre: 'Agua oxigenada (H₂O₂)', pista: 'Se formó dentro de la célula.', correcta: 'perox', explica: 'La catalasa del peroxisoma la convierte en agua y oxígeno.' },
        { icono: '🍺', nombre: 'Alcohol en el hígado', correcta: 'perox', explica: 'Los peroxisomas del hígado ayudan a desactivar el alcohol.' },
        { icono: '🧈', nombre: 'Grasas muy largas', correcta: 'perox', explica: 'El peroxisoma las acorta para que la mitocondria las use.' },
        { icono: '🦠', nombre: 'Bacteria tragada', correcta: 'liso', explica: 'La digieren las enzimas del lisosoma.' },
        { icono: '🔋', nombre: 'Mitocondria vieja', correcta: 'liso', explica: 'El lisosoma recicla orgánulos gastados.' },
        { icono: '💊', nombre: 'Sustancia tóxica', pista: 'Hay que neutralizarla, no digerirla.', correcta: 'perox', explica: 'Desactivar lo peligroso es el trabajo del peroxisoma.' },
        { icono: '🍞', nombre: 'Alimento en una vesícula', correcta: 'liso', explica: 'Lo que entra encerrado se digiere en el lisosoma.' },
        { icono: '🫧', nombre: 'Burbujas al echar agua oxigenada en una herida', correcta: 'perox', explica: 'Es la catalasa trabajando: libera oxígeno.' },
      ]}
      cierre="Peroxisoma: desactiva lo peligroso (agua oxigenada, alcohol, toxinas). Lisosoma: digiere y recicla."
    />
  )
}

export function ParedMatrizJuego() {
  return (
    <JuegoDecide
      titulo="¿Pared o matriz?"
      pregunta="¿Qué es lo que está por fuera de esta célula?"
      instrucciones="Por fuera de la membrana, las plantas tienen pared celular y los animales matriz extracelular. Decide cuál."
      clave="cien:pared-mejor"
      opciones={[
        { id: 'pared', nombre: 'Pared celular', icono: '🧱' },
        { id: 'matriz', nombre: 'Matriz extracelular', icono: '🕸️' },
      ]}
      cartas={[
        { icono: '🌳', nombre: 'Madera de un árbol', correcta: 'pared', explica: 'La madera son paredes celulares gruesas, de celulosa y lignina.' },
        { icono: '🦴', nombre: 'Hueso', correcta: 'matriz', explica: 'El hueso es matriz extracelular con colágeno y calcio.' },
        { icono: '👕', nombre: 'Algodón', correcta: 'pared', explica: 'Las fibras de algodón son paredes de celulosa casi pura.' },
        { icono: '👂', nombre: 'Cartílago de la oreja', correcta: 'matriz', explica: 'Matriz flexible fabricada por células del cartílago.' },
        { icono: '🥬', nombre: 'Lechuga crujiente', correcta: 'pared', explica: 'La pared y el agua de la vacuola la mantienen firme.' },
        { icono: '🦵', nombre: 'Tendón', correcta: 'matriz', explica: 'Está hecho de fibras de colágeno de la matriz.' },
        { icono: '📄', nombre: 'Papel', correcta: 'pared', explica: 'El papel se hace con fibras de celulosa de las paredes de la madera.' },
        { icono: '🧴', nombre: 'Colágeno de la piel', correcta: 'matriz', explica: 'El colágeno es la proteína más abundante de la matriz.' },
      ]}
      cierre="Pared: rígida, de celulosa, en plantas (y hongos y bacterias, con otros materiales). Matriz: red de proteínas como el colágeno, en animales."
    />
  )
}
