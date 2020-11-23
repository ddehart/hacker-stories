import React from 'react';

import Item from './item';

const List = ({ list, onRemoveItem }) => (
  <div>
    <div style={{ display: 'flex' }}>
      <button>
        Title
      </button>
      <button>
        Author
      </button>
      <button>
        Comments
      </button>
      <button>
        Points
      </button>
      <span>
        Actions
      </span>
    </div>
    <div data-testid='list-items'>
      {list.map(item =>
        <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
      )}
    </div>
  </div>
);

export default List;
