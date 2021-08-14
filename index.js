'use strict'

const fs = require('fs');
const csv = require('fast-csv');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv;

// Si no encuentra los parámetros
var format = argv.format || 'sql';

if (!argv.file) throw "Argument 'file' not found, try execute using --file <value>";
if (format == 'sql' && !argv.table) throw "Argument 'table' not found, try execute using --table <value>";
if (format == 'sql' && !argv.columns) throw "Argument 'columns' not found, try execute using --columns <value>";

var name = argv.name || 'exported';
var sql = `INSERT INTO ${argv.table} (${argv.columns}) VALUES {value}`;
var parts = format == 'sql' ? argv.columns.replace(/\(|\)| /g, '').split(',') : [];
var values = [];

console.info("Init parsing.....");

fs.createReadStream(argv.file)
    .pipe(csv.parse({ headers: true, delimiter: ';' }))
    .on('error', error => console.error(error))
    .on('data', row => {
        try {

            // Si es sql
            if (format == 'sql') {
                let valuesReg = [];

                for (const p of parts) {
                    valuesReg.push(row[p] ? '"' + `${row[p].replace(/,|\"/)}` + '"' : '""');
                }

                // if (valuesReg.length != 3) valuesReg.push('fallo');
                values.push(`(${valuesReg.join(',')})`);
            }
            else if (format == 'json') {
                values.push(row);
            }

            console.info(".");
        } catch (error) {
            console.error(error);
        }
    })
    .on('end', (rowCount) => {

        // Si a carpeta no existe
        if (!fs.existsSync('./exported')) fs.mkdirSync('./exported');

        fs.writeFile(`./exported/${name}.${format}`,
            format == 'sql' ? sql.replace('{value}', values.join(',\n')) : JSON.stringify(values, null, "\t"),
            function (err) {
                if (err) throw err;
                console.log(`CSV Exported in exported/${name}.${format} file`);
            });
        console.log(`Parsed ${rowCount} rows`)
    });