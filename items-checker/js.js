function runCheck () {
    let iteminfo = document.getElementById('iteminfo').files[0];
    let item_db = document.getElementById('item_db').files[0];
    let item_db2 = document.getElementById('item_db2').files[0];
    
    if (iteminfo && item_db) {
        var reader = new FileReader();
        iteminfoData = null;
        itemDbData = null;
        itemDb2Data = null;

        // Read iteminfo
        reader.readAsText(iteminfo, "UTF-8");
        reader.onload = function (evt) {
            iteminfoData = evt.target.result.split('\n');
            
            // Read item_db
            reader.readAsText(item_db, "UTF-8");
            reader.onload = function (evt) {
                itemDbData = evt.target.result.split('\n');

                if (item_db2) {
                    // Read item_db2
                    reader.readAsText(item_db2, "UTF-8");
                    reader.onload = function (evt) {
                        itemDb2Data = evt.target.result.split('\n');
                        checker(iteminfoData, itemDbData, itemDb2Data);
                        return;
                    }
                } else {
                    checker(iteminfoData, itemDbData);
                }
            }            
        }
    } else {
        alert("File!!!");
    }
}

function checker(iteminfoData, itemDbData, itemDb2Data = null) {
    // if (itemDb2Data) {
    //     itemDbData = itemDbData.concat(itemDb2Data);
    // }
    itemIds = getIteminfoIds(iteminfoData);

    let regex = /(^\d{1,})([,])/;
    let lineData = itemDbData.length;
    let content = "";
    let contentHTML = "";
    let countMissing = 0;
    for (let index = 0; index < lineData; index++) {
        match = itemDbData[index].match(regex);
        if (match) {
            if (!itemIds.includes(match["1"])) {
                content = content + "// " + itemDbData[index] + '\n';
                contentHTML = contentHTML + '<span class="error"><span class="line">' + (index+1) + '</span>' + itemDbData[index] + '</span>';

                countMissing++;                
            } else {
                content = content + itemDbData[index] + '\n';
                contentHTML = contentHTML + '<span class="fine"><span class="line">' + (index+1) + '</span>' + itemDbData[index] + '</span>';
            }
        } else {
            content = content + itemDbData[index] + '\n';
            contentHTML = contentHTML + '<span class="fine"><span class="line">' + (index+1) + '</span>' + itemDbData[index] + '</span>';
        }
    }
    document.getElementById("content_item_db").innerHTML = contentHTML;
    
    console.log(document.getElementsByClassName("count-missing"));
    
    document.getElementsByClassName("count-missing").innerHTML = countMissing.toString();

    
    
}

function getIteminfoIds(iteminfoData) {
    let lineInfo = iteminfoData.length;
    let regex = /\s([\[])([0-9]{1,})([\]]) = {/;
    let itemIds = [];
    for (let index = 0; index < lineInfo; index++) {
        match = iteminfoData[index].match(regex);
        if (match) {
            itemIds.push(match["2"]);
        }
    }
    return itemIds;
}