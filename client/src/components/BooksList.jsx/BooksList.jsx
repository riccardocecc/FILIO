import React from 'react';
import './BooksList.css';
import { assets } from '../../assets/assets';

const BooksList = ({ books }) => {
  return (
    <div className="flex flex-col gap-4 scrollbar-hide">
      {books.map((book, index) => (
        
        <a href="#" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
            <img class="w-24 h-49 m-3  shadow-lg" src={book.coverUrl ?? assets.cover_book} alt=""/>
            <div class="flex flex-col justify-between p-4 leading-normal">
                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{book.book_name}</h5>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{book.author_name}</p>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{book.description.slice(0,140)}...</p>
                <div>
                <a href={`https://www.amazon.com/s?k=${encodeURIComponent(book.book_name)}&i=stripbooks-intl-ship&crid=3MDW7077ROIC5&sprefix=${encodeURIComponent(book.book_name)}%2Cstripbooks-intl-ship%2C152`} target="_blank" rel="noopener noreferrer">
  <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    Read more
      <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="https://www.vectorlogo.zone/logos/amazon/amazon-tile.svg" fill="none" viewBox="0 0 14 10">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
      </svg>
  </button>
</a>
                </div>
            </div>
        </a>

       
      ))}
    </div>
  );
};

export default BooksList;
