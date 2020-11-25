import { sortBy } from 'lodash';
import React from 'react';

import Item from './item';

const sorts = {
  none: list => list,
  title: list => sortBy(list, 'title'),
  author: list => sortBy(list, 'author'),
  comments: list => sortBy(list, 'num_comments').reverse(),
  points: list => sortBy(list, 'points').reverse(),
};

const List = ({ list, onRemoveItem }) => {
  const [sort, setSort] = React.useState('none');

  const handleSort = sortKey => {
    setSort(sortKey);
  };

  const sortFunction = sorts[sort];
  const sortedList = sortFunction(list);

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <button onClick={() => handleSort('title')}>
          Title
        </button>
        <button onClick={() => handleSort('author')}>
          Author
        </button>
        <button onClick={() => handleSort('comments')}>
          Comments
        </button>
        <button onClick={() => handleSort('points')}>
          Points
        </button>
        <span>
          Actions
        </span>
      </div>
      <div data-testid='list-items'>
        {sortedList.map(item =>
          <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
        )}
      </div>
    </div>
  )
};

export default List;
