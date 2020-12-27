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

function caminporanio(year, minCA) {
    var resFind = db.liquidez.find(
        {
            indice_tiempo: {
                $gte: ISODate(year + "-01-01T00:00:00.000Z"),
                $lte: ISODate(year + "-12-31T23:59:59.999Z")
            },
            caja_ahorro: minCA
        },
        {
            indice_tiempo: 1,
            caja_ahorro: 1
        }
    );

    print("Se encontraron " + resFind.size() + " resultados para " + year + " con minimo CA " + minCA);
    resFind.forEach(findElem => {
        printjson(findElem);
    });
}

function ccminporanio(year, minCC) {
    var resFind = db.liquidez.find(
        {
            indice_tiempo: {
                $gte: ISODate(year + "-01-01T00:00:00.000Z"),
                $lte: ISODate(year + "-12-31T23:59:59.999Z")
            },
            cuenta_corriente_pesos: minCC
        },
        {
            indice_tiempo: 1,
            cuenta_corriente_pesos: 1
        }
    );

    print("Se encontraron " + resFind.size() + " resultados para " + year + " con minimo CC " + minCC);
    resFind.forEach(findElem => {
        printjson(findElem);
    });
}

function cons1MaxMin() {
    var results = db.liquidez.aggregate(
        [
            {
                $group:
                {
                    _id: { $year: "$indice_tiempo" },
                    maxCC: { $max: "$cuenta_corriente_pesos" },
                    minCC: { $min: "$cuenta_corriente_pesos" },
                    maxCA: { $max: "$caja_ahorro" },
                    minCA: { $min: "$caja_ahorro" }
                }
            }
        ]
    );

    results.forEach(element => {
        var year = element._id;
        var minCA = element.minCA;
        var minCC = element.minCC;
        caminporanio(year, minCA);
        ccminporanio(year, minCC);
    });
}

cons1Promedios();
cons1MaxMin();