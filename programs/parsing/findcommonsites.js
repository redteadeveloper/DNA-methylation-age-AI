const fs = require('fs')
const es = require('event-stream')

const intersection = (a1 = [], a2 = []) => {
    const s = new Set(a1)
    return a2.filter(x => s.has(x))
}

var sites1 = []
var sites2 = []

var s1 = fs.createReadStream('../GSE40279/GSE40279_series_matrix.txt')
    .pipe(es.split())
    .pipe(es.mapSync(function (line) {
        s1.pause()
        if (line.toString().startsWith("\"cg")) {
            sites1.push(line.toString().slice(0, 12).replaceAll("\"", ""))
        }
        s1.resume()
    })
        .on('error', function (err) {
            console.log('Error:', err)
        })
        .on('end', function () {
            console.log('Finish reading.')

            var s2 = fs.createReadStream('../GSE72775/GSE72775_datBetaNormalized.csv')
                .pipe(es.split())
                .pipe(es.mapSync(function (line) {
                    s2.pause()
                    if (line.toString().startsWith("\"cg")) {
                        sites2.push(line.toString().slice(0, 12).replaceAll("\"", ""))
                    }
                    s2.resume()
                })
                    .on('error', function (err) {
                        console.log('Error:', err)
                    })
                    .on('end', function () {
                        console.log('Finish reading.')

                        console.log(sites1.length)
                        console.log(sites2.length)
                        console.log(intersection(sites1, sites2).length)

                        fs.writeFile("result.txt", intersection(sites1, sites2).toString(), err => {
                            if (err) throw err;
                            console.log('File successfully written to disk');
                        })
                    })
                )

        })
    )