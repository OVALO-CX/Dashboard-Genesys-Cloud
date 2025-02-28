// DraggableItem.jsx

import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ name, selectedIcon: Icon, token }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD', // Spécification de type valide
    item: { name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
    ref={drag}
    style={{
      opacity: isDragging ? 0.5 : 1,
      cursor: 'grab',
      display:'flex',
      border: '1px solid #000',
      borderRadius: '10px',
      padding: '0.5rem',
      width: '50px', // Largeur de l'élément
      height: '30px', // Hauteur de l'élément
      marginBottom: '1rem', // Marge inférieure pour l'espacement entre les éléments
    }}
    >
        {Icon && <Icon style={{ width: '100%', height:'100%'}}/>}
    </div>
  );
};

export default DraggableItem;
