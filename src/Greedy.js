var allEdges = [];  //ogni arco rimosso viene messo dentro questa variabile

function EseguiGreedy(){
  var fileInput = document.getElementById("inputFile").files[0];
  var fileReader = new FileReader();
  fileReader.onload = function(e){
    var testo = e.target.result;
    submitGreedy(testo);
  };  
  fileReader.readAsText(fileInput, "UTF-8");
}

var graphGreedy = new Graph();
function submitGreedy(testo){
	var archi = testo.split("\n");
	for (var i = 1 ; i < archi.length; i++) {
		var nodes = archi[i].split(",");
		graphGreedy.addVertex(parseInt(nodes[0])); 
		graphGreedy.addVertex(parseInt(nodes[1])); 
		graphGreedy.addEdge(parseInt(nodes[0]), parseInt(nodes[1]));
	}
  var div1 = document.getElementById('divID1');
  graphGreedy.printHTML(div1, "GREEDY");  //serve per stampare sulla pagina HTML
  graphGreedy.GreedySearch();
}

Graph.prototype.GreedySearch = function() {
  this.vertices.sort(sortNumber);   //sort necessario..cosi in input gli archi possono essere dati anche senza un ordine. Faccio anche un sort sugli archi,
  for(var i = 0; i<this.vertices.length; i++){  //perchè voglio dare precedenza ai nodi con valori bassi...questa cosa si fa per capire cosa stampa
    this.edges[this.vertices[i]].sort(sortNumber);  //l'algoritmo...altrimenti se inverto l'ordine degli archi in input l'uscita è diversa
  }                                                
  var Sl = [];  //sorgenti
  var Sr =[];   //pozzi
  var S = [];   //concatenazine Sl con Sr
  console.log("EURISTICA GREEDY")
  var flag = 1; //questo flag mi permetterà di capire se ho promosso qualche nodo come sorgente o pozzo
  var promotedNode; //qui metterò il valore del nodo promosso
  var promotedNodes_HTML = "";  //le due righe segueti sono per la pagina html, praticamnte questa variabile conterrà una concatenazione degli nodi promossi
  var separateLine = "<br>";  //per andare a capo
  
  while(this.vertices.length > 0){   //finchè non sono stati rimossi tutti i nodi del grafo si esegue questo while
    var label = 1;  //se il label rimane a 1 significa che non ci sono ne pozzi e ne sorgenti e quindi bisogna promuovere qualche nodo
    var index = 0;
    var maxNumberInArray = 0;
    if(flag == 0){    //tutto questo if viene eseguito se non c'erano ne pozzi e ne sorgenti nel grafo, un nodo per esempio 8 viene promosso come 
      for (var i=0; i<this.vertices.length;i++) //pozzo o sorgente...e voglio continuare la visita andando avanti...quindi 9,10...
        if (this.vertices[i] > maxNumberInArray) 
          maxNumberInArray = this.vertices[i];
      if (!(maxNumberInArray == promotedNode + 1)){ //promotedNode è il nodo rimosso (es:8) e cerco il 9..stando attento di non superare il max numero 
        for (var i = 0; i<this.vertices.length; i++) { //presente tra i nodi...cioè può essere che 8 sia il massimo e che 9 non c'è proprio
            if(this.vertices[i] == promotedNode + 1){
              index = i; //in index ci sarà l'indice dove è presente il 9 (se 8 non è il massimo)
            }
        }
        label = 0;  //perchè se promuovo il nodo 7 e dopo continuo la visita dal 8 in poi e non trovo pozzi o sorgenti...allora se non metto label=0 sto dicendo 
      }             //che non ci sono sorgenti e pozzi...ma non ho guardato tutto il grafo (nodi precedenti a 7) per dire questo perchè sono partito dal 8 in poi.
                    //Se il nodo rimosso è proprio l'ultimo es: il 10 (maxNumberInArray)...allora il label deve rimanere 1 perchè i for successivi 
                    //cominciano ad analizzare i nodi da 1....9 (10 rimosso)...e quindi si analizzano tutti i nodi prima di dire se ci sono sorgenti o pozzi
      flag = 1;     //questo if serve solo a cercare l'indice nell'array di dove si trova il valore successivo a quello rimosso (ovvero PROMOSSO a Sl o Sr) 
    }
  
    //SORGENTI E POZZI
    promotedNode = undefined;     //è necessario annullare il valore di promotedNode se no succede che assume un valore precedente
    for (i = index; i<this.vertices.length; i++) {
      if(this.edges[this.vertices[i]].length == 0){    //CERCA POZZI
        label = 0;
        Sr.unshift(this.vertices[i]);  
        graphGreedy.removeVertex(this.vertices[i]);   //rimozione nodo pozzo
        i--;  //perchè sto iterando sui nodi e rimuovo un nodo...se tolgo questa istruzione salto dei nodi
      }
      else {        //CERCA SORGENTI
        var w = 1;  //la w rimane 1 se il nodo è una sorgente
        for (var j = 0; j<this.vertices.length; j++) {
          if(this.vertices[i] != this.vertices[j])    //per evitare di confrontare gli stessi nodi
            for(var k = 0; k< this.edges[this.vertices[j]].length; k++)
              if(this.edges[this.vertices[j]][k] == this.vertices[i])
                w = 0;
        }
        if (w==1){
          label = 0;
          Sl.push(this.vertices[i]);
          graphGreedy.removeVertex(this.vertices[i]);   //rimozione nodo sorgente
          i--;       
        }  
      }
    }   

    //PROMOZIONE NODO COME SORGENTE O POZZO
    if(label == 1){   //non ci sono sorgenti e pozzi
      var diff = 0;
      var outdegIndeg_abs;  //valore assoluto di outdeg-indeg
      var outdegNodeSelect = undefined; //importante farlo perchè queste viriabili possono assumere valori precedenti...infatti con il file ordinamentoCambiato_1.txt, il nodo 7 veniva promosso come pozzo 
      var indegNodeSelect = undefined; //e successivamente il nodo 8 veniva promosso come sorgente...non dichiarando undefined, queste variabili aveveano valori di quando 7 era stato promosso come pozzo
      var nodeSelect = this.vertices[0];  //prendo il primo nodo e assumo che sia promuovere come sorgente..se no sarà cambiato
      promotedNode = nodeSelect; 
      for (var i =0; i<this.vertices.length; i++) {
        var outdeg = this.edges[this.vertices[i]].length;
        var indeg = 0;
        for(var j = 0; j< this.vertices.length; j++){
          if(this.vertices[i] != this.vertices[j])    //serve per non confrontare il nodo con se stesso
          for(var k = 0; k< this.edges[this.vertices[j]].length; k++)
            if(this.edges[this.vertices[j]][k] == this.vertices[i]){
              indeg = indeg + 1;
            }
        }
        outdegIndeg_abs = Math.abs(outdeg - indeg)
        if(diff < outdegIndeg_abs){
          outdegNodeSelect = outdeg;
          indegNodeSelect = indeg;
          diff = outdegIndeg_abs;
          nodeSelect = this.vertices[i];
          flag = 0;       //il flag viene settato a 0 solo se il nodo scelto è intermedio...se invece si scelgie il primo nodo in testa, ovvero nella posizione 0...questo flag rimane a 1
          promotedNode = nodeSelect;
        }
      }
      //console.log("nodo: "+nodeSelect+" outdeg: "+outdegNodeSelect+" indeg: "+indegNodeSelect) //se abbiamo un ciclo 1->2, 2->3, 3->1...outdegNodeSelect  
      //e indegNodeSelect non vengono definite e il nodo in posizione 0 ovvero il nodo 1 in questo caso viene promosso come sorgente.

      if ((outdegNodeSelect - indegNodeSelect) < 0){
        console.log(nodeSelect+" promosso pozzo a Sr");
        Sr.unshift(nodeSelect);
        promotedNodes_HTML = promotedNodes_HTML +nodeSelect+" promosso pozzo"+separateLine;
      }
      else {
        console.log(nodeSelect+" promosso sorgente a Sl");
        Sl.push(nodeSelect);
        promotedNodes_HTML = promotedNodes_HTML +nodeSelect+" promosso sorgente"+separateLine;

      }
      graphGreedy.removeVertex(nodeSelect);   //rimozione nodo sorgente
    }
  }

  console.log("Sl: "+Sl)
  console.log("Sr: "+Sr)
  S = Sl.concat(Sr)
  console.log("S: "+S)

  var nodoArrivo;
  var nodoPartenza;
  var indexNodoPartenzaInS;
  var indexNodoArrivoInS;
  var leftward_edges_HTML = "Leftward edges" + separateLine;  //questa riga serve per stampare sulla pagina html

  console.log("Leftward edges:") //qui stampo gli archi da invertire, ovvero quelli che ritornano verso sinistra
  for (var i =0; i<allEdges.length; i++) {
    nodoPartenza = parseInt(allEdges[i].split(" ")[0]); 
    nodoArrivo = parseInt(allEdges[i].split(" ")[1]); 
    for(var j =0; j<S.length; j++){
      if(S[j] == nodoPartenza)
        indexNodoPartenzaInS = j;
      if(S[j] == nodoArrivo)
        indexNodoArrivoInS = j;
    }
     if((indexNodoPartenzaInS - indexNodoArrivoInS) > 0){
       console.log(nodoPartenza+","+nodoArrivo)
       leftward_edges_HTML = leftward_edges_HTML+nodoPartenza+","+nodoArrivo+separateLine;
     }
  }

  var div2 = document.getElementById('divID2');
  div2.innerHTML = div2.innerHTML + promotedNodes_HTML;

  var div3 = document.getElementById('divID3');
  var le_S = "sorgenti: "+Sl+separateLine+"pozzi: "+Sr+separateLine+"S: "+S+separateLine;
  div3.innerHTML = div3.innerHTML + le_S;
  
  var div4 = document.getElementById('divID4');
  div4.innerHTML = div4.innerHTML + leftward_edges_HTML;
};







