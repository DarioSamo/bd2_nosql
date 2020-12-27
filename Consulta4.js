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

    return resFind.toArray();
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

    return resFind.toArray();
}

function consulta4() {
    var reservasAggr = db.reservas.aggregate(
        [
            {
                $group:
                {
                    _id: { $year: "$indice_tiempo" },
                    minR: { $min: "$reservas_internacionales_dolares" },
                }
            }
        ]
    );

    var ipcAggr = db.ipc.aggregate(
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

    var fechaMap = { };
    reservasAggr.forEach(element => {
        var year = element._id;
        var yearStr = year.toString();
        var minR = element.minR;
        var reserva = reservasminporanio(year, minR);
        for (element of reserva) {
            if (fechaMap.hasOwnProperty(yearStr)) {
                fechaMap[yearStr].push(element.indice_tiempo);
            }
            else {
                fechaMap[yearStr] = [element.indice_tiempo];
            }
        }
    });

    ipcAggr.forEach(element => {
        var year = element._id;
        var yearStr = year.toString();
        var minIPC = element.minIPC;
        var ipc = ipcminporanio(year, minIPC);
        for (element of ipc) {
            if (fechaMap.hasOwnProperty(yearStr)) {
                for (fecha of fechaMap[yearStr]) {
                    if (element.indice_tiempo == fecha) {
                        print("Existe una coincidencia entre IPC y Reservas en la fecha " + fecha);
                    }
                }
            }
        }
    });
}

consulta4();