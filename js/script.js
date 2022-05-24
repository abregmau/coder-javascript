class assetMarket {
    constructor (typeAsset, ticker, lastPrice) {
        this.typeAsset = typeAsset;
        this.ticker = ticker.toUpperCase();
        this.lastPrice = parseFloat(lastPrice);
    }
}

// Array of objects

let dashboard = [];
dashboard.push(new assetMarket("crypto", "BTCUSDT","32000"));
dashboard.push(new assetMarket("crypto", "ETHUSDT","3000"));
dashboard.push(new assetMarket("crypto", "USDTUSD","1.01"));
dashboard.push(new assetMarket("currency", "ARSUSDT", "210"));
dashboard.push(new assetMarket("currency", "EURUSD","1.07"));
dashboard.push(new assetMarket("bond", "AL30D","26"));
dashboard.push(new assetMarket("bond", "AL30","5502"));
dashboard.push(new assetMarket("bond", "GD30D","29.71"));
dashboard.push(new assetMarket("bond", "GD30","6255"));

for (let i = 0 ; i < dashboard.length ; i++) {
    let dato = dashboard[i];
    console.log(dato.typeAsset, dato.ticker, dato.lastPrice);
}

let priceAL30 = 0
let priceAL30D = 0

for (let i = 0 ; i < dashboard.length ; i++) {
    let dato = dashboard[i];
    if (dato.ticker == "AL30") {
        priceAL30 = dato.lastPrice;
    }
    if (dato.ticker == "AL30D") {
        priceAL30D = dato.lastPrice;   
    }
}


let dolarMEP = priceAL30/priceAL30D
console.log("Dolar MEP: ", dolarMEP)