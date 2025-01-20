import React from 'react';
import { useDrop } from 'react-dnd';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';
//import BasicPie from './PieChart'; // Importez votre composant BasicPie

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography['body-sm'],
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

const DropZone = ({ onDrop, droppedItems, renderDroppedItem }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'item',
    drop: (item) => {
      onDrop(item.name);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      style={{
        position: 'relative',
        border: '1px solid #cccccc',
        minHeight: '50rem',
        padding: '1rem',
        backgroundColor: isOver ? '#e6e6e6' : '#F0F0F2',
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={12} // Utilise 12 colonnes pour le système de grille
        sx={{ flexGrow: 1 }}
      >
        {droppedItems.map((item, index) => (
          <Grid 
            xs={droppedItems.length === 1 ? 12 : 6} // 12 colonnes si 1 item, 6 colonnes si 2 items
            sm={droppedItems.length === 1 ? 12 : 6}
            md={droppedItems.length === 1 ? 12 : 6}
            key={index}
          >
            {renderDroppedItem(item, index)}
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default DropZone;


/*

{droppedItems.map((item, index) => {
          // Vérifier si le nombre d'items est impair
          const isLastItem = index === droppedItems.length - 1; //verifier que c'est bien le Dernier element 
          const isOdd = droppedItems.length % 2 !== 0; // le nombre est impair car le resultat est diff de 0

          return (
            <Grid
              xs={isOdd && isLastItem ? 12 : 6} // 12 colonnes pour le dernier item si impair, 6 colonnes pour les autres
              sm={isOdd && isLastItem ? 12 : 6}
              md={isOdd && isLastItem ? 12 : 6}
              key={index}
            >
              {renderDroppedItem(item, index)}
            </Grid>
          );
        })}

*/