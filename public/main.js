function createTemplate(node) {
  let fragment = document.importNode(node.content, true);
  return fragment;
};

const archiveForm = document.forms['archive-form'];
const urlForm = document.forms['url-form'];
const inputGroupTemplate = document.getElementById('input-group-template');

urlForm.addEventListener('submit', event => {
  event.preventDefault();
  const urlValue = urlForm.elements['url'].value.trim();
  if (!urlValue) return;
  const template = createTemplate(inputGroupTemplate);
  const input = template.querySelector('[name="url"]');
  input.value = urlValue;
  archiveForm.prepend(template);
  urlForm.reset();
});

document.addEventListener('click', event => {
  const deleteButton = event.target.closest('.delete-button');
  if (!deleteButton) return;
  const inputGroup = deleteButton.closest('.input-group');
  inputGroup && inputGroup.remove();
});