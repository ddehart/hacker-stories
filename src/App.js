import React from 'react';

const stories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

function App() {
  return (
    <div>
      <h1>Hacker Stories</h1>

      <label htmlFor='search'>Search: </label>
      <input id='search' type='text' />

      <hr />

      <List />
    </div>
  );
}

function List() {
  return stories.map(function(story) {
    return(
      <div key={story.objectID}>
        <span>
          <a href={story.url}>{story.title}</a>
        </span>
        <span>{story.author}</span>
        <span>{story.num_comments}</span>
        <span>{story.points}</span>
      </div>
    );
  });
}

export default App;
