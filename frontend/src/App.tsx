import React, { useState, useEffect } from 'react';
import TopicComponent from './components/TopicComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

interface CustomerRepresentative {
  _id: string;
  name: string;
}

interface TopicItem {
  id: string;
  title: string;
  subTopics: string[] | TopicItem[];
}

const App: React.FC = () => {
  const [data, setData] = useState<CustomerRepresentative[]>([]);
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [currentView, setCurrentView] = useState<
    'names' | 'topics' | 'confirmation'
  >('names');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const fetchNames = () => {
    console.log('fetching names', process.env.REACT_APP_SERVER_URL);
    fetch(`${process.env.REACT_APP_SERVER_URL}/customer-service`)
      .then((response) => response.json())
      .then((data: CustomerRepresentative[]) => setData(data))
      .catch((error) => console.error('There was an error!', error));
    setCurrentView('names');
  };

  useEffect(() => {
    fetchNames();
  }, []);

  const handleNameClick = (name: string, id: string) => {
    setSelectedName(name);
    setSelectedId(id);

    console.log('id', id);
    console.log('name', name);

    fetch(`http://localhost:4000/topics`)
      .then((response) => response.json())
      .then((topics: TopicItem[]) => {
        setTopics(topics);
        setCurrentView('topics');
      })
      .catch((error) =>
        console.error('There was an error fetching topics!', error)
      );
  };

  const handleFinalSelection = (topicTitle: string) => {
    setSelectedTopic(topicTitle);
    setCurrentView('confirmation');
  };

  return (
    <div
      className='App d-flex  justify-content-center'
      style={{ minHeight: '100vh' }}
    >
      {currentView === 'names' && (
        <div className='text-center'>
          <h1>Names List</h1>
          <div className='d-flex flex-wrap justify-content-center'>
            {data.map((item) => (
              <div
                key={item._id}
                className='card m-2'
                style={{ cursor: 'pointer', width: '18rem' }}
                onClick={() => handleNameClick(item.name, item._id)}
              >
                <div className='card-body'>
                  <h5 className='card-title'>{item.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentView === 'topics' && (
        <div>
          <h1>Topics for {selectedName}</h1>
          {topics.map((topic) => (
            <TopicComponent
              key={topic.id}
              customerRepresentativeId={selectedId}
              topic={topic}
              onFinalSelect={handleFinalSelection}
            />
          ))}
          <button onClick={() => setCurrentView('names')}>Back to Names</button>
        </div>
      )}

      {currentView === 'confirmation' && (
        <div>
          <h1>Thank You!</h1>
          <p>
            {selectedName} will deal with your request regarding the topic:
            <strong>{selectedTopic}</strong>
          </p>
          <button onClick={fetchNames}>Go Back to Names</button>
        </div>
      )}
    </div>
  );
};

export default App;
