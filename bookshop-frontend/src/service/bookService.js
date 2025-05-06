// /src/service/bookService.js
export const fetchBooks = async (query = 'bestsellers') => {
  const res = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.items || [];
};
