import { Component, render, html, useReducer, useCallback, useRef } from 'https://unpkg.com/uland?module';

const InputGroup = Component(({ url, onDelete }) => {
  const deleteHandler = useCallback(() => {
    console.log('delete', url);
    onDelete(url);
  }, [url, onDelete]);

  return html`
    <div class="input-group">
      <input class="input-group__input | text-input" type="text" inputmode="url" placeholder="url to file" name="url" form="archive-form" readonly value=${url}>
      <div class="input-group__tools">
        <button class="delete-button" type="button" title="remove" onclick=${deleteHandler}></button>
      </div>
    </div>
  `
});

const URLForm = Component(({ onSubmit }) => {
  const submitHandler = useCallback((event) => {
    event.preventDefault();
    onSubmit(inputRef.current.value);
    inputRef.current.value = '';
  }, [onSubmit]);

  const inputRef = useRef();

  return html`
    <div class="widget url-form-widget">
      <form class="url-form" name="url-form" onsubmit=${submitHandler}>
        <input class="url-form__input | text-input" type="text" inputmode="url" name="url" placeholder="http://some-site.com/some-file.txt" ref=${inputRef}>
        <button class="url-form__submit | button" type="submit">add url</button>
      </form>
    </div>
  `;
});

const FileNameForm = () => html`
  <div class="widget">
    <div class="input-group input-group_layout_narrow">
      <input class="input-group__input | text-input" type="text" inputmode="url" placeholder="Filename" name="filename" form="archive-form">
      <span class="input-group__label | button">.zip</span>
      <span class="input-group__tools">
        <button class="button" type="submit" form="archive-form">get archive</button>
      </span>
    </div>
  </div>
`;

const ListForm = ({ items, onDelete }) => html`
  <form class="widget" name="archive-form" id="archive-form" method="post" action="/">
    ${items.map(url => InputGroup({ url, onDelete }))}
  </form>
`;

const App = Component(() => {
  const [items, dispatch] = useReducer(reducer, []);
  const onAdd = useCallback((payload) => dispatch({ type: 'add', payload }), [dispatch]);
  const onDelete = useCallback((payload) => dispatch({ type: 'delete', payload }), [dispatch]);

  return html`
    <div class="container">
      <div class="widget">
        <h1 class="title">Archiver</h1>
      </div>

      ${FileNameForm()}

      ${ListForm({
        items,
        onDelete
      })}

      ${URLForm({
        onSubmit: onAdd
      })}
    </div>
  `
});

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      return state.concat(action.payload);
    }
    case 'delete': {
      return state.filter((item) => item !== action.payload);
    }
    default:
      return state;
  }
}

render(document.getElementById('app'), App());