const popupInfoTitle = document.getElementById("modalInfo__title"),
    popupInfoDescription = document.getElementById("modalInfo__desciption"),
    popupInfoExpiration = document.getElementById("modalInfo__expiration"),
    popupInfoLastPriceARS = document.getElementById("modalInfo__lastPriceARS"),
    popupInfoLastPriceUSD = document.getElementById("modalInfo__lastPriceUSD"),
    popupInfoPaymentCurrency = document.getElementById("modalInfo__paymentCurrency"),
    popupInfoYtmT2 = document.getElementById("modalInfo__ytmT2");

function buildGeneralPanel(groupAssets) {
    let i = 0;

    for (let property in groupAssets.corpBond) {
        let listPanelGeneral = document.getElementById("listPanelGeneral").insertRow(i);
        let col1 = listPanelGeneral.insertCell(0);
        let col2 = listPanelGeneral.insertCell(1);
        let col3 = listPanelGeneral.insertCell(2);
        let col4 = listPanelGeneral.insertCell(3);
        let col5 = listPanelGeneral.insertCell(4);
        let col6 = listPanelGeneral.insertCell(5);

        let name = `${groupAssets.corpBond[property].ticker.ars} / ${groupAssets.corpBond[property].ticker.usd}`;

        col1.innerHTML = i + 1;
        col2.innerHTML = `<a data-bs-toggle="modal" data-bs-target="#modalInfo" id="${property}" class="overLinks">${name}</a>`;
        col3.innerHTML = groupAssets.corpBond[property].lastPrice.ars.toFixed(2);
        col4.innerHTML = groupAssets.corpBond[property].lastPrice.usd.toFixed(2);
        col5.innerHTML = groupAssets.corpBond[property].lastPrice.ccl.toFixed(2);
        col6.innerHTML = groupAssets.corpBond[property].ytmT2.toFixed(2);

        const btnAsset = document.getElementById(property);
        btnAsset.onclick = () => {
            popupInfoTitle.innerHTML = name;
            popupInfoDescription.innerHTML = `Descripción:  ${groupAssets.corpBond[property].description}`;
            popupInfoExpiration.innerHTML = `Fecha vencimiento:  ${groupAssets.corpBond[property].expiration}`;
            popupInfoLastPriceARS.innerHTML = `Último precio ARS:  $ ${groupAssets.corpBond[property].lastPrice.ars.toFixed(2)}`;
            popupInfoLastPriceUSD.innerHTML = `Último precio USD:  u$d ${groupAssets.corpBond[property].lastPrice.usd.toFixed(2)}`;
            popupInfoPaymentCurrency.innerHTML = `Moneda de pago:  ${groupAssets.corpBond[property].paymentCurrency}`;
            popupInfoYtmT2.innerHTML = `TIR:  ${groupAssets.corpBond[property].ytmT2.toFixed(2)} %`;
        };

        i++;
    }
}
