import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

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
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
// import { Admin } from './pages/admin';

const brifdalTheme = createTheme(
  {
    palette:
    {
      background: {default: '#F9F8F3'}, 
      primary: {main: '#C2A683', second: '#A38562'},
      text: {main: '#2C2A29'}
    },
    typography: 
    {
      fontFamily: '"Playfair Display", "Montserrat", "Helvetica", "Arial", sans-serif',
    }
  }
)

function App()
{

  return (
    <ThemeProvider theme={brifdalTheme}>
      <CssBaseline>
        <BrowserRouter>
          <Header />
          <Nav />
          <main>
            <Routes>
              {/* עמודים ראשיים ומידע */}
              <Route path='/' element={<Home />} />
              <Route path='/about' element={<About />} />
              <Route path='/contact' element={<Contact />} />
              
              {/* הזדהות ומשתמשים */}
              <Route path='/logIn' element={<LogIn />} />
              <Route path='/signIn' element={<SignIn />} />
              <Route path='/favorite' element={<MyFavorites />} />
              
              {/* תהליך השכרה ותשלום */}
              <Route path='/productDetails' element={<ProductDetails />} />
              <Route path='/payment' element={<Payment />} />
              <Route path='/order-success' element={<OrderSuccess />} />

              {/* <Route path='/appointment' element={<About />} />
              <Route path='/how-it-works' element={<About />} />
              <Route path='/sizing' element={<About />} /> */}
              
              <Route path='/collections' element={<Collections />}>
                <Route path=':id' element={<Category />} />
              </Route>
              {/* <Route path='/admin' element={<Admin />} /> */}
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </CssBaseline>
    </ThemeProvider>

  );
}

export default App;