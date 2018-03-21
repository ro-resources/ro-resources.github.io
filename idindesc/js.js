function addId(type) {
    file = document.getElementById(type).files[0];
    if (!file) {
        alert('Please select your file!')
        return;
    }

    document.getElementById("download").innerHTML = '';
    button = document.createElement('button');
    button.innerHTML = "Download";
    document.getElementById("download").appendChild(button);

    document.getElementById('loadding').classList.remove('hidden');

    if (type == "iteminfo") {
        iteminfo(file);
    } else if (type == "idnum2itemdesctable") {
        idnum2itemdesctable(file);
    }
}

function idnum2itemdesctable(file) {
    var reader = new FileReader();
    reader.readAsText(file, "ISO-8859-1");
    reader.onload = function (evt) {
        let items = evt.target.result.split('\n#');
        let regexId = /(\d{1,})[\#]/;
        let itemId = 0;
        let idnum2itemdesctable = '';

        for (let iItem = 0; iItem < items.length; iItem++) {
            let itemLines = items[iItem].split('\n');

            for (let iLine = 0; iLine < itemLines.length; iLine++) {
                matchId = itemLines[iLine].match(regexId);
                if (matchId) {
                    itemId = matchId["1"];
                    itemLines.push('ID :^777777 ' + itemId + '^000000');
                }
            }
            idnum2itemdesctable = idnum2itemdesctable + itemLines.join('\n');

            if (iItem < items.length-1) {
                idnum2itemdesctable = idnum2itemdesctable + '\n#';
            }
        }

        // idnum2itemdesctable
        document.querySelector('.output .filename').innerHTML = 'idnum2itemdesctable.txt';

        document.getElementById('loadding').classList.add('hidden');
        document.getElementById('output').classList.remove('hidden');

        document.querySelector("#download button").addEventListener("click", function(event){
            let blob = new Blob([idnum2itemdesctable], {type: "text/plain"});
            saveAs(blob, "idnum2itemdesctable.txt");
        }, false);

    }
}

function iteminfo(file) {

    var reader = new FileReader();
    reader.readAsText(file, "ISO-8859-1");
    reader.onload = function (evt) {
        let itemInfoData = evt.target.result.split('\n');

        let regexID = /\s([\[])(\d{1,})([\]]) = {/;
        let regexDesc = /\sidentifiedDescriptionName = {$/;
        let regexEndBlock = /\s},/;
        let iteminfo = '';

        for (let index = 0; index < itemInfoData.length; index++) {
            matchItemID = itemInfoData[index].match(regexID);
            if (matchItemID) {
                itemID = matchItemID["2"];
            }

            idDescTitle = itemInfoData[index].match(regexDesc);
            if (idDescTitle) {
                indexDesc = index+1;
                let itemDesc = [];
                itemDesc.push(itemInfoData[index]);
                for (indexDesc; indexDesc < itemInfoData.length; indexDesc++) {
                    if (itemInfoData[indexDesc].match(regexEndBlock)) {
                        itemDesc[itemDesc.length-1] = itemDesc[itemDesc.length-1] + ',';
                        if (itemID) {
                            itemDesc.push(itemDesc[itemDesc.length-1].replace(itemDesc[itemDesc.length-1].replace(/\s+/, ""), '"ID :^777777 ' + itemID + '^000000"'));
                        }
                        itemDesc.push(itemInfoData[indexDesc]);
                        break;
                    }

                    itemDesc.push(itemInfoData[indexDesc]);
                }
                iteminfo = iteminfo + itemDesc.join('\n') + '\n';

                index = indexDesc;
            } else {
                iteminfo = iteminfo + itemInfoData[index] + '\n';
            }

        }

        // iteminfo
        document.querySelector('.output .filename').innerHTML = 'iteminfo.lua';
        // document.querySelector('.output textarea').innerHTML = iteminfo;

        document.getElementById('loadding').classList.add('hidden');
        document.getElementById('output').classList.remove('hidden');

        document.querySelector("#download button").addEventListener("click", function(event){
            let blob = new Blob([iteminfo], {type: "text/plain"});
            saveAs(blob, "iteminfo.lua");
        }, false);
    }

}
