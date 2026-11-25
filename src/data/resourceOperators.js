/* Archivo temporal de operadores de períodos anteriores, sin publicar.
const operator = (name, shift, totalEvents, assignedResources) => ({
  id: `${name}|${shift}`,
  name,
  shift,
  totalEvents,
  assignedResources,
  unassignedResources: totalEvents - assignedResources,
})

const correctedNovemberOperators = [
  ['agostina.cabral', 'E', 7, 6], ['agustin.lazarte', 'D', 2, 1], ['agustin.lazarte', 'F', 19, 7],
  ['alan.olivero', 'F', 11, 5], ['alexander.montaño', 'E', 17, 13], ['alexander.montaño', 'F', 10, 6],
  ['altamirano.joaquin', 'B', 4, 3], ['ana.gomez', 'B', 2, 2], ['ana.gomez', 'D', 65, 30],
  ['antonella.carollo', 'B', 1, 0], ['antonella.correa', 'F', 2, 2], ['antonella.cueva', 'D', 7, 1],
  ['antonella.cueva', 'F', 2, 0], ['antonella.difrancesca', 'D', 1, 1], ['carolina.rosso', 'D', 21, 9],
  ['celeste.suarez', 'B', 15, 12], ['cintia.ramos', 'B', 1, 1], ['cintia.ramos', 'D', 29, 18],
  ['cintia.ramos', 'F', 1, 1], ['dahyana.zamorano', 'D', 1, 0], ['daniela.gonzalez', 'E', 9, 6],
  ['david.bosio', 'F', 10, 6], ['delfina.paz', 'B', 19, 17], ['estefania.ybañez', 'B', 31, 23],
  ['fabricio.cabral', 'B', 33, 19], ['facundo.barrionuevo', 'E', 9, 6], ['hernan.fuentes', 'B', 11, 9],
  ['ignacio.marino', 'D', 28, 9], ['ignacio.marino', 'F', 1, 1], ['isabel.leiva', 'D', 1, 1],
  ['isabel.leiva', 'F', 4, 1], ['ismael.zamuz', 'B', 3, 3], ['ismael.zamuz', 'D', 37, 24],
  ['jazmin.ramirez', 'B', 21, 20], ['jesica.lopez', 'D', 2, 0], ['jesica.lopez', 'F', 10, 6],
  ['josue.chazarreta', 'B', 2, 1], ['juan.esquibel', 'B', 9, 7], ['julieta.reynoso', 'B', 2, 1],
  ['julieta.reynoso', 'E', 1, 0], ['lara.escudero', 'D', 1, 0], ['lucia.romero', 'B', 15, 9],
  ['luciana.antunez', 'E', 10, 8], ['luisiana.unamuno', 'B', 8, 5], ['malena.rosa', 'D', 39, 14],
  ['martina.guzman', 'D', 34, 21], ['martina.guzman', 'F', 1, 1], ['martina.torres', 'D', 1, 0],
  ['martina.torres', 'F', 34, 14], ['mateo.acosta', 'D', 30, 11], ['mateo.acosta', 'F', 1, 0],
  ['melania.moyano', 'E', 8, 8], ['milagros.oviedo', 'E', 3, 2], ['nahuel.ribaudo', 'F', 15, 12],
  ['nancy.farias', 'E', 9, 9], ['nicolas.gonzalez', 'E', 1, 1], ['nicolas.uliarte', 'B', 3, 1],
  ['pamela.gigena', 'D', 4, 2], ['paula.podboraczynski', 'E', 7, 2], ['rocio.fuentecilla', 'D', 8, 3],
  ['rocio.fuentecilla', 'F', 22, 12], ['santiago.repiso', 'F', 1, 0], ['tomas.fernandez', 'F', 1, 1],
  ['virginia.herrera', 'F', 5, 3], ['wanda.peralta', 'B', 24, 19], ['wilda.ponce', 'B', 3, 0],
  ['wilda.ponce', 'D', 46, 29], ['yamila.vega', 'E', 7, 5],
].map(([name, shift, totalEvents, assignedResources]) => operator(name, shift, totalEvents, assignedResources))

// Operadores consolidados desde ASIGANCION 25 Y 26.csv y asociados a la nómina por turno.
export const resourceOperatorsByPeriod = {
  '2026-11-02_2026-11-03': [
    operator('agostina.cabral', 'E', 7, 6), operator('agustin.lazarte', 'F', 21, 8),
    operator('alan.olivero', 'F', 11, 5), operator('alexander.montaño', 'E', 27, 19),
    operator('altamirano.joaquin', 'B', 4, 3), operator('ana.gomez', 'D', 67, 32),
    operator('antonella.carollo', 'D', 1, 0), operator('antonella.correa', 'F', 2, 2),
    operator('antonella.cueva', 'D', 9, 1), operator('antonella.difrancesca', 'D', 1, 1),
    operator('carolina.rosso', 'D', 21, 9), operator('celeste.suarez', 'B', 15, 12),
    operator('cintia.ramos', 'D', 31, 20), operator('dahyana.zamorano', 'D', 1, 0),
    operator('daniela.gonzalez', 'E', 9, 6), operator('david.bosio', 'F', 10, 6),
    operator('delfina.paz', 'B', 19, 17), operator('estefania.ybañez', 'B', 31, 23),
    operator('fabricio.cabral', 'B', 33, 19), operator('facundo.barrionuevo', 'E', 9, 6),
    operator('hernan.fuentes', 'B', 11, 9), operator('ignacio.marino', 'D', 29, 10),
    operator('isabel.leiva', 'F', 5, 2), operator('ismael.zamuz', 'D', 40, 27),
    operator('jazmin.ramirez', 'B', 21, 20), operator('jesica.lopez', 'E', 12, 6),
    operator('josue.chazarreta', 'B', 2, 1), operator('juan.esquibel', 'B', 9, 7),
    operator('julieta.reynoso', 'B', 3, 1), operator('lara.escudero', 'F', 1, 0),
    operator('lucia.romero', 'B', 15, 9), operator('luciana.antunez', 'E', 10, 8),
    operator('luisiana.unamuno', 'B', 8, 5), operator('malena.rosa', 'D', 40, 14),
    operator('martina.guzman', 'D', 34, 21), operator('martina.torres', 'F', 35, 14),
    operator('mateo.acosta', 'D', 31, 11), operator('melania.moyano', 'E', 8, 8),
    operator('milagros.oviedo', 'E', 3, 2), operator('nadia.segura', 'F', 1, 0),
    operator('nahuel.ribaudo', 'F', 15, 12), operator('nancy.farias', 'E', 9, 9),
    operator('nicolas.gonzalez', 'B', 1, 1), operator('nicolas.uliarte', 'B', 3, 1),
    operator('pamela.gigena', 'D', 4, 2), operator('paula.podboraczynski', 'E', 7, 2),
    operator('rocio.fuentecilla', 'F', 30, 15), operator('santiago.repiso', 'F', 1, 0),
    operator('tomas.fernandez', 'B', 1, 1), operator('virginia.herrera', 'A', 5, 3),
    operator('wanda.peralta', 'B', 24, 19), operator('wilda.ponce', 'D', 49, 29),
    operator('yamila.vega', 'E', 7, 5),
  ],
  '2026-10-25_2026-10-26': [
    operator('agustin.lazarte', 'F', 13, 0), operator('alan.olivero', 'F', 9, 1),
    operator('alexander.montaño', 'E', 14, 11), operator('ana.gomez', 'D', 34, 11),
    operator('antonella.carollo', 'D', 5, 0), operator('antonella.correa', 'F', 15, 4),
    operator('antonella.cueva', 'D', 27, 5), operator('antonella.difrancesca', 'D', 25, 2),
    operator('carolina.rosso', 'D', 10, 0), operator('constanza.roldan', 'F', 1, 0),
    operator('dahyana.zamorano', 'D', 2, 0), operator('david.bosio', 'F', 12, 1),
    operator('delfina.paz', 'B', 16, 13), operator('estefania.ybañez', 'B', 12, 10),
    operator('fabricio.cabral', 'B', 32, 21), operator('facundo.barrionuevo', 'E', 17, 10),
    operator('fernanda.diaz', 'F', 3, 0), operator('franco.barrionuevo', 'E', 13, 2),
    operator('hernan.fuentes', 'B', 17, 15), operator('ian.farias', 'C', 2, 2),
    operator('ignacio.marino', 'D', 1, 0), operator('isabel.leiva', 'F', 7, 1),
    operator('ismael.zamuz', 'D', 37, 4), operator('jazmin.ramirez', 'B', 9, 5),
    operator('julieta.reynoso', 'B', 2, 1), operator('lorena.soria', 'B', 15, 11),
    operator('lucia.romero', 'B', 23, 19), operator('luciana.antunez', 'E', 27, 18),
    operator('martina.torres', 'F', 26, 4), operator('mateo.acosta', 'D', 40, 10),
    operator('melania.moyano', 'E', 24, 12), operator('milagros.oviedo', 'E', 9, 5),
    operator('milena.quinteros', 'D', 30, 17), operator('nancy.farias', 'E', 13, 5),
    operator('nicolas.gonzalez', 'B', 5, 1), operator('noelia.gorosito', 'A', 12, 0),
    operator('oriana.moyano', 'B', 27, 21), operator('pablo.azize', 'C', 7, 0),
    operator('pamela.gigena', 'D', 11, 3), operator('paula.podboraczynski', 'E', 7, 3),
    operator('rocio.fuentecilla', 'F', 22, 4), operator('tiziana.martinez', 'B', 1, 1),
    operator('valentina.palmieri', 'C', 9, 1), operator('veronica.paz', 'D', 24, 1),
    operator('wanda.peralta', 'B', 20, 14), operator('wilda.ponce', 'D', 39, 1),
    operator('yamila.vega', 'E', 25, 9), operator('yesica.varela', 'E', 3, 2),
  ],
}

resourceOperatorsByPeriod['2026-11-02_2026-11-03'] = correctedNovemberOperators
*/

const operator = (name, shift, totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources) => ({
  id: `${name}|${shift}`,
  name,
  shift,
  totalEvents,
  correctlyAssignedResources,
  incorrectlyAssignedResources,
  unassignedResources,
})

const november14And15Operators = [
  ['altamirano.joaquin', 'B', 1, 1, 0, 0], ['ana.gomez', 'B', 2, 1, 1, 0], ['antonella.correa', 'B', 1, 0, 0, 1],
  ['celeste.suarez', 'B', 10, 7, 2, 1], ['delfina.paz', 'B', 6, 3, 1, 2], ['estefania.ybañez', 'B', 10, 5, 4, 1],
  ['fabricio.cabral', 'B', 52, 39, 13, 0], ['hernan.fuentes', 'B', 13, 8, 4, 1], ['ismael.farias', 'B', 5, 4, 1, 0],
  ['ismael.zamuz', 'B', 1, 1, 0, 0], ['julieta.reynoso', 'B', 7, 1, 1, 5], ['julieta.rivarola', 'B', 13, 12, 1, 0],
  ['leonela.jaime', 'B', 11, 9, 2, 0], ['lorena.soria', 'B', 13, 8, 4, 1], ['lucia.romero', 'B', 1, 1, 0, 0],
  ['luisiana.unamuno', 'B', 20, 15, 3, 2], ['luz.nieto', 'B', 12, 12, 0, 0], ['macarena.basualdo', 'B', 3, 1, 0, 2],
  ['mateo.acosta', 'B', 2, 2, 0, 0], ['mayco.patino', 'B', 1, 0, 1, 0], ['milena.quinteros', 'B', 1, 0, 1, 0],
  ['nicolas.uliarte', 'B', 9, 8, 0, 1], ['rocio.ferreyra', 'B', 7, 4, 1, 2], ['rocio.fuentecilla', 'B', 23, 16, 5, 2], ['tiziana.martinez', 'B', 1, 1, 0, 0],
  ['ana.gomez', 'D', 77, 50, 26, 1], ['antonella.carollo', 'D', 4, 2, 2, 0], ['antonella.correa', 'D', 3, 3, 0, 0],
  ['antonella.cueva', 'D', 40, 32, 7, 1], ['carla.perez', 'D', 2, 2, 0, 0], ['carolina.rosso', 'D', 34, 22, 11, 1],
  ['cintia.ramos', 'D', 23, 9, 14, 0], ['dahyana.zamorano', 'D', 5, 2, 3, 0], ['daniela.gonzalez', 'D', 11, 2, 8, 1],
  ['gabriel.aguirre', 'D', 1, 1, 0, 0], ['gonzalo.canut', 'D', 5, 2, 1, 2], ['guada.gomez', 'D', 8, 6, 2, 0],
  ['ismael.farias', 'D', 6, 2, 4, 0], ['ismael.zamuz', 'D', 40, 31, 8, 1], ['julian.albaro', 'D', 2, 2, 0, 0],
  ['luz.nieto', 'D', 1, 1, 0, 0], ['malena.arreguez', 'D', 2, 0, 0, 2], ['malena.rosa', 'D', 32, 22, 8, 2],
  ['maria.jabour', 'D', 12, 8, 4, 0], ['martina.torres', 'D', 3, 2, 1, 0], ['mateo.acosta', 'D', 33, 28, 5, 0],
  ['mayco.patino', 'D', 33, 22, 9, 2], ['milena.quinteros', 'D', 7, 7, 0, 0], ['nicole.gutierrez', 'D', 1, 1, 0, 0],
  ['pamela.gigena', 'D', 4, 2, 2, 0], ['paola.escalzo', 'D', 4, 2, 2, 0], ['valentina.masucci', 'D', 4, 3, 1, 0],
  ['victoria.barraza', 'D', 2, 1, 1, 0], ['wilda.ponce', 'D', 12, 10, 2, 0],
  ['agostina.cabral', 'E', 11, 8, 2, 1], ['alexander.montaño', 'E', 12, 8, 2, 2], ['carla.lopez', 'E', 4, 2, 2, 0],
  ['daniela.gonzalez', 'E', 14, 12, 2, 0], ['estefania.ybañez', 'E', 2, 2, 0, 0], ['facundo.barrionuevo', 'E', 21, 20, 1, 0],
  ['julieta.aguirre', 'E', 1, 1, 0, 0], ['milagros.oviedo', 'E', 17, 16, 1, 0], ['nancy.farias', 'E', 14, 9, 4, 1],
  ['victoria.barraza', 'E', 14, 12, 2, 0], ['yamila.vega', 'E', 27, 14, 12, 1],
  ['alan.olivero', 'F', 7, 3, 4, 0], ['antonella.correa', 'F', 45, 27, 14, 4], ['antonella.cueva', 'F', 3, 1, 2, 0],
  ['barbara.gatica', 'F', 8, 2, 6, 0], ['carla.perez', 'F', 10, 5, 2, 3], ['cintia.ramos', 'F', 1, 0, 1, 0],
  ['dahyana.zamorano', 'F', 1, 1, 0, 0], ['david.bosio', 'F', 40, 20, 12, 8], ['fabricio.cabral', 'F', 1, 1, 0, 0],
  ['gabriel.aguirre', 'F', 50, 18, 23, 9], ['julian.albaro', 'F', 35, 13, 6, 16], ['lorena.soria', 'F', 1, 0, 0, 1],
  ['macarena.basualdo', 'F', 15, 8, 2, 5], ['martina.torres', 'F', 70, 34, 28, 8], ['mateo.acosta', 'F', 1, 0, 1, 0],
  ['mondel.gomez', 'F', 19, 12, 6, 1], ['nicolas.murua', 'F', 4, 4, 0, 0], ['nicole.gutierrez', 'F', 5, 3, 1, 1],
  ['noelia.araya', 'F', 1, 1, 0, 0], ['paola.escalzo', 'F', 20, 15, 3, 2], ['santiago.repiso', 'F', 7, 5, 1, 1],
].map(([name, shift, totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources]) => (
  operator(name, shift, totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources)
))

const november16And17Operators = [
  ['agostina.ledezma', 'A', 1, 1, 0, 0], ['agustina.amaya', 'A', 20, 16, 4, 0], ['brenda.romero', 'A', 4, 4, 0, 0],
  ['deborah.juarez', 'A', 10, 8, 2, 0], ['florencia.ojeda', 'A', 24, 15, 9, 0], ['florencia.rosso', 'A', 9, 8, 1, 0],
  ['gabriel.diaz', 'A', 16, 8, 8, 0], ['ismael.farias', 'A', 5, 3, 1, 1], ['leandro.iglesias', 'A', 7, 6, 1, 0],
  ['lisandro.rosales', 'A', 1, 1, 0, 0], ['macarena.basualdo', 'A', 1, 1, 0, 0], ['martina.gomez', 'A', 1, 1, 0, 0],
  ['melisa.bonaldi', 'A', 9, 4, 5, 0], ['nicolas.murua', 'A', 1, 1, 0, 0], ['noelia.gorosito', 'A', 12, 5, 7, 0],
  ['pablo.azize', 'A', 1, 1, 0, 0], ['regina.olmedo', 'A', 2, 2, 0, 0], ['santiago.guzman', 'A', 26, 21, 4, 1], ['valentina.gomez', 'A', 24, 16, 7, 1],
  ['agostina.cabral', 'C', 2, 2, 0, 0], ['agustin.diaz', 'C', 1, 1, 0, 0], ['ana.varela', 'C', 16, 10, 6, 0],
  ['camila.quevedo', 'C', 2, 2, 0, 0], ['facundo.barrionuevo', 'C', 1, 1, 0, 0], ['gonzalo.canut', 'C', 2, 2, 0, 0],
  ['ismael.farias', 'C', 2, 1, 1, 0], ['ivon.ocaño', 'C', 14, 13, 1, 0], ['jazmin.orioni', 'C', 19, 14, 5, 0],
  ['macarena.basualdo', 'C', 1, 0, 1, 0], ['maico.ocaña', 'C', 3, 0, 3, 0], ['maria.jabour', 'C', 19, 16, 3, 0],
  ['martina.gomez', 'C', 31, 22, 9, 0], ['mayra.matrangulo', 'C', 16, 13, 3, 0], ['milena.quinteros', 'C', 15, 11, 3, 1],
  ['nancy.farias', 'C', 2, 2, 0, 0], ['nicolas.murua', 'C', 31, 17, 14, 0], ['noelia.farias', 'C', 17, 13, 4, 0],
  ['regina.olmedo', 'C', 40, 26, 12, 2], ['rocio.vidart', 'C', 3, 0, 1, 2], ['sofia.gonzalez', 'C', 17, 10, 7, 0],
  ['sofia.jabour', 'C', 39, 27, 10, 2], ['tiziana.martinez', 'C', 5, 2, 3, 0], ['tomas.fernandez', 'C', 1, 0, 1, 0], ['yamila.vega', 'C', 1, 1, 0, 0],
  ['agostina.cabral', 'E', 11, 5, 4, 2], ['alexander.montaño', 'E', 19, 14, 5, 0], ['camila.quevedo', 'E', 4, 3, 1, 0],
  ['daniela.gonzalez', 'E', 8, 6, 2, 0], ['facundo.barrionuevo', 'E', 9, 8, 0, 1], ['julieta.aguirre', 'E', 4, 4, 0, 0],
  ['milagros.oviedo', 'E', 4, 2, 2, 0], ['nancy.farias', 'E', 15, 7, 7, 1], ['tiziana.martinez', 'E', 1, 0, 1, 0], ['yamila.vega', 'E', 14, 11, 3, 0],
  ['antonella.correa', 'F', 8, 4, 3, 1], ['carla.perez', 'F', 7, 6, 0, 1], ['david.bosio', 'F', 11, 7, 1, 3],
  ['gabriel.aguirre', 'F', 5, 1, 3, 1], ['julian.albaro', 'F', 11, 7, 1, 3], ['martina.torres', 'F', 28, 21, 7, 0],
  ['nicolas.murua', 'F', 3, 2, 0, 1], ['nicole.gutierrez', 'F', 9, 6, 1, 2], ['paola.escalzo', 'F', 13, 8, 4, 1], ['santiago.repiso', 'F', 12, 9, 3, 0],
].map(([name, shift, totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources]) => (
  operator(name, shift, totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources)
))

const november22And23Operators = [
  ['antonella.cueva', 'B', 1, 1, 0, 0], ['celeste.suarez', 'B', 15, 14, 1, 0], ['delfina.paz', 'B', 12, 11, 1, 0],
  ['estefania.ybañez', 'B', 16, 10, 5, 1], ['fabricio.cabral', 'B', 41, 32, 9, 0], ['hernan.fuentes', 'B', 4, 3, 1, 0],
  ['ismael.farias', 'B', 4, 3, 1, 0], ['julieta.reynoso', 'B', 8, 6, 2, 0], ['julieta.rivarola', 'B', 14, 13, 0, 1],
  ['luisiana.unamuno', 'B', 18, 16, 1, 1], ['luz.nieto', 'B', 14, 8, 5, 1], ['martina.guzman', 'B', 1, 0, 1, 0],
  ['natalia.lujan', 'B', 1, 1, 0, 0], ['nicolas.uliarte', 'B', 1, 1, 0, 0], ['rocio.ferreyra', 'B', 13, 3, 9, 1],
  ['rocio.fuentecilla', 'B', 21, 16, 4, 1], ['tiziana.martinez', 'B', 1, 0, 1, 0],
  ['agustina.amaya', 'D', 15, 11, 4, 0], ['ana.gomez', 'D', 18, 16, 2, 0], ['antonella.carollo', 'D', 1, 1, 0, 0],
  ['antonella.cueva', 'D', 22, 18, 4, 0], ['carolina.rosso', 'D', 25, 19, 5, 1], ['cintia.ramos', 'D', 8, 6, 2, 0],
  ['dahyana.zamorano', 'D', 4, 2, 2, 0], ['david.bosio', 'D', 1, 1, 0, 0], ['facundo.barrionuevo', 'D', 9, 9, 0, 0],
  ['gabriel.aguirre', 'D', 4, 3, 1, 0], ['guada.gomez', 'D', 29, 24, 5, 0], ['malena.rosa', 'D', 12, 12, 0, 0],
  ['martina.guzman', 'D', 2, 0, 2, 0], ['martina.torres', 'D', 2, 0, 2, 0], ['mateo.acosta', 'D', 25, 20, 5, 0],
  ['mayco.patino', 'D', 32, 27, 5, 0], ['milena.quinteros', 'D', 18, 12, 4, 2], ['mondel.gomez', 'D', 3, 2, 1, 0],
  ['natalia.lujan', 'D', 15, 11, 4, 0], ['rocio.fuentecilla', 'D', 1, 1, 0, 0], ['veronica.paz', 'D', 28, 23, 3, 2], ['wilda.ponce', 'D', 23, 17, 5, 1],
  ['agostina.cabral', 'E', 10, 8, 2, 0], ['agustina.claucich', 'E', 3, 3, 0, 0], ['camila.quevedo', 'E', 13, 11, 1, 1],
  ['carla.lopez', 'E', 8, 6, 2, 0], ['daniela.gonzalez', 'E', 11, 6, 3, 2], ['fabricio.cabral', 'E', 1, 1, 0, 0],
  ['florencia.ojeda', 'E', 20, 8, 9, 3], ['franco.barrionuevo', 'E', 18, 17, 1, 0], ['hernan.fuentes', 'E', 4, 1, 1, 2],
  ['julieta.aguirre', 'E', 5, 3, 1, 1], ['luz.nieto', 'E', 2, 1, 0, 1], ['mia.ledesma', 'E', 30, 25, 5, 0],
  ['nancy.farias', 'E', 17, 10, 5, 2], ['valeria.rodriguez', 'E', 1, 1, 0, 0], ['yamila.vega', 'E', 12, 5, 3, 4], ['yazmin.abrego', 'E', 15, 14, 1, 0],
  ['barbara.gatica', 'F', 11, 7, 4, 0], ['carla.perez', 'F', 8, 7, 1, 0], ['david.bosio', 'F', 30, 14, 6, 10],
  ['elodina.barrera', 'F', 28, 18, 7, 3], ['gabriel.aguirre', 'F', 22, 13, 4, 5], ['gonzalo.canut', 'F', 3, 2, 1, 0],
  ['isabel.leiva', 'F', 15, 9, 2, 4], ['julian.albaro', 'F', 27, 19, 5, 3], ['maria.criado', 'F', 15, 7, 6, 2],
  ['martina.torres', 'F', 35, 21, 6, 8], ['mondel.gomez', 'F', 4, 4, 0, 0], ['nicole.gutierrez', 'F', 6, 5, 1, 0],
  ['paola.escalzo', 'F', 19, 12, 1, 6], ['santiago.repiso', 'F', 22, 9, 12, 1],
].map(([name, shift, totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources]) => (
  operator(name, shift, totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources)
))

const outsideAdjustments = (rows) => new Map(rows.map(([name, shift, totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources]) => [
  `${name}|${shift}`,
  { totalEvents, correctlyAssignedResources, incorrectlyAssignedResources, unassignedResources },
]))

const excludeOutsideQuadrant = (operators, adjustments) => operators.map((item) => {
  const excluded = adjustments.get(item.id)
  if (!excluded) return item
  return {
    ...item,
    totalEvents: item.totalEvents - excluded.totalEvents,
    correctlyAssignedResources: item.correctlyAssignedResources - excluded.correctlyAssignedResources,
    incorrectlyAssignedResources: item.incorrectlyAssignedResources - excluded.incorrectlyAssignedResources,
    unassignedResources: item.unassignedResources - excluded.unassignedResources,
  }
}).filter((item) => item.totalEvents > 0)

const outsideNovember14And15 = outsideAdjustments([
  ['antonella.correa', 'F', 2, 1, 1, 0], ['martina.torres', 'D', 1, 0, 1, 0], ['malena.rosa', 'D', 3, 0, 2, 1],
  ['antonella.cueva', 'D', 3, 2, 1, 0], ['julian.albaro', 'D', 1, 1, 0, 0], ['mayco.patino', 'D', 3, 1, 1, 1],
  ['mateo.acosta', 'D', 1, 1, 0, 0], ['ana.gomez', 'D', 2, 1, 1, 0], ['lorena.soria', 'B', 2, 0, 1, 1],
  ['rocio.ferreyra', 'B', 2, 0, 0, 2], ['julieta.rivarola', 'B', 1, 1, 0, 0], ['celeste.suarez', 'B', 2, 0, 1, 1],
  ['rocio.fuentecilla', 'B', 4, 1, 1, 2], ['ismael.farias', 'B', 1, 0, 1, 0], ['delfina.paz', 'B', 2, 0, 0, 2],
  ['agostina.cabral', 'E', 1, 1, 0, 0], ['milagros.oviedo', 'E', 1, 1, 0, 0], ['victoria.barraza', 'E', 1, 0, 1, 0],
  ['nancy.farias', 'E', 3, 0, 1, 2], ['alexander.montaño', 'E', 1, 0, 0, 1], ['facundo.barrionuevo', 'E', 1, 1, 0, 0], ['david.bosio', 'F', 1, 0, 0, 1],
  ['santiago.repiso', 'F', 1, 0, 0, 1], ['daniela.gonzalez', 'D', 1, 1, 0, 0], ['antonella.carollo', 'D', 1, 0, 1, 0],
  ['luisiana.unamuno', 'B', 1, 0, 0, 1], ['nicolas.uliarte', 'B', 1, 0, 0, 1], ['fabricio.cabral', 'B', 1, 0, 1, 0],
  ['hernan.fuentes', 'B', 2, 2, 0, 0], ['paola.escalzo', 'F', 1, 0, 0, 1], ['martina.torres', 'F', 2, 0, 0, 2],
  ['gabriel.aguirre', 'F', 1, 1, 0, 0], ['julian.albaro', 'F', 3, 0, 2, 1], ['mondel.gomez', 'F', 1, 0, 0, 1],
])

const outsideNovember16And17 = outsideAdjustments([
  ['agostina.cabral', 'E', 1, 0, 1, 0], ['regina.olmedo', 'C', 1, 0, 0, 1], ['rocio.vidart', 'C', 1, 0, 1, 0],
  ['mayra.matrangulo', 'C', 1, 1, 0, 0], ['milena.quinteros', 'C', 1, 0, 0, 1], ['sofia.gonzalez', 'C', 1, 1, 0, 0],
  ['sofia.jabour', 'C', 4, 2, 1, 1], ['nicolas.murua', 'C', 1, 0, 1, 0], ['valentina.gomez', 'A', 3, 0, 2, 1],
  ['florencia.ojeda', 'A', 1, 1, 0, 0], ['ismael.farias', 'A', 1, 0, 0, 1], ['nancy.farias', 'E', 2, 0, 1, 1],
  ['facundo.barrionuevo', 'E', 1, 0, 0, 1], ['ana.varela', 'C', 2, 1, 1, 0], ['tiziana.martinez', 'C', 1, 0, 1, 0],
  ['noelia.farias', 'C', 1, 1, 0, 0], ['agustina.amaya', 'A', 1, 1, 0, 0], ['santiago.guzman', 'A', 2, 1, 0, 1],
  ['gabriel.diaz', 'A', 1, 0, 1, 0], ['noelia.gorosito', 'A', 1, 0, 1, 0], ['julian.albaro', 'F', 2, 2, 0, 0], ['carla.perez', 'F', 1, 1, 0, 0],
])

const outsideNovember22And23 = outsideAdjustments([
  ['isabel.leiva', 'F', 2, 1, 0, 1], ['malena.rosa', 'D', 3, 3, 0, 0], ['wilda.ponce', 'D', 1, 1, 0, 0],
  ['carolina.rosso', 'D', 2, 1, 0, 1], ['julieta.rivarola', 'B', 2, 1, 0, 1], ['fabricio.cabral', 'B', 2, 0, 2, 0],
  ['rocio.ferreyra', 'B', 2, 0, 1, 1], ['luz.nieto', 'B', 3, 1, 1, 1], ['rocio.fuentecilla', 'B', 2, 1, 1, 0],
  ['luisiana.unamuno', 'B', 1, 0, 0, 1], ['maria.criado', 'F', 3, 0, 2, 1], ['julian.albaro', 'F', 1, 1, 0, 0],
  ['david.bosio', 'F', 2, 1, 1, 0], ['paola.escalzo', 'F', 3, 0, 0, 3], ['gabriel.aguirre', 'F', 2, 1, 0, 1],
  ['elodina.barrera', 'F', 1, 1, 0, 0], ['guada.gomez', 'D', 2, 2, 0, 0], ['gabriel.aguirre', 'D', 1, 0, 1, 0],
  ['milena.quinteros', 'D', 1, 0, 1, 0], ['cintia.ramos', 'D', 1, 1, 0, 0], ['veronica.paz', 'D', 1, 1, 0, 0],
  ['hernan.fuentes', 'E', 3, 0, 1, 2], ['nancy.farias', 'E', 2, 0, 0, 2], ['yazmin.abrego', 'E', 3, 3, 0, 0],
  ['florencia.ojeda', 'E', 2, 0, 0, 2], ['mia.ledesma', 'E', 1, 1, 0, 0], ['daniela.gonzalez', 'E', 1, 0, 0, 1],
  ['camila.quevedo', 'E', 1, 0, 0, 1], ['franco.barrionuevo', 'E', 1, 1, 0, 0], ['julieta.aguirre', 'E', 1, 0, 0, 1],
])

export const resourceOperatorsByPeriod = {
  '2026-11-22_2026-11-23': excludeOutsideQuadrant(november22And23Operators, outsideNovember22And23),
  '2026-11-16_2026-11-17': excludeOutsideQuadrant(november16And17Operators, outsideNovember16And17),
  '2026-11-14_2026-11-15': excludeOutsideQuadrant(november14And15Operators, outsideNovember14And15),
}
