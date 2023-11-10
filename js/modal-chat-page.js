// chat box image popup

var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption
var img = document.getElementsByClassName("sent-image");
var modalImg = document.getElementById("img01");


for(x= 0;  x< img.length; x++){
    img[x].onclick = function(){
      modal.style.display = "block";
      modalImg.src = this.src;
  }
}



// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() { 
  modal.style.display = "none";
}