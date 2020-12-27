// En la base de datos, ejecutar una conversion a fechas previamente.
// db.xiaomi.find().forEach(function(doc) { doc.stop_time = new ISODate(doc.stop_time); db.xiaomi.save(doc); })
// Se subió el precio a $4000 por la inflacion. :-)

var hoy = new ISODate();
var resFind = db.xiaomi.find({
    "seller.seller_reputation.transactions.ratings.positive": {
        $gt: 0.9
    },
    "seller.seller_reputation.metrics.sales.completed": {
        $gt: 1000
    },
    condition: "new",
    price: {
        $lt: 4000
    },
    stop_time: {
        $gt: hoy
    },
    attributes: {
        $elemMatch: { 
            id: "BRAND",
            value_name: "Xiaomi"
        },
        $elemMatch: { 
            id: "MODEL",
            value_name: "Mi Band 5"
        }
    }
},
{
    id: 1,
    seller: {
        id: 1
    },
    permalink: 1
});

var resultados = resFind.toArray();
print("Se encontraron " + resFind.size() + " resultados.");
for (element of resultados) {
    printjson(element);
}
