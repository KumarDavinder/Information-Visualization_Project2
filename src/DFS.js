function EseguiDFS(){
  var fileInput = document.getElementById("inputFile").files[0];
  var fileReader = new FileReader();
  fileReader.onload = function(e){
    var testo = e.target.result;
    submitDFS(testo);
  };  
  fileReader.readAsText(fileInput, "UTF-8");
}

var graphDFS = new Graph();
label = 0;  //etichetta, sarà incrementata man mano che si visiteranno i nodi

function submitDFS(testo){
	var archi = testo.split("\n");
	for (var i = 1 ; i < archi.length; i++) {
		var nodes = archi[i].split(",");
		graphDFS.addVertex(parseInt(nodes[0])); 
		graphDFS.addVertex(parseInt(nodes[1])); 
		graphDFS.addEdge(parseInt(nodes[0]), parseInt(nodes[1]));
	}
  var div5 = document.getElementById('divID5');
  graphDFS.printHTML(div5, "DFS");
  graphDFS.DFS();
}

Graph.prototype.DFS = function() {
  this.vertices.sort(sortNumber);   //sort necessario..cosi in input gli archi possono essere dati anche senza un ordine. Faccio anche un sort sugli archi,
  for(var i = 0; i<this.vertices.length; i++){  //perchè voglio dare precedenza ai nodi con valori bassi...questa cosa si fa per capire cosa stampa  
    this.edges[this.vertices[i]].sort(sortNumber);  //l'algoritmo...altrimenti se inverto l'ordine degli archi in input l'uscita è diversa
  }                                                 
  var nodiVisitati_visitePrecedenti = [];                 
  var visitedNodes = [];
  var loopEdges = [];
  var nodeLabelArray = [];
  var z = 0;
  console.log("EURISTICA DFS");
  for (var i = 0; i<this.vertices.length; i++){  //da tutti i vertici vedo quelli che ho già visitati e su quelli mancanti lancio la visita
    var w = 1;
    for (var j = 0; j<visitedNodes.length && w==1; j++){
        if(visitedNodes[j] == this.vertices[i])
            w = 0;       //controllo se tra i nodi visitati è presente il nodo this.vertices[i], quindi w=1 se il nodo this.vertices[i] non è visitato
    }
    if(w == 1){
        graphDFS.traverseDFS(this.vertices[i], function(vertex) { visitedNodes.push(vertex);}, 
        loopEdges, nodiVisitati_visitePrecedenti, nodeLabelArray); //qui lancio la DFS, come secondo parametro passo una funzione che ritorna
        //il nodo corrente visitato, es: se visito il nodo 1 l'array visitedNodes si aggiorna a 1 se visito il nodo 2 l'array si aggiorna a 1,2  
        for (var a = z; a<visitedNodes.length; a++){  //metto z per evitare di iterare ogni volta su tutto l'array visitedNodes, ovvero la prima volta magari 
          z++;                                        //questo array vale 1,2,3,4,5...e io itero 5 volte, la seconda volta l'array vale 1,2,3,4,5,6,7,8,9,10 e io itero 10 volte quando invece basta iterare da 6 in poi
          nodiVisitati_visitePrecedenti.push(visitedNodes[a]); //nodiVisitati_visitePrecedenti viene usato perchè visitedNodes cambia dinamicamente
        }                                                      // notare che non posso fare nodiVisitati_visitePrecedenti = visitedNodes, perchè avrei un passaggio di referimento e quindi si hanno variazione dinamiche su tutte e due
        //nodiVisitati_visitePrecedenti = removeDuplicates(nodiVisitati_visitePrecedenti); //grazie all'aggiunta di z non serve la funzione rimuovere duplicati
        //console.log(nodiVisitati_visitePrecedenti);
    }
  }

  var separateLine = "<br>";    //queste tre righe servono per stampare sulla pagina html
  var probables_loops = "Archi che possono causare un loop" + separateLine;
  var archiDaInvertire = "Archi da invertire" + separateLine;

  console.log("Archi che possono causare un loop:")
  console.log(loopEdges);
  console.log("Nodo etichetta:");  
  console.log(nodeLabelArray);  
  console.log("Archi da invertire:") 
  var nodoLabelVisita;
  for (var i = 0; i<loopEdges.length; i++){ //Se il nodo di partenza ha un etichetta di valore più alto della etichetta del nodo di destinazione si inverte l'arco
    var labelPartenza;                      
    var labelArrivo;
    var elem = loopEdges[i].split(" ");
    var nodoPartenza = elem[0];
    var nodoArrivo = elem[1];
    probables_loops = probables_loops + nodoPartenza+","+nodoArrivo+separateLine; //serve per stampare sulla pagina html
    for (var j = 0; j<nodeLabelArray.length; j++){
      nodoLabelVisita = nodeLabelArray[j].split(",");
      if(nodoPartenza == nodoLabelVisita[0])
        labelPartenza = nodoLabelVisita[1]
      if(nodoArrivo == nodoLabelVisita[0])
        labelArrivo = nodoLabelVisita[1]
    }
    if (parseInt(labelPartenza) > parseInt(labelArrivo)){ //parseInt perchè sono delle stringhe
      console.log(nodoPartenza+","+nodoArrivo)
      archiDaInvertire = archiDaInvertire+nodoPartenza+","+nodoArrivo+separateLine;
    }
  }
  console.log("\n\n");

  var node_label = "Nodo etichetta" + separateLine;
  for (var j = 0; j<nodeLabelArray.length; j++){
      nodoLabelVisita = nodeLabelArray[j].split(",");
      node_label = node_label+nodoLabelVisita[0]+","+nodoLabelVisita[1]+separateLine;  //sempre per stampare su html
  }

  var div6 = document.getElementById('divID6');
  div6.innerHTML = div6.innerHTML + probables_loops;

  var div7 = document.getElementById('divID7');
  div7.innerHTML = div7.innerHTML + node_label;

  var div8 = document.getElementById('divID8');
  div8.innerHTML = div8.innerHTML + archiDaInvertire;
}

Graph.prototype.traverseDFS = function(vertex, fn, loopEdges, nodiVisitati_visitePrecedenti, nodeLabelArray) {
  if(!~this.vertices.indexOf(vertex)) {
    return console.log('Vertex not found');
  }
  var visited = [];
  for (var i = 0; i< nodiVisitati_visitePrecedenti.length; i++){ //nodi di visite precedenti sono considerati visitati
    visited[nodiVisitati_visitePrecedenti[i]] = true;
  }
  label = label+1;
  this._traverseDFS(vertex, fn, loopEdges, nodiVisitati_visitePrecedenti, nodeLabelArray, visited);
};

Graph.prototype._traverseDFS = function(vertex, fn, loopEdges, nodiVisitati_visitePrecedenti, nodeLabelArray, visited) {
  visited[vertex] = true;
  nodeLabelArray.push(vertex+","+label);
  fn(vertex);        //si chiama il secondo parametro della funzione a riga 46, praticamente seve per aggiungere vertex a visitedNodes           
  for(var i = 0; i < this.edges[vertex].length; i++) {
    if(visited[this.edges[vertex][i]]){   //questo if serve per non considerare gli archi tra visite diverse. Praticamete quando entro in
        var y = 1;   //questo if so che il nodo è stato visitato..ma non so se è stato visitato con la visita attuale o era stato visitato
        for(var j = 0; j < nodiVisitati_visitePrecedenti.length && y==1; j++) //con le visite precendi...se è attuale è un probabile loop
            if(nodiVisitati_visitePrecedenti[j] == this.edges[vertex][i] )  //questo if dice: questo nodo visitato è tra i nodi visitati nelle visite precedenti?
                y = 0;
        if(y == 1)    //se entro in questo if significa che il nodo è stato rivisitato nella stessa visita
            loopEdges.push(vertex +" "+this.edges[vertex][i]);
    }
    if(!visited[this.edges[vertex][i]]) { 
       label = label +1;
       this._traverseDFS(this.edges[vertex][i], fn, loopEdges, nodiVisitati_visitePrecedenti, nodeLabelArray, visited);
    }
  }
};


//DA QUI IN POI MI FACCIO DELLE DOMANDE E LE RISPONDO...SPERO CHE POSSANO SERVIRE A CHI VORRA' METTERE LE MANI SUL CODICE
// Domanda 1: io creo un grafo e associo ad esso i prototype tipo...perché?
// Domanda 2: definisco una funzione Grafo...cosa significano "this."?...se voglio alla fine di tutto il codice farmi dare this.vertices..come faccio?
// Domanda 3: cosa succede alla riga 119...fn(vertex)? cosa è fn?

// risposta 1
// prototype è il modo che si usa per aggiungere metodi ad un oggetto/classe/funzione
// lo fai con nome_classe.prototype.nome_metodo = function(){...}
// la cosa però è più sottile, perchè in javascript tutto è un oggetto
// la notazione punto aggiunge un "campo" all'oggetto....quindi in pratica aggiungi un campo

// risposta 2: 
// i this in javascript hanno lo stesso significato dei this in java fanno riferimento alla variabile di quell'oggetto
// Bisogna guardare le cose in questo modo:
// dentro una funzione se si dichiara una variabile con "var", è locale al metodo, se non la si dichiara con nulla e non è mai esistita o 
// comunque è la prima volta nel metodo, la cerca negli "scope" precedenti, fino ad arrivare allo scope globale,
// in più l'uso del THIS fa in modo che un oggetto abbia le sue variabili, sopravvivono i metodi

// risposta 3: 
// in pratica fn è :
// il 2° parametro di _traverseDFS...che però è invocata da traverseDFS dove fn è di nuovo il 2° parametro
// e a sua volta è invocata da DFS
// quella funzione è una cosa che semplicemente prende l'unico argomento che gli viene passato e fa il push di vertex in visitedNodes
