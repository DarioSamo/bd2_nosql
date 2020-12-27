function cons3Promedios() {
    var resAggr = db.ipc.aggregate(
        [
            {
                $group:
                {
                    _id: null,
                    avgIPC: { $avg: "$ipc" }
                }
            }
        ]
    );

    var resultado = resAggr.toArray()[0];
    print("IPC Promedio: $" + resultado.ipc);
}

function ipcminporanio(year, minIPC) {
    var resFind = db.ipc.find(
        {
            indice_tiempo: {
                $gte: ISODate(year + "-01-01T00:00:00.000Z"),
                $lte: ISODate(year + "-12-31T23:59:59.999Z")
            },
            ipc: minIPC
        },
        {
            indice_tiempo: 1,
            ipc: 1
        }
    );

    print("Se encontraron " + resFind.size() + " resultados para " + year + " con minimo IPC " + minIPC);
    resFind.forEach(findElem => {
        printjson(findElem);
    });
}

function cons3MaxMin() {
    var results = db.ipc.aggregate(
        [
            {
                $group:
                {
                    _id: { $year: "$indice_tiempo" },
                    maxIPC: { $max: "$ipc" },
                    minIPC: { $min: "$ipc" }
                }
            }
        ]
    );

    results.forEach(element => {
        var year = element._id;
        var minIPC = element.minIPC;
        ipcminporanio(year, minIPC);
    });
}

cons3Promedios();
cons3MaxMin();