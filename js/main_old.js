//Variables globales
const debug = true;

let arrayAssets;
let arrayLiveData;

//Clases

class asset {
    constructor(options = {}) {
        Object.assign(this, options);
    }

    getPrice(arrayLiveData) {
        for (let i=0; i < arrayLiveData.length; i++){
            if(arrayLiveData[i].symbol == this.ticker.ars){
                this.lastPrice.ars = arrayLiveData[i].closingPrice;
            }
            else if (arrayLiveData[i].symbol == this.ticker.usd){
                this.lastPrice.usd = arrayLiveData[i].closingPrice;
            }
        }

    }
}

//Funciones

async function fetchDataJSON(url) {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

async function retrieveCorpBondData() {
    //Variable locales
    let arrayAssets = [];

    //Datos base para cálculos
    let listAssets;
    await fetchDataJSON("./json/listAssets.json").then((json) => {
        console.log("Success retrieve List of Assets from Server Data");
        listAssets = json;
    });

    if (debug) {
        console.log(listAssets);
    }

    let dataAssets;
    let i = 0;
    for (var property in listAssets) {
        await fetchDataJSON("./json/" + listAssets[property] + ".json").then(
            (json) => {
                console.log(
                    "Success retrieve " +
                        listAssets[property] +
                        " from Server Data"
                );
                dataAssets = json;
            }
        );
        arrayAssets[i] = new asset(dataAssets);
        i++;

        if (debug) {
            console.log(dataAssets);
        }
    }
    return arrayAssets;
}

async function retrieveCorpBondLiveData() {
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
    let arrayLiveData = [];

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
            arrayLiveData = data;
        })
        .catch((error) => {
            console.error("Error:", error);
        });

    if (debug) {
        console.log(arrayLiveData);
    }

    return arrayLiveData;
}

async function main() {
    arrayAssets = await retrieveCorpBondData();
    arrayLiveData = await retrieveCorpBondLiveData();
}

main();
