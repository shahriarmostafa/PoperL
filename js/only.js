// drop down

const dropdown = document.getElementsByClassName("dropdown")[0];
const profilePic = document.getElementsByClassName("profile-pic")[0];
function dropDownFunc(){
    dropdown.classList.toggle('drop-down-opacity');
}
profilePic.addEventListener("click", dropDownFunc);
 


// night videw

const section = document.getElementsByTagName("section")[0];
const switcher = document.getElementsByClassName("slider")[0];


function nightMode(){
    section.classList.toggle("day-view");
    section.classList.toggle("night-view");
}
switcher.addEventListener("click", nightMode);

