function Graph() {    //un grafo è fatto da un insieme di archi e un insieme di vertici
  this.vertices = [];
  this.edges = [];    //this.edges[0] --> è un vettore composto da interi che mi dice a quali nodi si collega il nodo this.edges[0]
}

//si aggiungono i nodi, facendo attenzione di non avere doppioni, se ho arco (5,3) (7,5) non devo avere due 5
Graph.prototype.addVertex = function(vertex) {  
    var k = 1;
    for (var j = 0 ; j < this.vertices.length && k==1; j++)
      if(this.vertices[j] == vertex)
        k = 0;
    if(k==1){
      this.vertices.push(vertex);
      this.edges[vertex] = [];
    }
};

Graph.prototype.removeVertex = function(vertex) {
  for (var i = 0; i<this.edges[vertex].length; i++) { //RIMOZIONE ARCHI USCENTI
    var adjacentVertex = this.edges[vertex][i];
    this.removeEdge(vertex, adjacentVertex);
    i--;    //lo faccio perchè ho rimosso un arco e sto iterando sui archi...altrimenti mi perderei degli archi
  }         
  for (var j = 0; j<this.vertices.length; j++) { //RIMOZIONE ARCHI ENTRANTI
    for(var k = 0; k< this.edges[this.vertices[j]].length; k++)
        if(this.edges[this.vertices[j]][k] == vertex){
            this.removeEdge(this.vertices[j], vertex)
            k--;    //può essere non necessario perchè un nodo ha al massimo un arco verso un'altro nodo e quindi anche se salto degli archi 
        }           //nella visita non succede niente...perchè ho già trovato quello che mi serviva...ma ce lo lasciamo lo stesso.
  }
  var index = this.vertices.indexOf(vertex);  //RIMOZIONE NODO
  if(index > -1) {
    this.vertices.splice(index, 1);   //dal indice in poi rimuovi solo un elemento
  }
};

Graph.prototype.addEdge = function(vertex1, vertex2) { //aggiunta archi
  this.edges[vertex1].push(vertex2);
};

Graph.prototype.removeEdge = function(vertex1, vertex2) {
  allEdges.push(vertex1+" "+vertex2);
  var index1 = this.edges[vertex1] ? this.edges[vertex1].indexOf(vertex2) : -1;
  var index2 = this.edges[vertex2] ? this.edges[vertex2].indexOf(vertex1) : -1;
  if(~index1) {
    this.edges[vertex1].splice(index1, 1);
    this.numberOfEdges--;
  }
  if(~index2) {
    this.edges[vertex2].splice(index2, 1);
  }
};

Graph.prototype.print = function() {  //stampa il grafo su console
  console.log(this.vertices.map(function(vertex) {
    return (vertex + ' -> ' + this.edges[vertex].join(', ')).trim();
  }, this).join(' | '));
};

Graph.prototype.printHTML = function(div, algorithmName) {  //stampa il grafo sulla pagina HTML
   var separateLine = "<br>";  //serve per andare a capo
   var nodeEdges = separateLine+"<h2>"+algorithmName+separateLine+"</h2>"+"Grafo " + separateLine;
   for (var i=0; i < this.vertices.length; i++) {
      nodeEdges = nodeEdges+this.vertices[i]+" --> "+this.edges[this.vertices[i]]+separateLine; 
   }
   div.innerHTML = div.innerHTML + nodeEdges;
};

/*****************************FINE DEFINIZIONE GRAFO***********************************/

function removeDuplicates(num) { //questa funzione rimuove doppioni in un array e ritorna un array
    var x,                       //non viene utilizzata perchè si risolve il problema diversamente
    len=num.length,
    out=[],
    obj={};
    for (x=0; x<len; x++) {
      obj[num[x]]=0;
    }
    for (x in obj) {
      out.push(parseInt(x));
    }
    return out;
}

function sortNumber(a,b) {  //console.log(array.sort(sortNumber)); ritorna un array ordinato
    return a - b;
}