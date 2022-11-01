//Variables globales
const debug = false;
const todayDate = new Date();

//Clases

class asset {
    constructor(options = {}) {
        Object.assign(this, options);
    }

    getPrice(arrayLiveData) {
        for (let i = 0; i < arrayLiveData.length; i++) {
            if (arrayLiveData[i].symbol == this.ticker.ars) {
                if (arrayLiveData[i].closingPrice == 0.0) {
                    this.lastPrice.ars = arrayLiveData[i].previousClosingPrice;
                } else {
                    this.lastPrice.ars = arrayLiveData[i].closingPrice;
                }
            } else if (arrayLiveData[i].symbol == this.ticker.usd) {
                if (arrayLiveData[i].closingPrice == 0.0) {
                    this.lastPrice.usd = arrayLiveData[i].previousClosingPrice;
                } else {
                    this.lastPrice.usd = arrayLiveData[i].closingPrice;
                }
            }
        }
    }

    calcAdditionalData() {
        this.flow.dateISO = [];
        for (let i=0; i < this.flow.date.length; i++) {
            this.flow.dateISO[i] = convertFromStringToDate(this.flow.date[i]);
        }

        this.flow.cashFlow = [];
        for (let i=0; i < this.flow.amort.length; i++) {
            if (todayDate < this.flow.dateISO[i]){
                this.flow.cashFlow[i] = this.flow.amort[i] + this.flow.interest[i];
            }
            else {
                this.flow.cashFlow[i] = 0;
            }
        }

        console.log(XIRR()*100)
        //ytmT2 = 0;
    }
}

class grupAssets {
    constructor() {
        this.corpBond = {};
        this.liveData = [];
    }

    async retrieveCorpBondData() {
        //Variable locales
        let listAssets;
        let dataAssets;

        //Datos base para cálculos

        await fetchDataJSON("./json/listAssets.json").then((json) => {
            console.log("Success retrieve List of Assets from Server Data");
            listAssets = json;
        });

        if (debug) {
            console.log(listAssets);
        }

        for (var property in listAssets) {
            await fetchDataJSON(
                "./json/" + listAssets[property] + ".json"
            ).then((json) => {
                console.log(
                    "Success retrieve " +
                        listAssets[property] +
                        " from Server Data"
                );
                dataAssets = json;
            });
            this.corpBond[listAssets[property]] = new asset(dataAssets);

            if (debug) {
                console.log(dataAssets);
            }
        }
    }

    async retrieveCorpBondLiveData() {
        //Variables Locales
        const data = {
            excludeZeroPxAndQty: true,
            T2: true,
            T1: false,
            T0: false,
            "Content-Type": "application/json",
        };
        const urlCorpBond =
            "https://open.bymadata.com.ar/vanoms-be-core/rest/api/bymadata/free/negociable-obligations";

        //Datos

        await fetch(urlCorpBond, {
            method: "POST", // or 'PUT'
            headers: {
                Connection: "keep-alive",
                "sec-ch-ua":
                    '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "sec-ch-ua-mobile": "?0",
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
                "sec-ch-ua-platform": '"Windows"',
                Origin: "https://open.bymadata.com.ar",
                "Sec-Fetch-Site": "same-origin",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Dest": "empty",
                Referer: "https://open.bymadata.com.ar/",
                "Accept-Language": "es-US,es-419;q=0.9,es;q=0.8,en;q=0.7",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("Success retrieve Live Data from Api Bymadata");
                this.liveData = data;
            })
            .catch((error) => {
                console.error("Error:", error);
            });

        if (debug) {
            console.log(this.liveData);
        }
    }

    getAllPrice() {
        for (const property in this.corpBond) {
            this.corpBond[property].getPrice(this.liveData);
        }
    }
}

//Funciones

function convertFromStringToDate (dateString){
    let datePieces = dateString.split('/');
    return (new Date(datePieces[2], datePieces[1] - 1, datePieces[0]));
}

async function fetchDataJSON(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

function XIRR(values, dates, guess) {
    // Algorithm inspired by Apache OpenOffice

    // Calculates the resulting amount
    var irrResult = function (values, dates, rate) {
        var r = rate + 1;
        var result = values[0];
        for (var i = 1; i < values.length; i++) {
            result +=
                values[i] /
                Math.pow(
                    r,
                    moment(dates[i]).diff(moment(dates[0]), "days") / 365
                );
        }
        return result;
    };

    // Calculates the first derivation
    var irrResultDeriv = function (values, dates, rate) {
        var r = rate + 1;
        var result = 0;
        for (var i = 1; i < values.length; i++) {
            var frac = moment(dates[i]).diff(moment(dates[0]), "days") / 365;
            result -= (frac * values[i]) / Math.pow(r, frac + 1);
        }
        return result;
    };

    // Check that values contains at least one positive value and one negative value
    var positive = false;
    var negative = false;
    for (var i = 0; i < values.length; i++) {
        if (values[i] > 0) positive = true;
        if (values[i] < 0) negative = true;
    }

    // Return error if values does not contain at least one positive value and one negative value
    if (!positive || !negative) return "#NUM!";

    // Initialize guess and resultRate
    var guess = typeof guess === "undefined" ? 0.1 : guess;
    var resultRate = guess;

    // Set maximum epsilon for end of iteration
    var epsMax = 1e-10;

    // Set maximum number of iterations
    var iterMax = 50;

    // Implement Newton's method
    var newRate, epsRate, resultValue;
    var iteration = 0;
    var contLoop = true;
    do {
        resultValue = irrResult(values, dates, resultRate);
        newRate =
            resultRate -
            resultValue / irrResultDeriv(values, dates, resultRate);
        epsRate = Math.abs(newRate - resultRate);
        resultRate = newRate;
        contLoop = epsRate > epsMax && Math.abs(resultValue) > epsMax;
    } while (contLoop && ++iteration < iterMax);

    if (contLoop) return "#NUM!";

    // Return internal rate of return
    return resultRate;
}

async function main() {
    //arrayLiveData = await retrieveCorpBondLiveData();
    groupAssetsTest = new grupAssets();
    await groupAssetsTest.retrieveCorpBondData();
    await groupAssetsTest.retrieveCorpBondLiveData();
    groupAssetsTest.getAllPrice();
    console.log(groupAssetsTest);
}

main();
