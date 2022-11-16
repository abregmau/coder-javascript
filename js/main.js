//Variables globales
const debug = true;
const todayDate = new moment();

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
        this.flow.dateNormalized = [];
        for (let i = 0; i < this.flow.date.length; i++) {
            this.flow.dateNormalized[i] = moment(
                this.flow.date[i],
                "DD/MM/YYYY"
            );
        }

        this.flow.cashFlow = [];
        for (let i = 0; i < this.flow.amort.length; i++) {
            if (todayDate < this.flow.dateNormalized[i]) {
                this.flow.cashFlow[i] =
                    this.flow.amort[i] + this.flow.interest[i];
            } else {
                this.flow.cashFlow[i] = 0;
            }
        }

        if (this.paymentCurrency == "USD") {
            this.flow.cashFlow.unshift(this.lastPrice.usd * -1);
            this.flow.dateNormalized.unshift(todayDate.clone());
            this.flow.dateNormalized[0].add(moment.duration("48:00:00"));

        } else if (this.paymentCurrency == "ARS") {
            this.flow.cashFlow.unshift(this.lastPrice.ars * -1);
            this.flow.dateNormalized.unshift(todayDate.clone());
            this.flow.dateNormalized[0].add(moment.duration("48:00:00"));

        }

        this.ytmT2 = (Math.sqrt((XIRR(this.flow.cashFlow, this.flow.dateNormalized)+1))-1)*2*100

        if(debug){
            console.log(this.ticker.usd + ': ' + this.ytmT2 + '%')
        }

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

        for (let property in listAssets) {
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

    getAllAdditionalData() {
        for (const property in this.corpBond) {
            this.corpBond[property].calcAdditionalData();
        }
    }
}

//Funciones

async function fetchDataJSON(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

async function main() {
    //arrayLiveData = await retrieveCorpBondLiveData();
    groupAssetsTest = new grupAssets();
    await groupAssetsTest.retrieveCorpBondData();
    await groupAssetsTest.retrieveCorpBondLiveData();
    groupAssetsTest.getAllPrice();

    groupAssetsTest.getAllAdditionalData();
    console.log(groupAssetsTest);

    buildGeneralPanel(groupAssetsTest);
}

main();
