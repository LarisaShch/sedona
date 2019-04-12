'use strict';
 
 var link = document.querySelector('.search__link');
 var modal = document.querySelector('.search__modal-none');

 link.addEventListener("click", function(evt) {
    evt.preventDefault();
    modal.classList.toggle('search__modal');
 });
 