function buildGeneralPanel(groupAssets) {
    let i = 0;

    for (let property in groupAssets.corpBond) {
        let listPanelGeneral = document
            .getElementById("listPanelGeneral")
            .insertRow(i);
        let col1 = listPanelGeneral.insertCell(0);
        let col2 = listPanelGeneral.insertCell(1);
        let col3 = listPanelGeneral.insertCell(2);
        let col4 = listPanelGeneral.insertCell(3);

        col1.innerHTML = i+1;
        col2.innerHTML = groupAssets.corpBond[property].ticker.usd;
        col3.innerHTML = groupAssets.corpBond[property].lastPrice.usd;
        col4.innerHTML = groupAssets.corpBond[property].ytmT2;

        i++;
    }
}
