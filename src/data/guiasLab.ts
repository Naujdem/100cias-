import type { Guia } from '../components/lab/GuiaLab.tsx'

// Guías de laboratorio por id de práctica (VistaLaboratorios.tsx). Se agrega la guía de cada práctica
// cuando se crea o se convierte a mesa viva (PLAN-LABORATORIOS.md).

export const GUIAS: Record<string, Guia> = {
  montaje: {
    objetivo: ['Preparar un montaje húmedo de epidermis de cebolla y observar sus células al microscopio con el objetivo de 10x.'],
    fundamento: [
      'Para ver células al microscopio de luz, la muestra debe ser tan delgada que la luz la atraviese: por eso se usa la epidermis, una capa de una sola célula de grosor.',
      'El agua mantiene las células hidratadas y llena el espacio bajo el cubreobjetos; si falta, las células se arrugan, y si sobra, el cubreobjetos flota y la imagen se mueve.',
      'El cubreobjetos se baja inclinado (unos 45°), apoyando primero un borde en la gota, para que el agua empuje el aire hacia afuera y no queden burbujas.',
    ],
    materiales: ['Portaobjetos y cubreobjetos', 'Gotero con agua', 'Cebolla', 'Pinza de punta fina', 'Aguja de disección', 'Papel absorbente', 'Microscopio'],
    procedimiento: [
      'Limpia el portaobjetos con papel y tómalo siempre por los bordes.',
      'Pon una gota de agua en el centro del portaobjetos.',
      'Con la pinza, desprende la telita delgada de la cara interna de una capa de cebolla.',
      'Pon la telita sobre la gota y extiéndela con la aguja, sin pliegues.',
      'Apoya un borde del cubreobjetos en la gota, inclinado unos 45°, y bájalo despacio.',
      'Si sobra agua, sécala acercando el papel absorbente al borde del cubreobjetos.',
      'Lleva la lámina al microscopio: empieza con 4x, enfoca con el macrométrico y pasa a 10x.',
      'Dibuja lo que observas e indica el aumento total.',
    ],
    seguridad: ['Los cubreobjetos son muy delgados y se rompen fácil: tómalos de los bordes.', 'El vidrio roto va en su caja, nunca en la caneca común.'],
    preguntas: [
      '¿Qué forma tienen las células de la epidermis de cebolla y cómo están unidas entre sí?',
      '¿Por qué se usa la telita y no un trozo de cebolla?',
      '¿Cómo reconoces una burbuja de aire al microscopio? ¿Cómo se evita?',
      '¿Qué pasa si no pones agua o si pones demasiada?',
      'Si el ocular es de 10x y el objetivo de 10x, ¿cuál es el aumento total?',
    ],
  },
  tinciones: {
    objetivo: [
      'Teñir células de cebolla, de la mucosa de la mejilla y de papa con lugol o azul de metileno y comparar lo que resalta cada colorante.',
      'En 11°: hacer la tinción de Gram y diferenciar bacterias Gram positivas y Gram negativas.',
    ],
    fundamento: [
      'Las células son casi transparentes: los colorantes se unen a ciertas estructuras y aumentan el contraste.',
      'El azul de metileno tiñe sobre todo los núcleos; el lugol (yodo) tiñe de azul oscuro el almidón y de café las demás estructuras.',
      'Cada colorante necesita un tiempo: si es poco, la muestra queda pálida; si es mucho, todo se oscurece. Después se lava el exceso para que el fondo quede claro.',
      'Gram: el cristal violeta y el lugol forman un complejo que queda atrapado en la pared gruesa de las Gram positivas (moradas); el alcohol lo saca de las Gram negativas, que luego toma la safranina (rosadas).',
    ],
    materiales: ['Portaobjetos y cubreobjetos', 'Cebolla, palillo limpio y papa', 'Lugol', 'Azul de metileno', 'Piseta con agua', 'Temporizador', 'Microscopio', 'Para Gram: cristal violeta, alcohol, safranina y cultivos (yogur y E. coli)'],
    procedimiento: [
      'Pon la muestra en el portaobjetos (la telita de cebolla, un raspado suave de la mejilla con el palillo o un raspado de papa).',
      'Cúbrela con el cubreobjetos, bajándolo inclinado.',
      'Echa dos gotas del colorante por un borde del cubreobjetos.',
      'Programa el temporizador: unos 30 s para el lugol y cerca de 1 minuto para el azul de metileno.',
      'Cuando suene, lava el exceso con la piseta por un borde.',
      'Lleva la lámina al microscopio y enfoca con 40x.',
      'Prueba la otra combinación de muestra y colorante y compara.',
    ],
    seguridad: ['Los colorantes manchan la piel y la ropa: usa bata y guantes.', 'El palillo de la mejilla se usa una sola vez y se bota.', 'Las láminas con bacterias van al recipiente de residuos biológicos.'],
    preguntas: [
      '¿Qué estructuras de la célula de cebolla se ven mejor con el colorante que sin él?',
      '¿Qué colorante resalta mejor los núcleos de la mejilla? ¿Y el almidón de la papa?',
      '¿Qué pasa si dejas el colorante muy poco o demasiado tiempo?',
      '¿Por qué hay que lavar el exceso de colorante?',
      'En Gram: ¿de qué color quedan las bacterias del yogur y las E. coli, y a qué se debe la diferencia?',
    ],
  },
  osmosis: {
    objetivo: [
      'Observar la plasmólisis en células de elodea al cambiar el medio y explicarla por ósmosis.',
      'Medir el cambio de masa de tiras de papa en agua con distintas concentraciones de sal y hallar el punto isotónico.',
    ],
    fundamento: [
      'La ósmosis es el paso de agua a través de una membrana semipermeable desde donde hay menos solutos hacia donde hay más.',
      'En un medio hipertónico (más sal afuera) la célula pierde agua: en las plantas el protoplasto se encoge y se separa de la pared (plasmólisis). En un medio hipotónico entra agua y la célula queda turgente; la pared evita que reviente.',
      'En el medio isotónico la célula no gana ni pierde agua. Se halla graficando el cambio de masa contra la concentración y leyendo dónde la línea cruza el cero.',
    ],
    materiales: [
      'Elodea, portaobjetos, cubreobjetos, goteros con agua destilada y sal al 0,9 %, 3 % y 10 %, papel absorbente y microscopio',
      'Cinco tiras de papa del mismo tamaño, cinco vasos con sal al 0 %, 1 %, 2 %, 5 % y 10 %, balanza, papel absorbente y temporizador',
    ],
    procedimiento: [
      'Elodea: pon una hoja sobre el portaobjetos con una gota de agua destilada y cúbrela.',
      'Obsérvala a 40x y dibuja las células.',
      'Pon una gota de sal al 10 % en un borde del cubreobjetos y acerca el papel absorbente al borde contrario para que la arrastre.',
      'Observa durante unos minutos y dibuja lo que cambia. Luego vuelve a pasar agua destilada de la misma forma.',
      'Papa: pesa cada tira y anota su masa inicial.',
      'Pon cada tira en un vaso y deja que pasen 30 minutos.',
      'Saca cada tira, sécala con papel absorbente y pésala de nuevo.',
      'Calcula el porcentaje de cambio de masa, haz la gráfica y halla el punto isotónico.',
    ],
    seguridad: ['Seca bien las manos y la mesa: el agua cerca del microscopio y de la balanza puede dañarlos.', 'No consumas las papas del experimento.'],
    preguntas: [
      '¿Qué le pasó al protoplasto de la elodea en sal al 10 %? ¿Y al volver al agua destilada?',
      '¿Por qué la célula vegetal no revienta en agua destilada, y una célula animal sí?',
      '¿En qué vasos la papa ganó masa y en cuáles la perdió? ¿Cómo se sentía al tacto?',
      '¿En qué concentración está el punto isotónico de la papa?',
      '¿Por qué hay que secar las tiras antes de pesarlas?',
      '¿Por qué el suero que se pone en la vena tiene 0,9 % de sal?',
    ],
  },
}
