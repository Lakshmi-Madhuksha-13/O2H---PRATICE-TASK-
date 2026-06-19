import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  LayoutDashboard,
  CheckSquare,
  Trello,
  User,
  Settings,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Tasks List', path: '/tasks', icon: CheckSquare },
    { name: 'Kanban Board', path: '/kanban', icon: Trello },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const getPageTitle = () => {
    const item = navItems.find((x) => x.path === location.pathname);
    return item ? item.name : 'Taskora';
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 light:bg-slate-50 light:text-slate-950 transition-colors duration-300">
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 light:border-slate-200 bg-slate-950 light:bg-white p-6 shrink-0">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 mb-10">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Trello className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 light:text-slate-900 m-0 leading-none">
              Taskora
            </h1>
            <p className="text-[10px] uppercase font-semibold text-slate-500 light:text-slate-400 mt-1 tracking-widest leading-none">
              Organize. Execute.
            </p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                      : 'text-slate-400 light:text-slate-600 hover:bg-slate-900 light:hover:bg-slate-100 hover:text-slate-100 light:hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info & Logout */}
        <div className="border-t border-slate-900 light:border-slate-100 pt-5 mt-5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-9 w-9 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-slate-200 light:text-slate-950">
                {user?.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full text-rose-500 hover:bg-rose-950/10 hover:text-rose-400"
            icon={LogOut}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* 2. MOBILE MENU DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-slate-950 light:bg-white border-r border-slate-800 p-6 animate-slide-in">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-1 hover:bg-slate-800 light:hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-2.5 mb-10">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Trello className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-100 light:text-slate-900 m-0">
                Taskora
              </h1>
            </div>

            {/* Links */}
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 light:text-slate-600 hover:bg-slate-900 light:hover:bg-slate-100 hover:text-slate-100 light:hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-slate-900 light:border-slate-100 pt-5 mt-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-9 w-9 rounded-full bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-slate-200 light:text-slate-950">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full text-rose-500 hover:bg-rose-950/10 hover:text-rose-400"
                icon={LogOut}
              >
                Logout
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* 3. MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* HEADER */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 light:border-slate-200 bg-slate-950/50 light:bg-white/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 hover:bg-slate-900 light:hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg lg:text-xl font-bold tracking-tight text-slate-100 light:text-slate-900 m-0">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-950 light:hover:bg-slate-100 border border-slate-800 light:border-slate-200 rounded-xl text-slate-400 hover:text-slate-100 light:hover:text-slate-900 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-indigo-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>

            {/* Premium tag */}
            <div className="hidden sm:flex items-center space-x-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
              <Sparkles className="h-3 w-3" />
              <span>SaaS Pro</span>
            </div>
          </div>
        </header>

        {/* CORE WORKSPACE CONTENT */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
