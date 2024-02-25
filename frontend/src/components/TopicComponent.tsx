import React, { useState } from 'react';

interface TopicItem {
  id: string;
  title: string;
  subTopics: string[] | TopicItem[];
}

const TopicComponent: React.FC<{
  topic: TopicItem;
  customerRepresentativeId: string;
  onFinalSelect: (topicTitle: string) => void;
}> = ({ topic, customerRepresentativeId, onFinalSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateCustomerSupportAvailability = (
    customerRepresentativeId: string
  ) => {
    try {
      fetch(
        `http://localhost:4000/customer-service/${customerRepresentativeId}/toggle-availability`,
        {
          method: 'PATCH',
        }
      )
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('There was an error!', error));
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const handleClick = (item: string | TopicItem) => {
    if (typeof item === 'string') {
      const confirmSelection = window.confirm(
        `Are you sure you want to select "${item}"?`
      );
      if (confirmSelection) {
        onFinalSelect(item);
        updateCustomerSupportAvailability(customerRepresentativeId);
      }
    } else {
      if (item.subTopics.length === 0) {
        const confirmSelection = window.confirm(
          `Are you sure you want to select "${item.title}"?`
        );
        if (confirmSelection) {
          onFinalSelect(item.title);
        }
      } else {
        setIsOpen(!isOpen);
      }
    }
  };

  return (
    <div>
      <div
        onClick={() => handleClick(topic)}
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
      >
        {topic.title}
      </div>
      {isOpen && (
        <div style={{ marginLeft: '20px' }}>
          {Array.isArray(topic.subTopics) &&
            topic.subTopics.map((subTopic, index) =>
              typeof subTopic === 'string' ? (
                <div
                  key={index}
                  onClick={() => handleClick(subTopic)}
                  style={{ cursor: 'pointer' }}
                >
                  {subTopic}
                </div>
              ) : (
                <TopicComponent
                  key={subTopic.id}
                  topic={subTopic}
                  customerRepresentativeId={customerRepresentativeId}
                  onFinalSelect={onFinalSelect}
                />
              )
            )}
        </div>
      )}
    </div>
  );
};

export default TopicComponent;
