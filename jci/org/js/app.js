function alignElements(){
  var els = [],
  L = arguments.length;
  
  for (var i = 0; i < L; i++) {
    els.push(document.getElementById(arguments[i]));
  }      
  //Niech przegladarka sama przeliczy potrzebne wysokoœci
  for (i=0; i<L; i++){
	els[i].style.height = "auto";
  }
  //Wyznaczamy maksimum z wysokoœci
  var h = 0;
  for (i=0; i<L; i++){
	//h = Math.max(h,els[i].clientHeight);
	h = Math.max(h,els[i].offsetHeight);
  }
  //Ustawiamy sami wysokoœci
  for (i=0; i<L; i++){
	els[i].style.height = h + "px";
  }
};
