export function integrateRequirements(replaceOnce) {
  replaceOnce('function Pm(){','function Pm(){return _completion(zr,iA).answered;');
  replaceOnce('async function Dm(t=!1){','async function Dm(t=!1){if(!t&&!_checkComplete())return;');
  replaceOnce('Les r\\xE9ponses vides valent 0 point.','Toutes les questions sont renseignées.');
  replaceOnce('<button class="linkbtn" data-clear-selection>', '<button class="btn small light" data-delete-selection>Supprimer les copies sélectionnées</button><button class="linkbtn" data-clear-selection>');
  replaceOnce('<td><button class="linkbtn" data-reset="${e.id}"', '<td><button class="btn light small" data-delete-copies="${e.id}" ${e.sessionId?"":"disabled"}>Supprimer les copies</button> <button class="linkbtn" data-reset="${e.id}"');
  replaceOnce('if(e.dataset.reset){','if(e.hasAttribute("data-delete-selection")||e.dataset.deleteCopies){await _deleteCopies(e);return}if(e.dataset.reset){');
}
