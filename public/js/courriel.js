//declare the variables
var messagesDiv=document.getElementById('messages-list');
var addressesDiv=document.getElementById('addresses-list');
var newMessageDiv=document.getElementById('new-message');
var messagesItems=document.getElementById('messages-items');        
var actionAddressDiv=document.getElementById('action-address');
var addressesItems=document.getElementById('addresses-items');
var msgAddress = document.getElementById('dropdown-addresses');

//function to get encrypt and decrypt key pairs
var getKeyPair = () => {    
    var keyPair, pem = localStorage.getItem("pem");
    if (pem) {
      privateKey = forge.pki.privateKeyFromPem(pem);
      publicKey = forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);
      keyPair = {privateKey, publicKey};
    } else {
      keyPair = forge.pki.rsa.generateKeyPair({bits: 1024});
      localStorage.setItem("pem",forge.pki.privateKeyToPem(keyPair.privateKey));
    };
    return keyPair;
};

//get keypair
var keyPair = getKeyPair();

var headers = {
    "Content-Type": "application/json"
}

var pubKeys = {
    'pubKey(self)':forge.pki.publicKeyToPem(keyPair.publicKey),
    'pubKey1(pair1)':'-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIjsFXENKwI4cvQa02GpN0Dp/h\r\n1XrdEd4zPIjVLzo3iDn6iJ/0tje4mJNagFJGwDGIjywnH7LkcehlRuuc8vmD+NLs\r\nKPlwTMhNP9q3zo465kHdiIPdFZnXUL4wwe9BYS9WMb+Zr/ukQ/I4OdJNQS2jO3fl\r\nX8clv2gMVLGlOJqVkQIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
    'pubKey2(pair2)':'-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC02NrO6iCG0wD8/Q5uzZF+6vdx\r\nChtFZUr/jBG2PHlMAZ0BBFpu+uNQAuke+CAqyV/LdgBpQ+7A8cKXSuG8CBGvy6c7\r\nIEt65acXLtO5yszuQ7/3qToQUq92chsl9boIDBBr8/27NAqFb2Gp5IN/ZvgBZpkT\r\nvNrwPMUY7SNKMAno9QIDAQAB\r\n-----END PUBLIC KEY-----\r\n',
}

localStorage.setItem('addresses',JSON.stringify(pubKeys));
 
//initialize the dropdown list of addresses
var initMsgAddress=()=>{
    swithStateOfDivs([actionAddressDiv,messagesDiv,addressesDiv],newMessageDiv);
    var optStr='<option value="0">Choisir une adresse</option>'
    Object.keys(pubKeys).forEach(e=>{
        optStr+='<option>'+e+'</option>';
    });
    msgAddress.innerHTML=optStr;    
}

//send a message to the server or to another peer
var add=()=>{    
    let pubPem = document.getElementById('dropdown-addresses').value;
    let message = document.getElementById('message').value;
    let encryptedMsg =''
    if(pubPem !== '0' && message !== ''){
        var publicKey = forge.pki.publicKeyFromPem(pubKeys[pubPem]);       
        try{
            encryptedMsg = forge.util.encode64(publicKey.encrypt(forge.util.encodeUtf8(message))); 
        }catch(err){
            return alert(err);
        }
        document.getElementById('message').value = '';                   
    }else{
        return alert('Tous les champs sont obligatoires.')
    }
    //ajax to send the data to the server and to receive the reponse from the server
    fetch("http://localhost:8000/addLetter",{
        method: "POST",
        headers: headers,
        body: JSON.stringify({msg:encryptedMsg})           
    }).then(res=>res.text())
    .then(text=>alert(text))
    .then(()=>getLetters())
    .catch(err=>alert(err));
};

//display all the messages
var msgs={}; //global variable for the search bar
var getLetters=()=>{
    swithStateOfDivs([actionAddressDiv,addressesDiv,newMessageDiv],messagesDiv);
    fetch("http://localhost:8000/getLetters")
    .then(res=>res.text())
    .then(text=>{
        document.querySelector("#messages-items").innerHTML=json2Html(text)['htmlStr'];
        document.getElementById('messages-counter').innerText=json2Html(text)['itemNum'];
        msgs=json2Html(text)['msgs'];
    })
    .then(()=>addDecryptAction())
    .catch(err=>document.querySelector('#messages-items').innerHTML=err);
};

//add the decryption function to each message
var addDecryptAction=()=>{
    var items=document.querySelectorAll('.item-detail');
    items.forEach(item=>{
        item.innerHTML+='<span class="decrypt" onclick="decrypt(this)">Decrypt</span>';
    });
};

//decrypt an encrypted message
var decrypt=(e)=>{    
    var encryptedMsg = e.closest('div.item-detail').innerText.split('Decrypt')[0];    
    var privateKey = forge.pki.privateKeyFromPem(localStorage.getItem('pem'));    
    var decryptedMsg = '';
    if(encryptedMsg !== ''){
        swithStateOfDivs([addressesDiv,newMessageDiv,messagesDiv],actionAddressDiv);
        try{
            decryptedMsg = forge.util.decodeUtf8(privateKey.decrypt(forge.util.decode64(encryptedMsg)));
            document.getElementById('msg-encrypted').value='Message encrypté:\n\n'+encryptedMsg;
            document.getElementById('msg-plain').value='Message décrypté:\n\n'+decryptedMsg;
        }catch(err){
            document.getElementById('msg-encrypted').value='Message encrypté:\n\n'+encryptedMsg;
            document.getElementById('msg-plain').value="Message d'erreur:\n\n"+err+" Ou vous n'êtes pas le destinataire.";
        }
    }    
};

//display all addresses (public keys)
var getPubKeys=()=>{
    swithStateOfDivs([actionAddressDiv,newMessageDiv,messagesDiv],addressesDiv);
    var addresses = localStorage.getItem('addresses');
    addressesItems.innerHTML=json2Html(addresses)['htmlStr'];
    document.getElementById('addresses-counter').innerText=json2Html(addresses)['itemNum'];
};


//search and display the messages with keywords
var searchMessages=()=>{
    var keyword=document.getElementById('messages-search').value.toLowerCase();                
    var new_msg_list=msgs.filter((e)=>e.toLowerCase().includes(keyword));             
    var str='';
    if(keyword){
        if(new_msg_list.length==0){
            str="<div class='item-detail'><label style='font-size:1.2rem'>Aucun résultat</label></div>";
        }else{
            for(let i=0; i<new_msg_list.length;i++){                
                str+="<div class='item-detail'>"+new_msg_list[i]+ "<span class='decrypt' onclick='decrypt(this)'>Decrypt</span></div>";
            }
        }
        messagesItems.innerHTML=str;
        messagesCounter.innerHTML=new_msg_list.length;
        document.getElementById('messages-search').value='';
    }else{
        getLetters();
    } 
};


//search and display the addresses with keywords
var searchAddresses=()=>{
    var keyword=document.getElementById('addresses-search').value.toLowerCase();               
    var new_ads_list=Object.values(pubKeys).filter((e)=>e.toLowerCase().includes(keyword));               
    var str='';
    if(keyword){
        if(new_ads_list.length==0){
            str="<div class='item-detail'><label style='font-size:1.2rem'>Aucun résultat</label></div>";
        }else{
            for(let i=0; i<new_ads_list.length;i++){                
                str+="<div class='item-detail'>"+new_ads_list[i]+ "</div>";
            }
        }
        addressesItems.innerHTML=str;
        addressesCounter.innerHTML=new_ads_list.length;
        document.getElementById('addresses-search').value='';
    }else{
        getPubKeys();
    } 
};


/*begin of common methods*/

// convert json string to html string
var json2Html=(text)=>{
    var str='';
    items=JSON.parse(text)
    var keys=Object.keys(items);        
    keys.forEach(element => {
        str+='<div class="item-detail">'+items[element]+'</div>';
    });
    
    return {'itemNum':keys.length, 'htmlStr':str, 'msgs':Object.values(items)};
}


//switch the visibility of a series of divs
var swithStateOfDivs=((arr,e)=>{
    for(let i of arr){
        if(!i.classList.contains('visibility'))i.classList.add('visibility');
    }
    if(e.classList.contains('visibility'))e.classList.remove('visibility');
});

/*end of common methods*/