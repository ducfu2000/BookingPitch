import React, {createContext, useState, useEffect} from 'react';
const BookingContext = createContext();

export const BookingProvider = ({children}) => {
  return <BookingContext.Provider>{children}</BookingContext.Provider>;
};
