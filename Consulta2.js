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

function reservasminporanio(year, minreservas) {
    var resFind = db.reservas.find(
        {
            indice_tiempo: {
                $gte: ISODate(year + "-01-01T00:00:00.000Z"),
                $lte: ISODate(year + "-12-31T23:59:59.999Z")
            },
            reservas_internacionales_dolares: minreservas
        },
        {
            indice_tiempo: 1,
            reservas_internacionales_dolares: 1
        }
    );

    print("Se encontraron " + resFind.size() + " resultados para " + year + " con minimas reservas " + minreservas);
    resFind.forEach(findElem => {
        printjson(findElem);
    });
}

function cons2MaxMin() {
    var results = db.reservas.aggregate(
        [
            {
                $group:
                {
                    _id: { $year: "$indice_tiempo" },
                    maxR: { $max: "$reservas_internacionales_dolares" },
                    minR: { $min: "$reservas_internacionales_dolares" },
                }
            }
        ]
    );

    results.forEach(element => {
        var year = element._id;
        var minR = element.minR;
        reservasminporanio(year, minR);
    });
}

cons2Promedios();
cons2MaxMin();