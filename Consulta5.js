function cons1Promedios() {
    var resAggr = db.liquidez.aggregate(
        [
            {
                $group:
                {
                    _id: null,
                    avgCC: { $avg: "$cuenta_corriente_pesos" },
                    avgCA: { $avg: "$caja_ahorro" }
                }
            }
        ]
    );

    var resultado = resAggr.toArray()[0];
    print("CC Promedio: $" + resultado.avgCC);
    print("CA Promedio: $" + resultado.avgCA);
}

function cons2Promedios() {
    var resAggr = db.reservas.aggregate(
        [
            {
                $group:
                {
                    _id: null,
                    avgReservas: { $avg: "$reservas_internacionales_dolares" }
                }
            }
        ]
    );

    var resultado = resAggr.toArray()[0];
    print("Reservas internacionales Promedio: $" + resultado.avgReservas);
}

cons1Promedios();
cons2Promedios();