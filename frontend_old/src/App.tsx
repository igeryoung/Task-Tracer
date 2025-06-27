import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ColorModeContext, useMode } from "./theme";
import { LoginRegisterPage } from './pages/login/LoginRegisterPage';
import { CalendarPage } from './pages/CalendarPage';
import { RequireAuth } from './components/RequireAuth';
import Topbar from './pages/global/Topbar';
import { Box } from '@mui/material';
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function App() {
    const [theme, colorMode] = useMode();
    return (
    
    <BrowserRouter>
      <Routes>
        {/* 根路由指向 LoginPage */}
        <Route path="/" element={<LoginRegisterPage />} />

        {/* 私有路由，登入後才可進入 */}
        <Route
          path="/home/*"
          element={
            <RequireAuth>
              <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
              <CssBaseline />
              {/* Only inside here do we need ProSidebarProvider */}
              <MyProSidebarProvider>
                <Box>
                  <Topbar />
                  <CalendarPage />
                </Box>
              </MyProSidebarProvider>
              </ThemeProvider>
              </ColorModeContext.Provider>
            </RequireAuth>
          }
        />

        {/* 404: 未匹配路由則回到登入 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



