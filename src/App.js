import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchItems, addItem, deleteItem, toggleCheck } from './redux/itemSlice';

function App() {
  const dispatch = useDispatch();

  const { items, loading: isLoading, error: fetchError } = useSelector((state) => state.items);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setTimeout(() => {
      dispatch(fetchItems());
    }, 2000);
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    dispatch(addItem(newItem));
    setNewItem('');
  };

  const handleCheck = (id) => {
    dispatch(toggleCheck(id));
  };

  const handleDelete = (id) => {
    dispatch(deleteItem(id));
  };

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        {!fetchError && !isLoading && (
          <Content
            items={items.filter(item =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )}
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;
