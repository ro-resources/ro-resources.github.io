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

    if (type == "iteminfo") {
        document.getElementById('loadding').classList.remove('hidden');
        iteminfo(file);
    }
}

function iteminfo(file) {
    
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
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
                            itemDesc.push(itemDesc[itemDesc.length-1].replace(itemDesc[itemDesc.length-1].replace(/\s+/, ""), '"ID : ^777777' + itemID + '^000000"'));
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