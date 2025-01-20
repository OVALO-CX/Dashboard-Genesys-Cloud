import React from 'react';
import { styled } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';

const Item = styled(Sheet)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.background.level1 : '#fff',
  ...theme.typography['body-sm'],
  padding: theme.spacing(1),
  textAlign: 'center',
  borderRadius: 4,
  color: theme.vars.palette.text.secondary,
}));

export default function ResponsiveGrid({ items }) {
  return (
    <Grid
      container
      spacing={{ xs: 2, md: 3 }}
      columns={12}
      //{{ xs: 4, sm: 8, md: 12 }}
      sx={{ flexGrow: 1 }}
    >
      {items && items.map((item, index) => (
        <Grid item xs={6} sm={6} md={6} key={index}>
          <Item>{item}</Item>
        </Grid>
      ))}
    </Grid>
  );
}
