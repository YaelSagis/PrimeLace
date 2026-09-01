import { BrowserRouter, Route, Routes } from 'react-router-dom';
import "./styles/global.css";
import { useEffect } from 'react';

import { Header } from './components/layout/header';
import { Nav } from './components/layout/nav';
import { Footer } from './components/layout/footer';
import { ScrollManager } from './components/layout/scrollManager';
import { ScrollToTopButton } from './components/layout/scrollToTopButton';

import { Home } from './pages/home';
import { About } from './pages/about';
import { Contact } from './pages/contact';
import { Sizing } from './pages/sizing';
import { LogIn } from './pages/logIn';
import { SignIn } from './pages/signIn';
import { MyFavorites } from './pages/myFavorites';
import { Payment } from './pages/payment';
import { OrderSuccess } from './pages/orderSuccess';
import { ProductDetails } from './pages/productDetails'; 
import { Collections } from './pages/collections';
import { Category } from './pages/category';
import { AllDresses } from './pages/allDresses';
import { AdminDashboard } from './components/admin/adminDashboard';
import { ProtectedRoute } from './components/presentation/protectedRoute';
import { loadUserThunk } from './redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { UpdateUser } from './pages/updateUser';
import { MyRentings } from './pages/myRentings';
import { PayPalPage } from './pages/paypal';
import { NotFound } from './pages/notFound';
import { ToastProvider } from './components/presentation/toast';

function App()
{
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserThunk());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollManager />
        <Header />
        <Nav />
        <main className="page-layout">
          <Routes>
            {/* עמודים ראשיים ומידע */}
            <Route path='/' element={<div className="full-width-page"><Home /></div>} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/sizing' element={<Sizing />} />

            {/* הזדהות ומשתמשים */}
            <Route path='/login' element={<LogIn />} />
            <Route path='/signIn' element={<SignIn />} />
            <Route path='/updateUser' element={<ProtectedRoute><UpdateUser /></ProtectedRoute>} />
            <Route path='/my-rentals' element={<ProtectedRoute><MyRentings/></ProtectedRoute>} />
            <Route path='/favorites' element={<ProtectedRoute><MyFavorites/></ProtectedRoute>} />

            {/* תהליך השכרה ותשלום */}
            <Route path='/product/:dressId' element={<ProductDetails />} />
            <Route path='/payment' element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path='/paypal' element={<ProtectedRoute><PayPalPage /></ProtectedRoute>} />
            <Route path='/orderSuccess' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

            <Route path='/collections' element={<Collections />}>
              <Route path=':categoryId' element={<Category />} />
            </Route>
            <Route path='/all-dresses' element={<AllDresses />} />

            <Route path="/adminDashboard" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />

            {/* כל נתיב שלא הוגדר למעלה - עמוד 404 מעוצב במקום מסך ריק */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;