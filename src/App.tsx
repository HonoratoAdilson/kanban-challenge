import React from 'react';
import './styles/App.css';
import Column from './components/Column';
import {Provider, getContext} from './data/Context'
import {CardModal} from './components/CardModal';

const ColumnsList: React.FC = () => {
  const { columns } = getContext();

  return (
    <div className="container">
      {
        columns.map((col, index) => (
          <Column ColumnKey={index} key={index} title={col.title} Cards={col.Cards}></Column>
        ))
      }
    </div>
  );
};

const App: React.FC = () => {

  
  return (
    <Provider>
      <div className="App">
        <CardModal></CardModal> 
        <ColumnsList></ColumnsList>
      </div>
    </Provider>
  );
}

export default App;
