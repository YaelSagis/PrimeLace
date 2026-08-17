import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./styles/global.css";
import { useEffect } from 'react';

import { Header } from './components/layout/header';
import { Nav } from './components/layout/nav';
import { Footer } from './components/layout/footer';

import { Home } from './pages/home';
import { About } from './pages/about';
import { Contact } from './pages/contact';
import { LogIn } from './pages/logIn';
import { SignIn } from './pages/signIn';
import { MyFavorites } from './pages/myFavorites';
import { Payment } from './pages/payment';
import { OrderSuccess } from './pages/orderSuccess';
import { ProductDetails } from './pages/productDetails'; 
import { Collections } from './pages/collections';
import { Category } from './pages/category';
import { AdminUsers } from './components/admin/users';
import { AdminRentings } from './components/admin/rentings';
import { ProtectedRoute } from './components/presentation/protectedRoute';
import { loadUserThunk } from './redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { AdminCategories } from './components/admin/categories';
import { UpdateUser } from './pages/updateUser';
import { MyRentings } from './pages/myRentings';
import { PayPalPage } from './pages/paypal';

function App()
{
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  // Restore scroll position on navigation
  useEffect(() => {
    const scrollPositions = {};
    const handleBeforeUnload = () => {
      scrollPositions[window.location.pathname] = window.scrollY;
      sessionStorage.setItem('scrollPositions', JSON.stringify(scrollPositions));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Nav />
      <main className="page-layout">
        <Routes>
          {/* עמודים ראשיים ומידע */}
          <Route path='/' element={<div className="full-width-page"><Home /></div>} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          
          {/* הזדהות ומשתמשים */}
          <Route path='/login' element={<LogIn />} />
          <Route path='/signIn' element={<SignIn />} />
          <Route path='/updateUser' element={<ProtectedRoute><UpdateUser /> </ProtectedRoute>} />
          <Route path='/my-rentals' element={<ProtectedRoute><MyRentings/></ProtectedRoute>} />
          <Route path='/favorites' element={<ProtectedRoute><MyFavorites/></ProtectedRoute>} />
          
          {/* תהליך השכרה ותשלום */}
          <Route path='/product/:dressId' element={<ProductDetails />} />
          <Route path='/payment' element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path='/paypal' element={<ProtectedRoute><PayPalPage /></ProtectedRoute>} />
          <Route path='/orderSuccess' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

          {/* <Route path='/appointment' element={<About />} />
          <Route path='/how-it-works' element={<About />} />
          <Route path='/sizing' element={<About />} /> */}
          
          <Route path='/collections' element={<Collections />}>
            <Route path=':categoryId' element={<Category />} />
          </Route>

          <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/rentals" element={<ProtectedRoute adminOnly={true}><AdminRentings /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute adminOnly={true}><AdminCategories /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>

  );
}

export default App;