const dropdown = document.getElementsByClassName("dropdown")[0];
const profilePic = document.getElementsByClassName("profile-pic")[0];
function dropDownFunc(){
    dropdown.classList.toggle('drop-down-opacity');
}
profilePic.addEventListener("click", dropDownFunc);
