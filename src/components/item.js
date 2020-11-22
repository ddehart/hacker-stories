import React from 'react';

import './item.css';
import { ReactComponent as Check } from './assets/check.svg';

const Item = ({ item, onRemoveItem }) => (
  <div className='story'>
    <span style={{ width: '40%' }}>
      <a href={item.url}>{item.title}</a>
    </span>
    <span style={{ width: '30%' }}>{item.author}</span>
    <span style={{ width: '10%' }}>{item.num_comments}</span>
    <span style={{ width: '10%' }}>{item.points}</span>
    <span style={{ width: '10%' }}>
      <button aria-label='Dismiss' onClick={() => onRemoveItem(item)} className='button'>
        <Check height='18px' width='18px' />
      </button>
    </span>
  </div>
);

export default Item;
