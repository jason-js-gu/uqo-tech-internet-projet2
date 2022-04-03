//declare the variables
var messagesDiv=document.getElementById('messages-list');
var addressesDiv=document.getElementById('addresses-list');
var newMessageDiv=document.getElementById('new-message');
var messagesCounter=document.getElementById('messages-counter');
var addressesCounter=document.getElementById('addresses-counter');

var messages=[];
var messagesItems=document.getElementById('messages-items');        
var btnMessage=document.getElementById('btn-message');

var actionAddressDiv=document.getElementById('action-address');
var actionAddressItems=document.getElementById('addresses-action-items');

var addresses=[];
var addressesItems=document.getElementById('addresses-items');
var strAddresses=''; 

class Message{
    constructor(destination,text){
        this.destination=destination;
        this.text=text;
    }
}

class Address{
    constructor(owner,text){
        this.owner=owner;
        this.text=text;
    }
}



var headers = {
    "Content-Type": "application/json"
    }

var keyPair = forge.pki.rsa.generateKeyPair({bits: 1024}); 

var pubKeys = {
    'pubKey(self)':'-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEhehFi3cRuz+b2sNpCeBoh+cX\r\nl2k54vbqIOGqWyewwsn/GTwHHGCP+Scb/MerTEmmKqZ9Dimzpl7c01RBRHfhR9Oq\r\nwJNcJkg0C1pMjluv4gxVkBpoh8uvFWHT25G/mUNqc1eJyekBq6hzti4Vt20UXzoh\r\n/cz99LQzlNOOvL+MeQIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
    'pubKey1(pair1)':'-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIjsFXENKwI4cvQa02GpN0Dp/h\r\n1XrdEd4zPIjVLzo3iDn6iJ/0tje4mJNagFJGwDGIjywnH7LkcehlRuuc8vmD+NLs\r\nKPlwTMhNP9q3zo465kHdiIPdFZnXUL4wwe9BYS9WMb+Zr/ukQ/I4OdJNQS2jO3fl\r\nX8clv2gMVLGlOJqVkQIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
    'pubKey2(pair2)':'-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC02NrO6iCG0wD8/Q5uzZF+6vdx\r\nChtFZUr/jBG2PHlMAZ0BBFpu+uNQAuke+CAqyV/LdgBpQ+7A8cKXSuG8CBGvy6c7\r\nIEt65acXLtO5yszuQ7/3qToQUq92chsl9boIDBBr8/27NAqFb2Gp5IN/ZvgBZpkT\r\nvNrwPMUY7SNKMAno9QIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
}
  
var publicKey = document.getElementById('public-address').value;
var message = document.getElementById('message').value;

var encryptedMsg = forge.util.encode64(keyPair.publicKey.encrypt(forge.util.encodeUtf8(message)));
var decryptedMsg = forge.util.decodeUtf8(keyPair.privateKey.decrypt(forge.util.decode64(encryptedMsg)));

var data={
    'publicKey':document.getElementById('public-address').value,
    'message': document.getElementById('message').value
};

var add=()=>{
    fetch("http://localhost:8000/addLetter",{
    method: "POST",
    headers: headers,
    body: JSON.stringify({'test':'testdata'})           
}).then(res=>res.text())
    .then(text=>document.querySelector('#test').innerHTML=text)
    .catch(err=>document.querySelector('#test').innerHTML=err);
};

var getLetters=()=>{
fetch("http://localhost:8000/getLetters")
.then(res=>res.text())
.then(text=>document.querySelector("#messages").innerHTML=text)
.catch(err=>document.querySelector('#test').innerHTML=err);
}

var peers=()=>{
    fetch("http://localhost:8000/peers")
    .then(res=>res.text())
    .then(text=>document.querySelector("#messages").innerHTML=text)
    .catch(err=>document.querySelector('#test').innerHTML=err);
    }

// convert json string to html string
var json2Html=(text)=>{
    var str='';
    text=JSON.parse(text)
    var keys=Object.keys(text);        
    keys.forEach(element => {
        str+='<li>'+text[element]+'<span class="decrypte">Decrypte</span></li>';
    });
    str+='</ul>'
    return str;
}

//wait for the elements are ready
function rafAsync() {
    return new Promise(resolve => {
        requestAnimationFrame(resolve);
    });
}

async function checkElement(selector){
    var querySelector=null;
    while(querySelector===null){
        await rafAsync();
        querySelector = document.querySelectorAll(selector);
    }
    return querySelector;
};        


//display the list of all messages
function getMessages(){ 
    //disactivate the block of the addresses or of the new message
    //activate the block of the messagees 
    swithStateOfDivs([actionAddressDiv,addressesDiv,newMessageDiv],messagesDiv);

    var newmessages=JSON.parse(localStorage.getItem('new-messages'));
    strMessages='';
    for(let i=0; i<newmessages.length;i++){                
        strMessages+="<div class='item-detail'><input type='checkbox' name='itemMsg' id='itemMsg"+i.toString()+ "' onclick='delMod()'/><label>"+newmessages[i].text+"</label></div>";
    }
    messagesItems.innerHTML=strMessages;
    //
    messagesCounter.innerHTML=newmessages.length;
    delMod();
};


//display the interface of new message
function addMessage(){
    var dropdownAddresses=document.getElementById('dropdown-addresses');
    var strDropdownAddresses="<option value='0'>Choisir une adresse</option>";
    document.getElementById('message').value='';
    strAddresses='';            
    var newaddresses=JSON.parse(localStorage.getItem('new-addresses'));
    //console.log('new-ads:',newaddresses);
    //console.log('ads:',addresses);
    if(newaddresses){
        for(let i=0; i<newaddresses.length;i++){                    
            strDropdownAddresses+="<option value='"+(newaddresses[i].owner)+"'>"+newaddresses[i].owner+"</option>";
        }
    }
    
    //initialize the dropdown list of addresses
    dropdownAddresses.innerHTML=strDropdownAddresses;

    //swith the visibility of two buttons
    if(document.getElementById('btn-message').classList.contains('visibility')){
        document.getElementById('btn-message').classList.remove('visibility');
        document.getElementById('btn-mod-message').classList.add('visibility');
    }                

    //disactivate the block of the messages or of the addresses
    //activate the block of the new message
    swithStateOfDivs([actionAddressDiv,messagesDiv,addressesDiv],newMessageDiv);
};

//for now, when click on the button 'envoyer', the message will be saved as draft
function sendMessage(){
    var address=document.getElementById('dropdown-addresses').value;
    var message=document.getElementById('message').value;
    if(message){
        if(!address){
            alert('Message ira été stocké comme brouillon.');
        } 
        var nmsg=localStorage.getItem('new-messages');
        if(nmsg){
            var nmsgObj=JSON.parse(nmsg);
            nmsgObj[nmsgObj.length]=new Message(address,message);
            localStorage.setItem('new-messages',JSON.stringify(nmsgObj));
        }else{
            messages[messages.length]=new Message(address,message);
            localStorage.setItem('new-messages',JSON.stringify(messages));
        }                   
        getMessages();
    }else{
        alert('Message est obligatoire.');
    }             
};

//search and list the messages with keywords
function searchMessages(){
    var keyword=document.getElementById('messages-search').value.toLowerCase();
    var msg_list=JSON.parse(localStorage.getItem('new-messages'));            
    var new_msg_list=msg_list.filter((e)=>e.text.toLowerCase().includes(keyword));
    var new_msg_ids=[];
    new_msg_list.forEach((e)=>new_msg_ids[new_msg_ids.length]=msg_list.indexOf(e));            
    var str='';
    if(keyword){
        if(new_msg_list.length==0){
            str="<div class='item-detail'><label style='font-size:1.2rem'>Aucun résultat</label></div>";
        }else{
            for(let i=0; i<new_msg_list.length;i++){                
                str+="<div class='item-detail'><input type='checkbox' name='itemMsg' id='itemMsg"+new_msg_ids[i]+ "' onclick='delMod()'/><label>"+new_msg_list[i].text+"</label></div>";
            }
        }
        messagesItems.innerHTML=str;
        messagesCounter.innerHTML=new_msg_list.length;
    }else{
        getMessages();
    } 
};


//actions of checkboxes
//check all messsages
var checkAllMsg=document.getElementById('check-all-msg');
var msgCheckboxes=document.querySelectorAll('input[name=itemMsg]');
var msgCheckboxChecked=document.querySelectorAll('input[name=itemMsg]:checked');
var modMsg=document.getElementById('mod-msg');
var delMsg=document.getElementById('del-msg');

function toggleAllMsg(){
    toggleAllCheckboxes('itemMsg',checkAllMsg,modMsg,delMsg)
};


//delete selected message(s)
function delMessage(){
    var ids=[];
    var toRemoveMsg=[];
    var newmsg=JSON.parse(localStorage.getItem('new-messages'));
    checkElement('input[name=itemMsg]:checked').then((element) => {
        console.log(element[0].id);
        for(let i=0;i<element.length;i++){
            ids[i]=parseInt(element[i].id.split('itemMsg')[1]);
        }
        console.log('ids: ',ids[0]);
        for(let i=0;i<ids.length;i++){
            toRemoveMsg[i]=newmsg[ids[i]];
        }
        //console.log(toRemoveMsg[0]);
        //console.log(newmsg);
        newmsg=newmsg.filter((e)=>!toRemoveMsg.includes(e));
        localStorage.setItem('new-messages',JSON.stringify(newmsg));
        //console.log(newmsg);
        getMessages();            
    });   
    // deletionItem('new-messages','itemMsg',getMessages());         
};

//modify selected message
//fill the interface with the infos of the selected message
function modMessage(){
    var msg_checked=document.querySelectorAll('input[name=itemMsg]:checked')[0];
    msg_id=msg_checked.id.split('itemMsg')[1];
    var newmsg=JSON.parse(localStorage.getItem('new-messages'));
    var msg=newmsg[msg_id]; 
    //console.log('msg:',msg);           
    addMessage();
    //console.log(document.getElementById('dropdow-addresses'));
    checkElement('#new-message').then((element) => {                
        element[0].querySelector('#dropdown-addresses').value=msg.destination;
        //console.log('msg-ads:',msg.address);
        element[0].querySelector('#message').value=msg.text;
        element[0].querySelector('#msg-id').value=msg_id;
        element[0].querySelector('#btn-message').classList.add('visibility');
        element[0].querySelector('#btn-mod-message').classList.remove('visibility');
    });
};

//save modified message
function saveModMessage(){
    var address=document.getElementById('dropdown-addresses').value;            
    var message=document.getElementById('message').value;
    var msg_id=document.getElementById('msg-id').value;
    //console.log('ads:',address,msg_id);
    if(message){
        if(!address){
            alert('Message ira été stocké comme brouillon.');
        } 
        var nmsg=localStorage.getItem('new-messages');
        if(nmsg){
            var nmsgObj=JSON.parse(nmsg);
            nmsgObj[msg_id]=new Message(address,message);
            localStorage.setItem('new-messages',JSON.stringify(nmsgObj));
        }else{
            messages[messages.length]=new Message(address,message);
            localStorage.setItem('new-messages',JSON.stringify(messages));
        }                   
        getMessages();
    }else{
        alert('Message est obligatoire.');
    }  
};

//checkboxes action
function delMod(){ 
    actionModDel('itemMsg','messages-list',checkAllMsg,modMsg,delMsg);
};  



//display the list of all addresses
function getAddresses(){
    //disactivate the block of the messages or of the new message
    //activate the block of the addresses
    swithStateOfDivs([actionAddressDiv,newMessageDiv,messagesDiv],addressesDiv);            

    strAddresses='';
    var newads=JSON.parse(localStorage.getItem('new-addresses'));
    //console.log('newads-n:',newads);
    if(newads){                
        for(let i=0;i<newads.length;i++){
            strAddresses+="<div class='item-detail'><input type='checkbox' name='itemAds' id='itemAds"+i.toString()+ "' onclick='delModAds()' /><label>"+newads[i].owner+":<br>"+newads[i].text+"</label></div>";
            addressesCounter.innerHTML=newads.length;
        }
    }
    addressesItems.innerHTML=strAddresses;
    delModAds();
};


//search and list the addresses with keywords
function searchAddresses(){
    var keyword=document.getElementById('addresses-search').value.toLowerCase();
    var ads_list=JSON.parse(localStorage.getItem('new-addresses'));            
    var new_ads_list=ads_list.filter((e)=>e.text.toLowerCase().includes(keyword)+e.owner.toLowerCase().includes(keyword));
    var new_ads_ids=[];
    new_ads_list.forEach((e)=>new_ads_ids[new_ads_ids.length]=ads_list.indexOf(e));            
    var str='';
    if(keyword){
        if(new_ads_list.length==0){
            str="<div class='item-detail'><label style='font-size:1.2rem'>Aucun résultat</label></div>";
        }else{
            for(let i=0; i<new_ads_list.length;i++){                
                str+="<div class='item-detail'><input type='checkbox' name='itemAds' id='itemAds"+new_ads_ids[i]+ "' onclick='delModAds()'/><label>"+new_ads_list[i].owner+":<br>"+new_ads_list[i].text+"</label></div>";
            }
        }
        addressesItems.innerHTML=str;
        addressesCounter.innerHTML=new_ads_list.length;
    }else{
        getAddresses();
    } 
};


function addAdsInterface(){
    var owner=document.getElementById('owner').value='';
    var address=document.getElementById('address-content').value='';
    //swith the visibility of two buttons
    if(document.getElementById('btn-address').classList.contains('visibility')){
        document.getElementById('btn-address').classList.remove('visibility');
        document.getElementById('btn-mod-address').classList.add('visibility');
    } 
    //disactivate the block of the addresses or of the new message            
    // and activate the block of the messagees 
    swithStateOfDivs([addressesDiv,newMessageDiv,messagesDiv],actionAddressDiv);
};


//add a new address
function addAddress(){
    var owner=document.getElementById('owner').value;
    var address=document.getElementById('address-content').value;
    var newads=JSON.parse(localStorage.getItem('new-addresses'));
    if(owner && address){
        if(newads){
            newads[newads.length]=new Address(owner,address);
            localStorage.setItem('new-addresses',JSON.stringify(newads));
        }else{
            addresses[addresses.length]=new Address(owner,address);
            localStorage.setItem('new-addresses',JSON.stringify(addresses));
        }
        getAddresses();
    }else{
        alert('Tous les deux champs sont obligatoirs.')
    }
};


//modify an address
function modAddress(){
    var ads_checked=document.querySelectorAll('input[name=itemAds]:checked')[0];
    var ads_id=ads_checked.id.split('itemAds')[1];
    var newads=JSON.parse(localStorage.getItem('new-addresses'));
    var ads=newads[ads_id]; 
    //           
    addAdsInterface();
    //
    checkElement('#action-address').then((element) => {                
        element[0].querySelector('#owner').value=ads.owner;                
        element[0].querySelector('#address-content').value=ads.text;
        element[0].querySelector('#ads-id').value=ads_id;
        element[0].querySelector('#btn-address').classList.add('visibility');
        element[0].querySelector('#btn-mod-address').classList.remove('visibility');
    });
}

function saveModAddress(){
    var owner=document.getElementById('owner').value;            
    var address=document.getElementById('address-content').value;
    var ads_id=document.getElementById('ads-id').value;            
    if(owner && address){                 
        var nads=localStorage.getItem('new-addresses');
        if(nads){
            var nadsArr=JSON.parse(nads);
            nadsArr[ads_id]=new Address(owner,address);
            localStorage.setItem('new-addresses',JSON.stringify(nadsArr));
        }                   
        getAddresses();
    }else{
        alert('Tous les deux champs sont obligatoirs.');
    }
}

function delAddress(){
    var ids=[];
    var toRemoveAds=[];
    var newads=JSON.parse(localStorage.getItem('new-addresses'));
    checkElement('input[name=itemAds]:checked').then((element) => {
        //console.log(element[0].id);
        for(let i=0;i<element.length;i++){
            ids[i]=parseInt(element[i].id.split('itemAds')[1]);
        }
        //console.log('ids: ',ids[0]);
        for(let i=0;i<ids.length;i++){
            toRemoveAds[i]=newads[ids[i]];
        }                
        newads=newads.filter((e)=>!toRemoveAds.includes(e));
        localStorage.setItem('new-addresses',JSON.stringify(newads));                
        getAddresses();            
    }); 
};

var topCheckboxAds=document.getElementById('check-all-ads');
var modAds=document.getElementById('mod-ads');
var delAds=document.getElementById('del-ads');

function toggleAllAds(){
    toggleAllCheckboxes('itemAds',topCheckboxAds,modAds,delAds);
}        

function delModAds(){
    actionModDel('itemAds','addresses-list',topCheckboxAds,modAds,delAds);
}


/*begin of common methods*/
//switch the visibility of a series of divs
function swithStateOfDivs(arr,e){
    for(let i of arr){
        if(!i.classList.contains('visibility'))i.classList.add('visibility');
    }
    if(e.classList.contains('visibility'))e.classList.remove('visibility');
}

//switch the state of the top checkbox
function toggleAllCheckboxes(nameOfCheckbox,elementTopcheckbox,elementMod,elementDel){
    checkElement('input[name='+nameOfCheckbox+']').then((element) => {
        element.forEach(function(e){
            //change the state of each checkbox according the state of the top checkbox
            e.checked=elementTopcheckbox.checked;
        }); 
    });
    //deactivate modification option
    if(!elementMod.classList.contains('sub-visibility')){
        elementMod.classList.add('sub-visibility');
    }
    //change the state of the deletion option according to the state of the top checkbox
    elementDel.classList.toggle('sub-visibility');
};

//switch the state of the checkbox list
function actionModDel(nameOfCheckbox,idOfDiv,elementTopcheckbox,elementMod,elementDel){
    var all_chx_count=document.querySelectorAll('input[name='+nameOfCheckbox+']').length;
    var chx_checked_count=document.querySelectorAll('input[name='+nameOfCheckbox+']:checked').length;
    var action_items=document.getElementById(idOfDiv).querySelectorAll('.sub-visibility');
    elementTopcheckbox.indeterminate=chx_checked_count>0 && chx_checked_count<all_chx_count;

    if(elementTopcheckbox.indeterminate || (chx_checked_count==all_chx_count && chx_checked_count>0)){
        elementTopcheckbox.checked=true;
    }
    if(chx_checked_count==0)elementTopcheckbox.checked=false;
    //elementTopcheckbox.checked=chx_checked_count==all_chx_count;
    if(chx_checked_count==0){
        if(!elementMod.classList.contains('sub-visibility')){
            elementMod.classList.add('sub-visibility');
        }
        if(!elementDel.classList.contains('sub-visibility')){
            elementDel.classList.add('sub-visibility');
        }
    }else if(chx_checked_count==1){
        action_items.forEach(function(e){
            if(e.classList.contains('sub-visibility')){
                e.classList.remove('sub-visibility');
            }
        });
    }else{
        if(!elementMod.classList.contains('sub-visibility')){
            elementMod.classList.add('sub-visibility');
        }
    }
};

//add or send a new message or address
// function addOrSendContent(idOfDestination, idOfcontent, keyLocalStorage,arr,obj,foo){
//     var destination=document.getElementById(idOfDestination).value;
//     var content=document.getElementById(idOfcontent).value;
//     var localStorageObj=JSON.parse(localStorage.getItem(keyLocalStorage));
//     obj.destination=destination;
//     obj.content=content;           
//     if(destination && content){
//         if(localStorageObj){
//             localStorageObj[localStorageObj.length]=obj;
//             localStorage.setItem(keyLocalStorage,JSON.stringify(localStorageObj));
//         }else{
//             arr[arr.length]=obj;
//             localStorage.setItem(keyLocalStorage,JSON.stringify(arr));
//         }
//         //redirect to the list of content
//         foo;
//     }else{
//         alert('Tous les deux champs sont obligatoirs.')
//     }
// }


//delete one item or several items from the list
// function deletionItem(keyLocalStorage,nameOfCheckbox,fooOfList){
//     var ids=[];
//     var toRemove=[];
//     var localStorageArr=JSON.parse(localStorage.getItem(keyLocalStorage));
    
//     checkElement('input[name='+nameOfCheckbox+']').then((element)=>{
        
//         for(let i=0;i<element.length;i++){
//             if(element[i].checked){
//                 alert('h')
//                 ids[ids.length]=parseInt(element[i].id.split(nameOfCheckbox)[1]);
//             }                    
//         }
//         console.log('ids: ',ids[0]);
//         for(let i=0;i<ids.length;i++){
//             toRemove[i]=localStorageArr[ids[i]];
//         }
//         console.log(toRemove[0]);
//         localStorageArr=localStorageArr.filter((e)=>!toRemove.includes(e));
//         localStorage.setItem(keyLocalStorage,JSON.stringify(localStorageArr));
//         fooOfList;
//     });
// }

/*end of common methods*/